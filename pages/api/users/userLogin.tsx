import clientPromise from '../../../lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // check for database and users collection
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB);
  const userCollectionVariable = process.env.MONGODB_COLLECTION_USERS;
  if (!userCollectionVariable) {
    return res.status(500).json('Missing users collection variable.');
  }
  const usersCollections = await db.collection(userCollectionVariable);
  if (!db || !usersCollections) {
    return res.status(500).json('Missing database or users collection.');
  }
  if (!process.env.TOKEN_SECRET) {
    return res.status(500).json('Missing token secret variable.');
  }
  try {
    // find user
    const formData = req.body;
    const email: string = formData.email;
    const password: string = formData.password;
    const users = await usersCollections.find({ email: email }).toArray();
    const user = users[0];
    if (!user) {
      return res.status(403).json({ message: `Email not found.` });
    }
    // check password match
    const samePassword = await bcrypt.compare(password, user.password);
    if (!samePassword) {
      return res.status(403).json({ message: `Incorrect password.` });
    }
    // generate token
    const tokenData = {
      id: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: '1d',
    });
    // send response
    const response = res.status(201).json({
      message: 'Login successful',
      success: true,
      token: token,
    });
    return response;
  } catch (e) {
    console.error(e);
  }
};
