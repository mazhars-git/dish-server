const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//middleware

app.use(cors());
app.use(express.json());

//DB_Name: bengalDish
//DB_collection: mealItems
//User: restUser
//Pass: bengal123

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cpoqr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    await client.connect();
    const itemCollection = client.db('bengalDish').collection('mealItems');
   
    app.get('/items', async (req, res) =>{
      const query = {};
      const cursor = itemCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
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