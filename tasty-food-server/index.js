const express = require("express");
const cors = require("cors");
const app= express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());
 
//database connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rj0wyaq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const foodCollection = client.db('foodDB').collection('tastyFood');

    app.post('/food', async(req,res)=>{
        const newFood=req.body;
        console.log(newFood);
        const result= await foodCollection.insertOne(newFood);
        res.send(result);
    })

    app.get('/food',async(req,res)=>{
        const cursor= foodCollection.find();
        const result= await cursor.toArray();
        res.send(result);
    })

     app.get('/food/:id', async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)}
      const result = await foodCollection.findOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Tasty food server in running');
})

app.listen(port,()=>{
    console.log(`Tasty food server is running on: ${port}`);
})