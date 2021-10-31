const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

//middleware
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("connected");
});
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jxarj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const serviceCollection = client.db("Travella").collection("serviceList");
  const bookingCollection = client.db("Travella").collection("bookingList");

  app.get("/services", (req, res) => {
    serviceCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.delete("/delete/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    serviceCollection.findOneAndDelete({ _id: id }).then((result) => {
      console.log("deleted successfully");
      res.send(result.insertedCount > 0);
    });
  });



  app.post("/create", (req, res) => {
    const title = req.body.title;
    const price = req.body.price;
    const image = req.body.image;
    const description = req.body.description;
    serviceCollection
      .insertOne({ title, image, price, description })
      .then((result) => {
        console.log("count", result.insertedCount);
        res.send(result.insertedCount > 0);
      });
  });



  app.post("/addBook", (req, res) => {
    const book = req.body;
    bookingCollection.insertOne(book).then((result) => {
      console.log("count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/allBooking", (req, res) => {
    bookingCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.get("/checkoutData/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    serviceCollection.find({ _id: id }).toArray((err, items) => {
      res.send(items[0]);
    });
  });
});
app.listen(process.env.PORT || port);
