import Coin from "../models/coinModel.js";
import Transaction from "../models/transactionsModel.js";

export const createCoin = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send({ error: "Selection d'un token requis !" });
  }

  try {
    const coin = await Coin.create({ name });
    res.status(200).json(coin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const addTransactionToCoin = async (req, res) => {
  const { coinId, transactionData } = req.body;

  if (!coinId || !transactionData) {
    return res.status(400).send({ error: "Coin ID et données de transaction requis !" });
  }

  try {
    const transaction = await Transaction.create({
      ...transactionData,
      coin: coinId,
    });

    await Coin.findByIdAndUpdate(coinId, {
      $addToSet: { transactions: transaction._id },
    });

    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
