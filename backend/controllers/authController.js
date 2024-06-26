import User from "../models/userModel.js";
import userSchema from "../schemas/userSchema.js";

export const signUp = async (req, res) => {
  const { mail, password } = req.body;

  try {
    userSchema.parse({ mail, password });
  } catch (error) {
    return res.status(400).json({ error: error.errors });
  }

  const existingUser = await User.findOne({ mail });

  if (existingUser) {
    res.status(401).json({ error: "User already exist" });
    return;
  }

  try {
    const user = await User.create({ mail, password });

    const token = await user.generateToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
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
    res.status(500).json({ error: "Internal server error" });
  }
};

export const signIn = async (req, res) => {
  const { mail, password } = req.body;

  try {
    userSchema.parse({ mail, password });
  } catch (error) {
    return res.status(400).json({ error: error.errors });
  }

  try {
    const user = await User.findOne({ mail });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isOk = await user.comparePassword(password);

    if (!isOk) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = await user.generateToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Successfully connected to website",
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
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    res.clearCookie("token");
    res.status(200).send("Logout successful");
  } catch (error) {
    res.status(401).json({ error: error });
  }
};
