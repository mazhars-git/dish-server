const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;
const app = express();

//middleware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cpoqr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    await client.connect();
    const itemCollection = client.db('bengalDish').collection('mealItems');
   
   //Get items 
    app.get('/mealItems', async (req, res) =>{
      const query = {};
      const cursor = itemCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });

    //Get single item
    app.get('/item/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const item = await itemCollection.findOne(query);
      res.send(item);
    });

    //Post item
    app.post('/item', async(req, res) =>{
      const newItem = req.body;
      const result = await itemCollection.insertOne(newItem);
      res.send(result);
    })

    //Delete item
    app.delete('/item/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const deletedItem = await itemCollection.deleteOne(query);
      res.send(deletedItem);
    })

    //item by page

    app.get('/product', async (req, res) =>{
      console.log('query: ', req.query);

      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const query = {};
      const cursor = itemCollection.find(query);

      let products;

      if(page || size){
        products = await cursor.skip(page*size).limit(size).toArray();
      }else{
        products = await cursor.toArray();
      }
      
      res.send(products);
    });

    //count item
    app.get('/itemCount', async (req, res) =>{
      const countItem = await itemCollection.estimatedDocumentCount();
      res.send({countItem});
    })

  }
  finally{

  }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('running dish server')
})


app.listen(port, () =>{
    console.log('Listening port', port);
})
