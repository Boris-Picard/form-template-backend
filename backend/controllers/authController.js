import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import process from "process";
import {
  userSchema,
  idUserSchema,
  mailSchema,
  passwordSchema,
} from "../schemas/userSchema.js";
import {
  sendVerificationEmail,
  sendForgotPasswordMail,
} from "../middleware/mailMiddleware.js";

export const signUp = async (req, res) => {
  const { mail, password } = req.body;

  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const existingUser = await User.findOne({ mail });
    if (existingUser) {
      if (!existingUser.isVerified) {
        const verificationToken =
          await existingUser.generateEmailVerificationToken();
        sendVerificationEmail(mail, verificationToken);
        return res.status(201).json({
          verified: existingUser.isVerified,
          message: "Email not verified. A verification email has been sent.",
        });
      } else {
        return res.status(400).json({
          verified: existingUser.isVerified,
          error: "A user with this email already exists and is verified.",
        });
      }
    }

    const user = await User.create({ mail, password });
    const verificationToken = await user.generateEmailVerificationToken();
    sendVerificationEmail(mail, verificationToken);

    res.status(201).json({
      verified: user.isVerified,
      message:
        "Registration successful. Please check your email to confirm your address.",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
};

export const verifyEmail = async (req, res) => {
  const { decodedToken } = req;
  if (!decodedToken) {
    return res.status(400).json({ error: "Token is missing" });
  }

  try {
    const user = await User.findById(decodedToken.id).select("-password");

    if (!user) {
      return res.status(400).json({ error: "Invalid token" });
    }

    if (user._id.toString() !== decodedToken.id.toString()) {
      return res.status(400).json({ error: "Token does not match user" });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({
      verified: user.isVerified,
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
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

    const verificationToken =
      await existingUser.generateEmailVerificationToken();
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

export const forgotPassword = async (req, res) => {
  const { mail } = req.body;

  const { error } = mailSchema.validate({ mail });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const existingUser = await User.findOne({ mail }).select("-password");

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (existingUser) {
      if (!existingUser.isVerified) {
        return res.status(400).json({ error: "User email not verified" });
      }

      const verificationToken =
        await existingUser.generateEmailVerificationToken();

      sendForgotPasswordMail(mail, verificationToken);
      return res.status(200).json({ message: "Password reset email sent" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { decodedToken } = req;
  const { password } = req.body;
  if (!decodedToken) {
    return res.status(400).json({ error: "Token is missing" });
  }

  const { error } = passwordSchema.validate({ password });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const user = await User.findById(decodedToken.id).select("-password");

    if (!user || !user.isVerified) {
      return res
        .status(400)
        .json({ error: "User email not verified or invalid token !" });
    }
    
    await user.resetPassword(password);

    return res.status(200).json({ message: "Password successfully reset !" });
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
