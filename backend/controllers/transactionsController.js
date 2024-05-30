import Transaction from "../models/transactionsModel.js";
import Coin from "../models/coinModel.js";

export const createTransaction = async (req, res) => {
  const { quantity, price, spent, date, coinId } = req.body;

  if (!quantity || !price || !spent || !date || !coinId) {
    return res.status(400).send({ message: "Tous les champs sont requis !" });
  }

  try {
    const transaction = await Transaction.create({
      quantity,
      price,
      spent,
      date,
      coin: coinId,
    });

    // Mettre à jour le coin avec la nouvelle transaction
    await Coin.findByIdAndUpdate(coinId, {
      $addToSet: { transactions: transaction._id },
    });

    return res.status(200).json(transaction);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getCoins = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("coin", "name");
    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await Coin.updateOne(
      { _id: transaction.coin },
      { $pull: { transactions: transaction._id } }
    );

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
