require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = process.env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // BOOKS CATEGORY DB
    const db = client.db("lmsDB");
    const lmsBooksCollections = db.collection("books");

    // ALL BOOKS GET
    app.get("/books", async (req, res) => {
      const result = await lmsBooksCollections.find().toArray();
      res.send(result);
    });

    // BOOKS CATEGORIES DETAILS
    app.get("/booksCategory/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await lmsBooksCollections.findOne(filter);
      console.log("result--------->", result);
      res.send(result);
    });

    app.get("/", async (req, res) => {
      res.send("Library Management System Server.....");
    });

    app.listen(port, async () => {
      console.log(`Library Mangement System server run on port ${port}`);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
