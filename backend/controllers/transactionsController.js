import transactionModel from "../models/transactionsModel.js";

export const createCoin = async (req, res) => {
  const { quantity, price, spent, date } = req.body;

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

  try {
    const transaction = await transactionModel.create({
      quantity,
      price,
      spent,
      date,
    });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
