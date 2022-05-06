const express = require('express');
const app=express();
const port=process.env.PORT || 5000;
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('genius car service ready')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cimde.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
      await client.connect()
      const collection=client.db('geniusCar').collection('services')
     app.get('/service',async(req,res)=>{
      const quary={};
      const cursor=collection.find(quary);
      const result=await cursor.toArray();
      res.send(result)
     })
     app.get('/service/:id',async(req,res)=>{
      const id=req.params.id;
      const quary={_id:ObjectId(id)};
      const service=await collection.findOne(quary);
      res.send(service);
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
      if(result.deletedCount>0){
        console.log('deleted');
      }
    })

    }

    finally{

    }
}

run().catch(console.dir)

app.listen(port,()=>{
    console.log('listen to cunnect',port);
})