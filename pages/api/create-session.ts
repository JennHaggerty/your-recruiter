import clientPromise from "../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from 'next';
import uuid4 from "uuid4";
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {  
    const client = await clientPromise;
    const db = await client.db(process.env.MONGODB);
    const collection = process.env.MONGODB_COLLECTION_SESSIONS;
    if (!collection) return res.status(500).json({message: "Sessions collection not found in database."})
    const user = req.body;
    const sessionId = uuid4();
    await db.collection(collection).insertOne({
      sessionId,
      userId: user._id,
      createdAt: new Date(),
    })
 
    res.status(200).json({ sessionId })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}