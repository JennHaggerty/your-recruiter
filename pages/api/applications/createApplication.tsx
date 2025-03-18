import clientPromise from '../../../lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB);
    const collection = process.env.MONGODB_COLLECTION;
    const formData = req.body;
    if (formData.note) {
      const note = {
        content: req.body.note,
        _date: Date.now(),
      };
      formData.notes = note || '';
      delete formData.note;
    }
    formData._date_added = Date.now();
    const applications = await db.collection(collection!);
    const result = await applications.insertOne(formData);
    res.status(201).json(result.acknowledged);
  } catch (e) {
    console.error(e);
  }
};
