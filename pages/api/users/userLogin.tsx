import clientPromise from '../../../lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB);
    if (!db) return res.status(500).json('Missing database.');
    const collection = process.env.MONGODB_COLLECTION_USERS;
    if (!collection) return res.status(500).json('Missing users collection.');
    const usersCollections = await db.collection(collection);
    const formData = req.body;
    const email: string = formData.email;
    const password: string = formData.password;
    const users = await usersCollections.find({ email: email }).toArray();
    const user = users[0];
    if (!user) {
      return res.status(400).json({ message: `Email not found.` });
    }
    const samePassword = await bcrypt.compare(password, user.password);
    if (!samePassword) {
      return res.status(400).json({ message: `Incorrect password.` });
    }
    const tokenData = {
      id: user._id,
      email: user.email,
    };
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: '1d',
    });
    const response = res.status(201).json({
      message: 'Login successful',
      success: true,
      token: token,
      user: {
        // encrypt?
        _id: user._id,
        email: user.email,
        resume: user.resume,
      },
    });
    return response;
  } catch (e) {
    console.error(e);
  }
};
