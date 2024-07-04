import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
});

export const mailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
});

export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
});
