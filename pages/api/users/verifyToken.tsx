import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // check for token secret
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
    const response = jwt.verify(token, tokenSecret, function (error, decoded) {
      if (error) {
        return error;
      } else {
        return decoded;
      }
    });
    return response;
  } catch (e) {
    console.error(e);
  }
};
