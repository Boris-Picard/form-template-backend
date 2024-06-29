import Joi from "joi";

export const userSchema = Joi.object({
  mail: Joi.string().email().required(),
  password: Joi.string().min(8).max(50).required(),
});
