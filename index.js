const express = require('express')
const bodyParser = require("body-parser");
const app = express()
const cors = require('cors');

require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.korjs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get("/", (req, res) => {
  res.send("Travella Server");
});

client.connect((err) => {
  const productsCollection = client.db("Travella").collection("products");
  const usersCollection = client.db("Travella").collection("users");
  const ordersCollection = client.db("Travella").collection("orders");


  //add A Product
  app.post("/addProducts", async (req, res) => {
    const result = await productsCollection.insertOne(req.body);
    res.send(result);
  });

  // get all Product
  app.get("/allProducts", async (req, res) => {
    const result = await productsCollection.find({}).toArray();
    res.send(result);
  });

  // Product Details 

  app.get("/singleProduct/:id", async (req, res) => {
    const result = await productsCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray();
    res.send(result[0]);
  });

  // insert order 

  app.post("/addOrders", async (req, res) => {
    const result = await ordersCollection.insertOne(req.body);
    res.send(result);
  });

  /// all order
  app.get("/allOrders", async (req, res) => {
    const result = await ordersCollection.find({}).toArray();
    res.send(result);
  });

  //  my order

  app.get("/myOrder/:email", async (req, res) => {
    const result = await ordersCollection
      .find({ email: req.params.email })
      .toArray();
    res.send(result);
  });

  //Delete Order 

  app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await ordersCollection.deleteOne(query);
    res.json(result);
  });


  //Delete Product 

  app.delete("/pdelete/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await productsCollection.deleteOne(query);
    res.json(result);
  });



  //Make user 
  app.post("/addUserInfo", async (req, res) => {
    console.log("req.body");
    const result = await usersCollection.insertOne(req.body);
    res.send(result);
    console.log(result);
  });



  // status update
  app.put("/statusUpdate/:id", async (req, res) => {
    const filter = { _id: ObjectId(req.params.id) };
    console.log(req.params.id);
    const result = await ordersCollection.updateOne(filter, {
      $set: {
        status: req.body.status,
      },
    });
    res.send(result);
    console.log(result);
  });
});

app.listen(process.env.PORT || port);