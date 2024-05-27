import coinModel from "../models/coinModel.js";

export const createCoin = async (req, res) => {
  const { name, transactions } = req.body;

  if (!name) {
    res.status(400).send({ message: "Selection d'un token requis !" });
  }

  try {
    const coin = await coinModel.create({ name, transactions });
    res.status(200).json(coin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

