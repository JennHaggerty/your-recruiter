import { ObjectId } from 'bson';
import clientPromise from '../../../lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

interface UserInterfaceData {
  id: string;
  name?: string;
  resume?: string;
  openai_key?: string;
  firecrawl_key?: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
  if (!req.query.id) {
    return res.status(403).json('Missing user id.');
  }
  const id = new ObjectId(req.query.id.toString());
  try {
    const userArray = await usersCollections.find({ _id: id }).toArray();
    const user = userArray[0];
    if (!user) {
      return res.status(402).json('User not found.');
    }
    const response: UserInterfaceData = {
      id: user._id.toString(),
      resume: user.resume,
      openai_key: user.openai_key,
      firecrawl_key: user.firecrawl_key,
    };
    res.status(201).json(response);
  } catch (e) {
    console.error(e);
  }
};
