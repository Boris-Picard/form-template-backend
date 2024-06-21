import User from "../models/userModel.js";

export const createUser = async (req, res) => {
  const { mail, password } = req.body;

  if (!mail || !password) {
    res.status(400).send({ error: "All fields are required !" });
    return;
  }

  try {
    const user = await User.create({ mail, password });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};
