import clientPromise from '../../../lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // check for database and users collection
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB);
    if (!db) {
      return res.status(500).json('Missing database variable.');
    }
    const userCollectionVariable = process.env.MONGODB_COLLECTION_USERS;
    if (!userCollectionVariable) {
      return res.status(500).json('Missing users collection variable.');
    }
    const usersCollections = await db.collection(userCollectionVariable);
    if (!usersCollections) {
      return res.status(500).json('Missing users collection.');
    }
    // find user
    const formData = req.body;
    const email: string = formData.email;
    const password: string = formData.password;
    const users = await usersCollections.find({ email: email }).toArray();
    const user = users[0];
    if (!user) {
      return res.status(400).json({ message: `Email not found.` });
    }
    // check password match
    const samePassword = await bcrypt.compare(password, user.password);
    if (!samePassword) {
      return res.status(400).json({ message: `Incorrect password.` });
    }
    // generate token
    const tokenData = {
      id: user._id,
      email: user.email,
    };
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: '1d',
    });
    // create session
    const sessionsCollectionVariable = process.env.MONGODB_COLLECTION_SESSIONS;
    if (!sessionsCollectionVariable) {
      return res.status(500).json('Missing sessions collection variable.');
    }
    const sessionsCollection = await db.collection(sessionsCollectionVariable);
    if (!sessionsCollection) {
      return res.status(500).json('Missing sessions collection.');
    }
    const sessionData = {
      user_id: user._id,
      token: token,
    };
    const sessionCreated = await sessionsCollection.insertOne(sessionData);
    if (!sessionCreated) {
      return res
        .status(500)
        .json('Unable to create secure session, please notify admin.');
    }
    // send response
    const response = res.status(201).json({
      message: 'Login successful',
      success: true,
      token: token,
      user: {
        _id: user._id,
        resume: user.resume && user.resume,
      },
    });
    if (response === undefined) {
      return res
        .status(400)
        .json({ message: `Repsonse not found for user login.` });
    }
    return response;
  } catch (e) {
    console.error(e);
  }
};
