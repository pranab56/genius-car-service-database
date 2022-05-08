const express = require('express');
const app=express();
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port=process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('genius car service ready')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z3n4a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
      await client.connect()
      const collection=client.db('geniusCar').collection('services')
      const orderCollection=client.db('geniusCar').collection('order')
     app.get('/service',async(req,res)=>{
      const quary={};
      const cursor=collection.find(quary);
      const result=await cursor.toArray();
      res.send(result)
     })
     app.get('/service/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:ObjectId(id)}
      const service=await collection.findOne(query);
      res.send(service);
    })

    app.get('/orders',async(req,res)=>{
      const email=req.query.email;
      const query={email:email}
      const cursor=orderCollection.find(query);
      const order=await cursor.toArray()
      res.send(order)
    })

    app.post('/service',async(req,res)=>{
      const quary=req.body;
      const service=await collection.insertOne(quary);
      res.send(service);
    })
    app.delete('/service/:id',async(req,res)=>{
      const id=req.params.id;
      const quary={_id:ObjectId(id)};
      const result=await collection.deleteOne(quary)
      res.send(result)
    })
    app.post('/order',async(req,res)=>{
      const query=req.body;
      const order=await orderCollection.insertOne(query);
      res.send(order)
    })

    }

    finally{

    }
}

run().catch(console.dir)

app.listen(port,()=>{
    console.log('listen to cunnect',port);
})