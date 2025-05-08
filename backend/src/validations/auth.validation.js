import Joi from 'joi';

const registerUserSchema = Joi.object({
  username: Joi.string().min(6).max(20).required(),
  password: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
});

const loginUserSchema = Joi.object({
  username: Joi.string().min(6).max(20).required(),
  password: Joi.string().min(8).required(),
});

export { registerUserSchema, loginUserSchema };
