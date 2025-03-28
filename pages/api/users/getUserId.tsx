import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
interface JwtPayload {
  id: string;
}
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // check for database and users collection
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
