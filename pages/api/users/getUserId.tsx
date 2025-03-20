import clientPromise from '../../../lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
interface JwtPayload {
  id: string;
}
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // check for database and users collection
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB);
  if (!db) {
    return res.status(500).json('Missing database variable.');
  }
  const sessionsCollectionVariable = process.env.MONGODB_COLLECTION_SESSIONS;
  if (!sessionsCollectionVariable) {
    return res.status(500).json('Missing sessions collection variable.');
  }
  const sessionsCollection = await db.collection(sessionsCollectionVariable);
  if (!sessionsCollection) {
    return res.status(500).json('Missing sessions collection.');
  }
  const tokenSecret = process.env.TOKEN_SECRET;
  if (!tokenSecret) {
    return res.status(403).json('Missing token secret variable.');
  }
  try {
    // retrieve token
    if (!req.query.token) {
      return res.status(400).json(`Missing token, please login.`);
    }
    const token = req.query.token.toString();
    jwt.verify(token, tokenSecret, function (error, decoded) {
      if (error) {
        console.log(error);
        return res.status(403).json(error);
      } else {
        const { id } = decoded as JwtPayload;
        return res.status(201).json(id);
      }
    });
  } catch (e) {
    console.error(e);
  }
};
