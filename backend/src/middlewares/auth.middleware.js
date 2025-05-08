import jwt from 'jsonwebtoken';

import {
  loginUserSchema,
  registerUserSchema,
} from '../validations/auth.validation.js';

const validateRegister = (req, res, next) => {
  const { error, value } = registerUserSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .json({ success: false, data: error.details.map((d) => d.message) });
  }

  req.validatedBody = value;
  next();
};

const validateLogin = (req, res, next) => {
  const { error, value } = loginUserSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .json({ success: false, date: error.details.map((d) => d.message) });
  }

  req.validatedBody = value;
  next();
};

const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, data: 'No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      return res
        .status(403)
        .json({ success: false, data: 'Session expired or is invalid.' });
    }

    req.user = user;
    next();
  });
};

export { validateRegister, validateLogin, authenticateToken };
