import Joi from "joi";

export const coinSchema = Joi.object({
  name: Joi.string().required(),
});

export const transactionSchema = Joi.object({
  quantity: Joi.number().positive().required(),
  price: Joi.number().positive().required(),
  spent: Joi.number().positive().required(),
  date: Joi.date().required(),
  coinId: Joi.string().hex().length(24).required(),
});
