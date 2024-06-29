import Coin from "../models/coinModel.js";
import Transaction from "../models/transactionsModel.js";
import User from "../models/userModel.js";
import {
  transactionSchema,
  coinSchema,
  idSchema,
} from "../schemas/transactionsSchema.js";

export const createCoin = async (req, res) => {
  const { name } = req.body;
  const { id: userId } = req.user;

  const { error: coinError } = coinSchema.validate(req.body);
  const { error: userIdError } = idSchema.validate({ id: userId });
  if (coinError) {
    return res.status(400).json({ error: coinError.details[0].message });
  }
  if (userIdError) {
    return res.status(400).json({ error: userIdError.details[0].message });
  }

  if (!name) {
    return res.status(400).json({ error: "Selection d'un token requis !" });
  }

  if (!userId) {
    return res.status(400).json({ error: "User id not found !" });
  }

  try {
    // Vérifie si un coin avec le même nom existe déjà
    let coin = await Coin.findOne({ name });

    if (!coin) {
      // Si le coin n'existe pas, crée un nouveau coin
      coin = await Coin.create({ name });
    }

    // Ajoute l'utilisateur à la liste des utilisateurs du coin si nécessaire
    if (!coin.users.includes(userId)) {
      coin.users.push(userId);
      await coin.save();
    }

    // Ajoute le coin à la liste des coins de l'utilisateur
    await User.findByIdAndUpdate(userId, {
      $addToSet: { coins: coin._id },
    });

    res.status(200).json(coin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const addTransactionToCoin = async (req, res) => {
  const { coinId, quantity, price, spent, date } = req.body;
  const { id: userId } = req.user;

  const { error: coinError } = transactionSchema.validate(req.body);
  const { error: userIdSchema } = idSchema.validate({ id: userId });
  if (coinError) {
    return res.status(400).json({ error: coinError.details[0].message });
  }
  if (userIdSchema) {
    return res.status(400).json({ error: userIdSchema.details[0].message });
  }

  if (!coinId || !quantity || !price || !spent || !date) {
    return res
      .status(400)
      .json({ error: "Coin ID et données de transaction requis !" });
  }

  if (!userId) {
    return res.status(400).json({ error: "User ID requis !" });
  }

  try {
    const transaction = await Transaction.create({
      quantity: quantity,
      price: price,
      spent: spent,
      date: date,
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

  const { error: coinName } = coinSchema.validate(req.body);
  const { error: idSchema } = idSchema.validate(req.params);
  if (idSchema) {
    return res.status(400).json({ error: idSchema.details[0].message });
  }
  if (coinName) {
    return res.status(400).json({ error: coinName.details[0].message });
  }

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
