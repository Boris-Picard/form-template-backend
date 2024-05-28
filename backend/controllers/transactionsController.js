import transactionModel from "../models/transactionsModel.js";
import coinModel from "../models/coinModel.js";

export const createTransaction = async (req, res) => {
  const { quantity, price, spent, date, coinId } = req.body;

  if (!quantity) {
    res.status(400).send({ message: "Quantité requise !" });
  }

  if (!price) {
    res.status(400).send({ message: "Prix requis !" });
  }

  if (!spent) {
    res.status(400).send({ message: "Dépense requise !" });
  }

  if (!date) {
    res.status(400).send({ message: "Date requise !" });
  }

  if (!coinId) {
    return res.status(400).send({ message: "Coin ID requis !" });
  }

  try {
    const transaction = await transactionModel.create({
      quantity,
      price,
      spent,
      date,
      coin: coinId,
    });

    // Mettre à jour le coin avec la nouvelle transaction
    await coinModel.findByIdAndUpdate(coinId, {
      push: { transactions: transaction._id },
    });

    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
