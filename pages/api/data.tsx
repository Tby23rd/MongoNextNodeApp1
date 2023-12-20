// pages/api/data.tsx
import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, Db } from 'mongodb';

// Extend NextApiRequest to include the 'db' property
interface CustomNextApiRequest extends NextApiRequest {
  db: Db;
}

export default async function handler(req: CustomNextApiRequest, res: NextApiResponse) {
  let client: MongoClient | null = null; // Initialize client to null

  try {
    // Retrieve MongoDB connection string and database name from environment variables
    const mongoURI = process.env.MONGODB_CONNECTION_STRING;
    const dbName = process.env.DATABASE_NAME;

    if (!mongoURI || !dbName) {
      throw new Error('MongoDB connection string or database name not found in environment variables.');
    }

    // MongoDB options
    const options: any = { // Use 'any' for options
      useUnifiedTopology: true,
    };

    // Establish a connection to MongoDB
    client = await MongoClient.connect(mongoURI, options);

    const db = client.db(dbName); // Use the retrieved database name
    req.db = db;

    const collection = db.collection('CustomerData'); // Use your actual collection name

    if (req.method === 'GET') {
      const data = await collection.find().toArray();
      res.status(200).json(data);
    } else if (req.method === 'POST') {
      try {
        const { name } = req.body as { name: string }; // Type assertion for req.body
        const result: any = await collection.insertOne({ name });
        res.status(201).json(result.ops[0]);
      } catch (error: any) { // Use 'any' for error
        if (error instanceof Error) {
          console.error('Error inserting document:', error.message);
          res.status(500).json({ message: 'Internal Server Error' });
        } else {
          // Handle other cases if necessary
          console.error('Unknown error type:', error);
          res.status(500).json({ message: 'Internal Server Error' });
        }
      }
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error: any) { // Use 'any' for error
    if (error instanceof Error) {
      console.error('Error connecting to MongoDB:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      // Handle other cases if necessary
      console.error('Unknown error type:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } finally {
    // Close the MongoDB connection if client is not null
    if (client) {
      await client.close();
    }
  }
}
