import { ObjectId } from 'bson';
import clientPromise from '../../../lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id = req.body;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB);
    const applications = await db.collection(process.env.MONGODB_COLLECTION!);
    const result = await applications.deleteOne({
      _id: new ObjectId(id),
    });
    res.status(201).json(result.acknowledged);
  } catch (e) {
    console.error(e);
  }
};
