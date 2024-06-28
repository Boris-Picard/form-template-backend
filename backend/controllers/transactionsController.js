import Transaction from "../models/transactionsModel.js";
import Coin from "../models/coinModel.js";
import User from "../models/userModel.js";

// export const createTransaction = async (req, res) => {
//   const { quantity, price, spent, date, coinId } = req.body;

//   if (!quantity || !price || !spent || !date || !coinId) {
//     return res.status(400).send({ error: "Tous les champs sont requis !" });
//   }

//   try {
//     const transaction = await Transaction.create({
//       quantity,
//       price,
//       spent,
//       date,
//       coin: coinId,
//     });

//     // Mettre à jour le coin avec la nouvelle transaction
//     await Coin.findByIdAndUpdate(coinId, {
//       $addToSet: { transactions: transaction._id },
//     });

//     return res.status(200).json(transaction);
//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// };

export const createOnlyTransaction = async (req, res) => {
  const { name } = req.params;
  const { quantity, price, spent, date, coinId } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Coin required" });
  }

  if (!quantity || !price || !spent || !date || !coinId) {
    return res.status(400).json({ error: "Tous les champs sont requis !" });
  }

  try {
    const transaction = await Transaction.create({
      quantity,
      price,
      spent,
      date,
      coin: coinId,
    });

    await Coin.findByIdAndUpdate(coinId, {
      $addToSet: { transactions: transaction._id },
    });

    return res.status(200).json(transaction);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getCoins = async (req, res) => {
  const { id } = req.user;

  if (!id) {
    return res.status(400).json({ error: "User required" });
  }

  try {
    const user = await User.findById(id);

    if (id == user._id) {
      const transactions = await Transaction.find({ users: id }).populate(
        "coin",
        "name"
      );
      return res.status(200).json(transactions);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCoinAndTransactions = async (req, res) => {
  const { id } = req.params;

  try {
    // Trouver le coin
    const coin = await Coin.findById(id).populate("transactions");

    if (!coin) {
      return res.status(404).json({ error: "Coin not found" });
    }

    // Récupérer toutes les transactions associées au coin
    const transactions = coin.transactions;

    // Supprimer toutes les transactions associées
    for (const transaction of transactions) {
      await Transaction.findByIdAndDelete(transaction._id);
    }

    // Supprimer le coin
    await Coin.findByIdAndDelete(id);

    res.status(200).json({
      success: "Coin and all associated transactions deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCoin = async (req, res) => {
  const { id, name } = req.params;
  if (id) {
    try {
      const transaction = await Transaction.findById(id).populate(
        "coin",
        "name"
      );
      res.status(200).json({ transaction });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (name) {
    try {
      const coin = await Coin.find({ name });
      res.status(200).json({ coin });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { quantity, price, spent, date } = req.body;

  try {
    // Find the transaction by ID and update it
    const transaction = await Transaction.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(quantity !== undefined && { quantity }),
          ...(price !== undefined && { price }),
          ...(spent !== undefined && { spent }),
          ...(date !== undefined && { date }),
        },
      },
      { new: true } // Return the updated transaction
    );

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Find the associated coin
    const coin = await Coin.findById(transaction.coin);

    if (!coin) {
      return res.status(404).json({ error: "Associated coin not found" });
    }

    // Ensure the transaction ID is in the coin's transactions array
    if (!coin.transactions.includes(transaction._id)) {
      coin.transactions.push(transaction._id);
      await coin.save();
    }

    res.status(200).json({ transaction, coin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Trouver la transaction par son ID
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Supprimer la transaction de la base de données
    await Transaction.findByIdAndDelete(id);

    // Mettre à jour le coin pour retirer l'ID de la transaction
    await Coin.findByIdAndUpdate(transaction.coin, {
      $pull: { transactions: id },
    });

    // Vérifier si le coin n'a plus de transactions
    const coin = await Coin.findById(transaction.coin);
    if (coin.transactions.length === 0) {
      await Coin.findByIdAndDelete(coin._id);
    }

    res
      .status(200)
      .json({ success: "Transaction deleted successfully and coin updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
