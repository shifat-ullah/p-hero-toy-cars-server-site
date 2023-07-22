const express = require('express')
const app = express()
const port =process.env.PORT || 3000
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.send('this server is running fine')
  })
  
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rfaan6v.mongodb.net/?retryWrites=true&w=majority`;
  
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
      const database = client.db('toyCars')
      const carCollection = database.collection('carCollection')
      // Connect the client to the server	(optional starting in v4.7)
      // const indexKeys = { carname:1};
      // const indexOptions = { name: "carname" }; 
      // const result = await carCollection.createIndex(indexKeys, indexOptions);
  
      app.post('/alltoys',async(req,res) => {
        const toyinfo =req.body;
        console.log(toyinfo)
        const result = await carCollection.insertOne(toyinfo)
        res.send(result)
  
      })
  
      app.get('/toys/:category',async(req,res) => {
        
        const category = await carCollection
        .find({
          category: req.params.category,
        }).limit(2)
        .toArray();
      res.send(category);
      })
  
      app.get('/alltoys',async(req,res) => {
        const cursor = carCollection.find().limit(20);
        const result = await cursor.toArray();
        res.send(result)
      })
      app.get('/alltoys/:id',async (req,res) => {
        const id = req.params.id;
        const query = {_id:new ObjectId(id)}
        const result = await carCollection.findOne(query)
        console.log(result)
        res.send(result)
      })
  
      
  
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })