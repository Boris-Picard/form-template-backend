import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import process from "process";
import { userSchema, idUserSchema, mailSchema } from "../schemas/userSchema.js";
import { sendVerificationEmail } from "../middleware/mailMiddleware.js";

export const signUp = async (req, res) => {
  const { mail, password } = req.body;

  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const existingUser = await User.findOne({ mail });
  if (existingUser) {
    return res.status(401).json({
      verified: existingUser.isVerified,
      error: "User already exists",
    });
  }

  try {
    const user = await User.create({ mail, password });

    const verificationToken = await user.generaEmailVerificationToken();
    sendVerificationEmail(mail, verificationToken);

    res.status(201).json({
      verified: user.isVerified,
      message:
        "Inscription réussie. Veuillez vérifier votre e-mail pour confirmer votre adresse.",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ error: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(400).json({ error: "Invalid token" });
    }

    if (user._id.toString() !== decoded.id.toString()) {
      return res.status(400).json({ error: "Token does not match user" });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};

export const reSendEmail = async (req, res) => {
  const { mail } = req.body;

  const { error } = mailSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const existingUser = await User.findOne({ mail }).select("-password");
    
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (existingUser.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    const verificationToken = await existingUser.generaEmailVerificationToken();
    sendVerificationEmail(mail, verificationToken);

    res.status(200).json({ message: "Email Verification send" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const signIn = async (req, res) => {
  const { mail, password } = req.body;

  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const user = await User.findOne({ mail });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ error: "Please verify your email first" });
    }

    const isOk = await user.comparePassword(password);
    if (!isOk) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const refreshToken = await user.generateRefreshToken();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const token = await user.generateToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({
      message: "Successfully connected to the website",
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

  const { error } = idUserSchema.validate({ id });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

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
  try {
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    res.status(200).send("Logout successful");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ error: "No refresh token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const newToken = await user.generateToken();
    res.cookie("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
    });

    res.status(200).end();
  } catch (error) {
    res.status(401).json({ error: "Invalid refresh token" });
  }
};
