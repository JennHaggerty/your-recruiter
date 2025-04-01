import { ObjectId } from 'bson';
import clientPromise from '../../../lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { UserContextInterface } from '@/contexts/UserContext';

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
  if (!req.query.id) {
    return res.status(403).json('Missing user id.');
  }
  try {
    const id = new ObjectId(req.query.id.toString());
    const userArray = await usersCollections.find({ _id: id }).toArray();
    const user = userArray[0];
    if (!user) {
      return res.status(402).json('User not found.');
    }
    const response: UserContextInterface = {
      user_id: user._id.toString(),
      email: user.email,
      resume: user.resume,
      openai_key: user.openai_key,
      firecrawl_key: user.firecrawl_key,
    };
    res.status(201).json(response);
  } catch (e) {
    console.error(e);
  }
};
