const express = require('express');
const next = require('next');
const { MongoClient } = require('mongodb'); // Import MongoClient from mongodb package

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// MongoDB Connection Configuration
const mongoURI = 'mongodb://localhost:27017'; // Update with your MongoDB connection string
const dbName = 'Customer'; // Update with your database name
const client = new MongoClient(mongoURI);

client.connect().then(() => {
  console.log('Connected to MongoDB');

  // Prepare Next.js application
  app.prepare().then(() => {
    const server = express();

    // Example API route to fetch data from MongoDB
    server.get('/api/data', async (req, res) => {
      try {
        const db = client.db(dbName); // Get the database instance
        const collection = db.collection('CustomerData'); // Specify the collection name

        // Fetch data from MongoDB collection
        const data = await collection.find().toArray();
        
        // Send response with fetched data
        res.status(200).json(data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    });

    // Handle Next.js pages
    server.all('*', (req, res) => {
      return handle(req, res);
    });

    // Start the server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  });
}).catch(error => {
  console.error('Error connecting to MongoDB:', error.message);
});
