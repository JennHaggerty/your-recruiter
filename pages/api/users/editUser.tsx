import { ObjectId } from 'bson';
import clientPromise from '../../../lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // check for database and users collection
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB);
  const userCollectionVariable = process.env.MONGODB_COLLECTION_USERS;
  if (!userCollectionVariable) {
    return res.status(500).json('Missing users collection variable.');
  }
  const collection = await db.collection(userCollectionVariable);
  if (!db || !collection) {
    return res.status(500).json('Missing database or users collection.');
  }
  if (!req.query.id) {
    return res.status(403).json('Missing user id.');
  }
  try {
    const id = new ObjectId(req.query.id.toString());
    const userArray = await collection.find({ _id: id }).toArray();
    const user = userArray[0];
    if (!user) {
      return res.status(402).json('User not found.');
    }
    const filter = { _id: id };
    if (req.body.openAi) {
      const key = req.body.openAi;
      const update = {
        $set: {
          openai_key: key,
        },
      };
      const options = { upsert: true };
      const result = await collection.updateOne(filter, update, options);
      console.log(result);
      if (result.modifiedCount === 1) {
        res.status(201).json('User updated');
      } else if (result.matchedCount === 1 && result.modifiedCount === 0) {
        res.status(403).json('No changes made, same key.');
      } else {
        res.status(403).json('There was an error updating user.');
      }
    }
    if (req.body.firecrawl) {
      const key = req.body.firecrawl;
      const update = {
        $set: {
          firecrawl_key: key,
        },
      };
      const options = { upsert: true };
      const result = await collection.updateOne(filter, update, options);
      if (result.modifiedCount === 1) {
        res.status(201).json('User updated');
      } else if (result.matchedCount === 1 && result.modifiedCount === 0) {
        res.status(403).json('No changes made, same key.');
      } else {
        res.status(403).json('There was an error updating user.');
      }
    }
  } catch (e) {
    console.error(e);
  }
};
