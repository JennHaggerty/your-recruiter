import clientPromise from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import User from "../types/user";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB);

    if (!db) return res.status(500).json("Missing database.");

    const collection = process.env.MONGODB_COLLECTION_USERS;

    if (!collection) return res.status(500).json("Missing users collection.");

    const formData = req.body;
    const email: string = formData.email;
    const password: string = formData.password;
    const validatedFields = User.safeParse({
      email,
      password,
    });

    if (!validatedFields.success) {
      return res.status(400).json(validatedFields.error);
    }

    const validatedEmail = validatedFields.data.email;
    const validatedPassword = validatedFields.data.password;
    const hashedPassword = await bcrypt.hash(validatedPassword, 12);
    const newUser = {
      email: validatedEmail,
      password: hashedPassword,
      _date_added: Date.now(),
    };

    const users = await db.collection(collection);
    const emailExists = await users.find({ email: validatedEmail }).toArray();

    if (emailExists[0]) {
      return res.status(400).json({ message: `Email already exists.` });
    }

    const result = await users.insertOne(newUser);

    res.status(201).json(result.acknowledged);
  } catch (error: any) {
    return res.status(400).json(error);
  }
};
