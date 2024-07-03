import Joi from "joi";

export const userSchema = Joi.object({
  mail: Joi.string().email().required(),
  password: Joi.string().min(8).max(50).required(),
});

export const mailSchema = Joi.object({
  mail: Joi.string().email().required(),
});

export const idUserSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
