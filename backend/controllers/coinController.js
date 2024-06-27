import Coin from "../models/coinModel.js";
import Transaction from "../models/transactionsModel.js";
import User from "../models/userModel.js";

export const createCoin = async (req, res) => {
  const { name, userId } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Selection d'un token requis !" });
  }

  if (!userId) {
    return res.status(400).json({ error: "User id not found !" });
  }

  try {
    const coin = await Coin.create({ name, users: userId });

    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        coins: coin._id,
      },
    });

    res.status(200).json(coin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const addTransactionToCoin = async (req, res) => {
  const { coinId, transactionData, userId } = req.body;

  if (!coinId || !transactionData) {
    return res
      .status(400)
      .json({ error: "Coin ID et données de transaction requis !" });
  }

  if (!userId) {
    return res.status(400).json({ error: "User ID requis !" });
  }

  try {
    const transaction = await Transaction.create({
      ...transactionData,
      coin: coinId,
      users: userId,
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { transactions: transaction._id },
    });

    await Coin.findByIdAndUpdate(coinId, {
      $addToSet: { transactions: transaction._id },
    });

    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCoin = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    // Find the coin by ID
    const coin = await Coin.findById(id);

    if (!coin) {
      return res.status(404).json({ error: "Coin not found" });
    }

    // Update the coin
    coin.name = name;

    await coin.save();

    res.status(200).json({ coin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
