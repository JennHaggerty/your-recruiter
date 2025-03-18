import { ObjectId } from "bson";
import clientPromise from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB);
    const collection = process.env.MONGODB_COLLECTION;
    const jsonBody = JSON.parse(req.body);
    const id = new ObjectId(jsonBody._id);
    const noteContent = jsonBody.note;

    delete jsonBody.note;
    delete jsonBody._id;

    jsonBody._date_modified = Date.now();

    const filter = { _id: id };
    const update = noteContent
      ? {
          $set: jsonBody,
          $addToSet: {
            notes: {
              content: noteContent,
              _date: new Date(),
            },
          },
        }
      : {
          $set: jsonBody,
        };
    const options = { upsert: true };

    const result = await db
      .collection(collection!)
      .updateOne(filter, update, options);

    res.status(201).json(result);
  } catch (e) {
    console.error(e);
  }
};
