const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// MiddleWare
app.use(cors());
app.use(express.json());

// MongoDb Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kin6o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log(uri);

async function run() {
  try {
    await client.connect();
    console.log("database connected to fellow");
    const database = client.db("fellow_Travellers");
    const packageCollection = database.collection("packages");
    const serviceCollection = database.collection("services");
    const membersCollection = database.collection("members");
    const bookedPackages = database.collection("booked_Packages");

    // ADD PACKAGES
    app.post("/addEvent", async (req, res) => {
      console.log(req.body);
      const result = await packageCollection.insertOne(req.body);
      console.log(result);
    });

    // ADD SERVICES
    app.post("/addServices", async (req, res) => {
      console.log(req.body);
      const result = await serviceCollection.insertOne(req.body);
      console.log(result);
    });

    // ADD Members
    app.post("/addMember", async (req, res) => {
      console.log(req.body);
      const result = await membersCollection.insertOne(req.body);
      res.send(result);
    });

    // Searched Packages
    app.get("/searchPackages", async (req, res) => {
      console.log(req.query.search);
      const result = await packageCollection
        .find({
          title: { $regex: req.query.search },
        })
        .toArray();
      res.send(result);
      console.log(result);
    });

    // Get ALL Members
    app.get("/allMembers", async (req, res) => {
      const result = await membersCollection.find({}).toArray();
      res.send(result);
    });
    // Get ALL Packages
    app.get("/allPackages", async (req, res) => {
      const result = await packageCollection.find({}).toArray();
      res.send(result);
    });
    // Get ALL Services
    app.get("/allServices", async (req, res) => {
      const result = await serviceCollection.find({}).toArray();
      res.send(result);
    });

    // Delete Package
    app.delete("/deletePackage/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await packageCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Fellow Travellers server is running ");
});

app.listen(port, () => {
  console.log("Server is Running at port ", port);
});
