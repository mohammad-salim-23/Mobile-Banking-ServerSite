const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ipsrkdy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const database = client.db('mobile-banking');
    const userCollection = database.collection('users');
    const transactionCollection = database.collection('transaction');

    // Authentication API
    app.post("/register", async (req, res) => {
      try {
        const data = req.body;
        console.log(data);

        // Insert the user into the collection (example)
        const result = await userCollection.insertOne(data);
        res.json({
          success: true,
          message: "User registered successfully",
          result: result
        });

      } catch (error) {
        res.json({
          success: false,
          error: error.message
        });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
  } finally {
    // Ensure that the client is properly closed in the future if needed.
    // Uncomment the following line to close the connection when the server stops:
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("MobileBanking is running");
});

app.listen(port, () => {
  console.log(`MobileBanking is running on port ${port}`);
});
