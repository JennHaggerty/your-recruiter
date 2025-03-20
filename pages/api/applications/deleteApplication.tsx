import { ObjectId } from 'bson';
import clientPromise from '../../../lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.body;
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB);
  const collection = process.env.MONGODB_COLLECTION_APPLICATIONS;
  if (!db || !collection) {
    return res.status(500).json({
      message: `The database or applications collection is missing. Check your setup.`,
    });
  }
  if (!id) {
    return res.status(403).json({
      message: `Missing application id.`,
    });
  }
  try {
    const result = await db.collection(collection).deleteOne({
      _id: new ObjectId(id),
    });
    res.status(201).json(result.acknowledged);
  } catch (e) {
    console.error(e);
  }
};
