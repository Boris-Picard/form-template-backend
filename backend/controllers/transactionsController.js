import Transaction from "../models/transactionsModel.js";
import Coin from "../models/coinModel.js";
import User from "../models/userModel.js";
import {
  coinSchema,
  idSchema,
  transactionSchema,
  updateTransactionSchema,
  idGetCoinSchema,
  coinSchemaNotRequired,
} from "../schemas/transactionsSchema.js";

export const createOnlyTransaction = async (req, res) => {
  const { name } = req.params;
  const { quantity, price, spent, date, coinId } = req.body;
  const { id: userId } = req.user;

  const { error: coinError } = transactionSchema.validate(req.body);
  const { error: nameError } = coinSchema.validate(req.params);
  const { error: userError } = idSchema.validate({ id: userId });

  if (coinError || nameError || userError) {
    return res.status(400).json({
      error: (coinError || nameError || userError).details[0].message,
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    if (user._id.toString() !== userId) {
      return res.status(403).json({ error: "Permission denied" });
    }

    const transaction = await Transaction.create({
      quantity,
      price,
      spent,
      date,
      coin: coinId,
      users: userId,
    });

    await Coin.findByIdAndUpdate(coinId, {
      $addToSet: { transactions: transaction._id },
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        transactions: transaction._id,
        coins: transaction.coin.coinId,
      },
    });

    return res.status(200).json(transaction);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getCoins = async (req, res) => {
  const { id: userId } = req.user;

  const { error } = idSchema.validate({ id: userId });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const transactions = await Transaction.find({ users: userId }).populate(
      "coin",
      "name"
    );
    return res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCoinAndTransactions = async (req, res) => {
  const { id: coinId } = req.params;
  const { id: userId } = req.user;

  const { error: coinError } = idSchema.validate({ id: coinId });
  const { error: userError } = idSchema.validate({ id: userId });

  if (coinError || userError) {
    return res.status(400).json({
      error: (coinError || userError).details[0].message,
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const coin = await Coin.findOne({ _id: coinId, users: userId }).populate(
      "transactions"
    );
    if (!coin) {
      return res
        .status(404)
        .json({ error: "Coin not found or not associated with this user" });
    }

    const userTransactions = coin.transactions.filter((transaction) =>
      transaction.users.includes(userId)
    );
    const userTransactionIds = userTransactions.map(
      (transaction) => transaction._id
    );

    await Transaction.deleteMany({
      _id: { $in: userTransactionIds },
      users: userId,
    });
    await User.findByIdAndUpdate(userId, {
      $pull: { transactions: { $in: userTransactionIds }, coins: coinId },
    });
    await Coin.findByIdAndUpdate(coinId, {
      $pull: { users: userId, transactions: { $in: userTransactionIds } },
    });

    const remainingCoin = await Coin.findById(coinId).populate("transactions");
    if (
      remainingCoin.users.length === 0 &&
      remainingCoin.transactions.length === 0
    ) {
      await Coin.findByIdAndDelete(coinId);
    }

    res.status(200).json({
      success: "Coin and all associated transactions deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCoin = async (req, res) => {
  const { id, name } = req.params;
  const { id: idUser } = req.user;

  const { error: idError } = idGetCoinSchema.validate({ id });
  const { error: idUserError } = idSchema.validate({ id: idUser });
  const { error: nameError } = coinSchemaNotRequired.validate({ name });
  if (idError || nameError || idUserError) {
    return res.status(400).json({
      error: (idError || nameError || idUserError).details[0].message,
    });
  }

  try {
    if (id) {
      const transaction = await Transaction.findById(id).populate(
        "coin",
        "name"
      );
      res.status(200).json({ transaction });
    } else if (name) {
      const coin = await Coin.find({ name });
      res.status(200).json({ coin });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { quantity, price, spent, date } = req.body;
  const { id: idUser } = req.user;

  const { error: transactionError } = updateTransactionSchema.validate(
    req.body
  );
  const { error: idError } = idSchema.validate({ id });
  const { error: idUserError } = idSchema.validate({ id: idUser });

  if (transactionError || idError || idUserError) {
    return res.status(400).json({
      error: (transactionError || idError || idUserError).details[0].message,
    });
  }

  try {
    const user = await User.findById(idUser);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    if (transaction.users.toString() !== idUser) {
      return res.status(403).json({ error: "Permission denied" });
    }

    const updateTransaction = await Transaction.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(quantity && { quantity }),
          ...(price && { price }),
          ...(spent && { spent }),
          ...(date && { date }),
        },
      },
      { new: true }
    );

    const coin = await Coin.findById(updateTransaction.coin);
    if (!coin) {
      return res.status(404).json({ error: "Associated coin not found" });
    }

    res.status(200).json({ transaction, coin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  const { id: userId } = req.user;
  const { id } = req.params;

  const { error: transactionIdError } = idSchema.validate({ id });
  const { error: userIdError } = idSchema.validate({ id: userId });
  if (transactionIdError || userIdError) {
    return res
      .status(400)
      .json({ error: (transactionIdError || userIdError).details[0].message });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    if (transaction.users.toString() !== userId) {
      return res.status(403).json({ error: "Permission denied" });
    }

    await Transaction.findByIdAndDelete(id);

    await Coin.findByIdAndUpdate(transaction.coin, {
      $pull: { transactions: id },
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { transactions: id },
    });

    const coin = await Coin.findById(transaction.coin);
    if (coin.transactions.length === 0) {
      await Coin.findByIdAndDelete(coin._id);
      await User.findByIdAndUpdate(userId, {
        $pull: { coins: coin._id },
      });
    }

    res
      .status(200)
      .json({ success: "Transaction deleted successfully and coin updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
