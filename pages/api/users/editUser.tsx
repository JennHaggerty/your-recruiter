import { ObjectId } from 'bson';
import clientPromise from '../../../lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import UserChangePasswordType from '../types/userChangePasswordType';
import UserChangeEmailType from '../types/userChangeEmailType';
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
    let result;
    if (req.body.openAi) {
      const key = req.body.openAi;
      const update = {
        $set: {
          openai_key: key,
        },
      };
      const options = { upsert: true };
      result = await collection.updateOne(filter, update, options);
    }
    if (req.body.firecrawl) {
      const key = req.body.firecrawl;
      const update = {
        $set: {
          firecrawl_key: key,
        },
      };
      const options = { upsert: true };
      result = await collection.updateOne(filter, update, options);
    }
    if (req.body.email) {
      const email = req.body.email;
      const validatedFields = UserChangeEmailType.safeParse({
        email,
      });
      if (!validatedFields.success) {
        return res.status(400).json(validatedFields.error);
      }
      const validatedEmail = validatedFields.data.email;
      const update = {
        $set: {
          email: validatedEmail,
        },
      };
      const options = { upsert: true };
      result = await collection.updateOne(filter, update, options);
    }
    if (req.body['new-password']) {
      const newPassword = req.body['new-password'];
      const currentPassword = req.body['current-password'];
      // check password match
      const samePassword = await bcrypt.compare(currentPassword, user.password);
      if (!samePassword) {
        return res.status(403).json('Incorrect password.');
      }
      const validatedFields = UserChangePasswordType.safeParse({
        password: newPassword,
      });
      if (!validatedFields.success) {
        return res.status(400).json(validatedFields.error);
      }
      const validatedPassword = validatedFields.data.password;
      const hashedPassword = await bcrypt.hash(validatedPassword, 12);
      const update = {
        $set: {
          password: hashedPassword,
        },
      };
      const options = { upsert: true };
      result = await collection.updateOne(filter, update, options);
    }
    if (result && result.modifiedCount === 1) {
      res.status(201).json('User updated');
    } else if (
      result &&
      result.matchedCount === 1 &&
      result.modifiedCount === 0
    ) {
      res.status(403).json('No changes made.');
    } else {
      res.status(403).json('There was an error updating user.');
    }
  } catch (e) {
    console.error(e);
  }
};
