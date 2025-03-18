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

  try {
    const applications = await db
      .collection(collection)
      .find<Job>({})
      .sort({ _date_added: "desc" })
      .limit(100)
      .toArray();

    res.json(applications);
  } catch (e) {
    console.error(e);
  }
};
