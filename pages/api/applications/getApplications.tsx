import clientPromise from '../../../lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import JobInterface from '@/interfaces/JobInterface';
import { ObjectId } from 'bson';
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = await client.db(process.env.MONGODB);
  const collection = process.env.MONGODB_COLLECTION_APPLICATIONS;
  if (!db || !collection) {
    return res.status(500).json({
      message: `The database or applications collection is missing. Check your setup.`,
    });
  }
  if (!req.query.user) {
    return res.status(403).json('Missing user id, cannot get applications.');
  }
  try {
    const id = new ObjectId(req.query.user.toString());
    const filter = { _user_id: new ObjectId(id) };
    const applications = await db
      .collection(collection)
      .find<JobInterface>(filter)
      .sort({ _date_added: 'desc' })
      .limit(100)
      .toArray();
    return res.status(201).json(applications);
  } catch (e) {
    console.error(e);
  }
};
