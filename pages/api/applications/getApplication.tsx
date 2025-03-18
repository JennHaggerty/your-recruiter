import { ObjectId } from "bson";
import clientPromise from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import Job from "@/app/interfaces/Job";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = await client.db(process.env.MONGODB);
  const collection = process.env.MONGODB_COLLECTION;

  if (!db || !collection) {
    return res.status(500).json({
      message: `The database or collection is missing. Check your setup.`,
    });
  }

  if (!req.query.id) {
    return res.status(400).json({ message: `Missing application id.` });
  }

  const id = new ObjectId(req.query.id.toString());

  try {
    const application = await db
      .collection(collection)
      .find<Job>({ _id: id })
      .toArray();

    res.json(application);
  } catch (e) {
    console.error(e);
  }
};
