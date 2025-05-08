import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import prisma from '../config/prismaClient.js';

const createUser = async (data) => {
  try {
    // Check if user already exists in the database
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: data.username }, { email: data.email }],
      },
    });

    if (existingUser) {
      let message = 'User already exists.';
      if (existingUser.username === data.username) {
        message = 'Username already taken.';
      } else if (existingUser.email === data.email) {
        message = 'Email already registered.';
      }

      return {
        success: false,
        data: message,
      };
    }

    // If the user does not exists with the username or email
    // then hash the password and store the user in the database
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const { password, ...rest } = data;
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        ...rest,
        password: hashedPassword,
      },
    });

    if (user) {
      const token = jwt.sign(
        {
          id: user.id,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return {
        success: true,
        data: token,
      };
    }

    return {
      success: false,
      data: 'Error registering the user.',
    };
  } catch (error) {
    console.log('Error in createUser (auth.service.js): ', error.message);
    return {
      success: false,
      data: 'Error registering the user.',
    };
  }
};

const authenticateUser = async (data) => {
  const { username, password } = data;

  // Check if such user exists
  const user = await prisma.user.findUnique({
    where: { username: username },
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    // If the user exists then return the token
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return {
      success: true,
      data: token,
    };
  }

  return {
    success: false,
    data: 'Provided credentials are invalid.',
  };
};

export { createUser, authenticateUser };
