const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.308otot.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const menuCollection = client.db("bistroDB").collection("menu");
    const reviewsCollection = client.db("bistroDB").collection("reviews");
    const cartsCollection = client.db("bistroDB").collection("cart");

    app.get("/menu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    });
    app.get("/reviews", async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    });

    // carts apis
    app.post("/carts", async (req, res) => {
      const result = await cartsCollection.insertOne(req.body);
      res.send(result);
    });

    app.get("/carts", async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) {
        query = { email: email };
      }
      const result = await cartsCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/carts/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await cartsCollection.deleteOne(query);
      res.send(result);
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

app.get("/", (req, res) => {
  res.send("Bistro boss server is running");
});

app.listen(port, () => {
  console.log(`Bistro Boss is running on port ${port}`);
});
