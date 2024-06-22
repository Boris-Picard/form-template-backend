import User from "../models/userModel.js";

export const signUp = async (req, res) => {
  const { mail, password } = req.body;

  if (!mail || !password) {
    res.status(401).json({ error: "All fields are required !" });
    return;
  }

  // const existingUser = await User.findOne({ mail });

  // if (existingUser) {
  //   res.status(401).json({ error: "User already exist" });
  //   return;
  // }

  try {
    const user = await User.create({ mail, password });
    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ error: error });
  }
};
