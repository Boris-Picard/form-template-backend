import User from "../models/userModel.js";
import userSchema from "../schemas/userSchema.js";

export const signUp = async (req, res) => {
  const { mail, password } = req.body;

  if (!mail || !password) {
    res.status(401).json({ error: "All fields are required !" });
    return;
  }

  try {
    userSchema.parse({ mail, password });
  } catch (error) {
    return res.status(400).json({ error: error.errors });
  }

  // const existingUser = await User.findOne({ mail });

  // if (existingUser) {
  //   res.status(401).json({ error: "User already exist" });
  //   return;
  // }

  try {
    const user = await User.create({ mail, password });

    const token = await user.generateToken();

    res.status(200).json({
      token,
      user: {
        id: user._id,
        mail: user.mail,
        role: user.role,
        transactions: user.transactions,
        coins: user.coins,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(401).json({ error: error });
  }
};
