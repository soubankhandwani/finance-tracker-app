import { authenticateUser, createUser } from '../services/auth.service.js';

// @desc Create a new user and send an access token back
// @route POST /api/user/register
// @access public [user]
const registerUser = async (req, res) => {
  const result = await createUser(req.validatedBody);
  if (!result.success) {
    return res.status(400).json({ ...result });
  }

  res.cookie('token', result.data, {
    httpOnly: true,
    secure: false,
    sameSite: true,
    maxAge: 60 * 60 * 1000,
  });

  res.status(201).json({ success: true, data: 'User registration complete.' });
};

// @desc Login a user and send an access token back
// @route POST /api/user/login
// @access public [user]
const loginUser = async (req, res) => {
  const result = await authenticateUser(req.validatedBody);
  if (!result.success) {
    return res.status(401).json({ ...result });
  }

  res.cookie('token', result.data, {
    httpOnly: true,
    secure: false,
    sameSite: true,
    maxAge: 60 * 60 * 1000,
  });

  res.status(201).json({ success: true, data: 'User logged in successfully.' });
};

export { registerUser, loginUser };
