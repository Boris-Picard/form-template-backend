import express from "express";
import {
  signUp,
  signIn,
  getUser,
  logout,
  refreshToken,
  verifyEmail,
  reSendEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import auth from "../middleware/authMiddleware.js";
import authMail from "../middleware/mailAuthMiddleware.js";
import {
  mailLimiter,
  resetPasswordLimiter,
  authLimiter,
} from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

router.post("/signup", authLimiter, signUp);

router.post("/signin", authLimiter, signIn);

router.post("/refresh-token", refreshToken);

router.post("/resend-email", reSendEmail);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPasswordLimiter, authMail, resetPassword);

router.get("/user", auth, getUser);

router.get("/verify-email", mailLimiter, authMail, verifyEmail);

router.delete("/logout", logout);

export default router;
