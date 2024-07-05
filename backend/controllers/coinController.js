import mongoose from "mongoose";
import Coin from "../models/coinModel.js";
import Transaction from "../models/transactionsModel.js";
import User from "../models/userModel.js";
import {
  transactionSchema,
  coinSchema,
  idSchema,
  coinAndTransactionSchema,
} from "../schemas/transactionsSchema.js";

export const createCoinAndTransaction = async (req, res) => {
  const session = await mongoose.startSession();

  const { quantity, price, spent, date, name } = req.body;
  const { id: userId } = req.user;
  const { error: transactionError } = coinAndTransactionSchema.validate(req.body);
  const { error: userIdError } = idSchema.validate({ id: userId });
  
  if (transactionError || userIdError) {
    return res.status(400).json({
      error: (transactionError || userIdError).details[0].message,
    });
  }

  session.startTransaction();
  try {
    let coin = await Coin.findOne({ name });

    if (!coin) {
      coin = await Coin.create({ name });
    }

    const coinId = coin._id;
    if (!coin.users.includes(userId)) {
      coin.users.push(userId);
      await coin.save();
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: { coins: coin._id },
    });

    const transaction = await Transaction.create({
      quantity,
      price,
      spent,
      date,
      coin: coinId,
      users: userId,
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { transactions: transaction._id },
    });

    await Coin.findByIdAndUpdate(coinId, {
      $addToSet: { transactions: transaction._id },
    });

    await session.commitTransaction();
    res.status(200).json({ coin, transaction });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
};


export const updateCoin = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const { error: coinError } = coinSchema.validate(req.body);
  const { error: idError } = idSchema.validate({ id });

  if (coinError || idError) {
    return res.status(400).json({
      error: (coinError || idError).details[0].message,
    });
  }

  try {
    const coin = await Coin.findById(id);

    if (!coin) {
      return res.status(404).json({ error: "Coin not found" });
    }

    coin.name = name;
    await coin.save();

    res.status(200).json({ coin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDetailedTransactions = async (req, res) => {
  const { id } = req.params;
  const { id: idUser } = req.user;

  const { error: coinIdError } = idSchema.validate({ id });
  const { error: idError } = idSchema.validate({ id: idUser });
  if (coinIdError || idError) {
    return res.status(400).json({
      error: (coinIdError || idError).details[0].message,
    });
  }

  try {
    const coin = await Coin.find({ _id: id, users: idUser });

    if (!coin || coin.length === 0) {
      return res.status(404).json({ error: "Coin not found for this user" });
    }

    return res.status(200).json(coin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
