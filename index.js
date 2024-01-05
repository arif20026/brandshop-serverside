 const express = require('express');
 const cors = require('cors');
 const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
 require('dotenv').config()

 const app = express();
 const port = process.env.PORT || 5000;

//  middleware
app.use(cors())
app.use(express.json())



// Password Authentication




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8wwrvjl.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

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

    const productCollection = client.db('productDB').collection('product')

    // create post operation (receiving products from front end)

    app.post('/products', async (req,res) => {
        const newProduct = req.body
        console.log(newProduct)
        const result = await productCollection.insertOne(newProduct)
        res.send(result)

    })

    // Read (all data ) operation [showing all products in client side]

    app.get('/products', async(req,res) => {
        const cursor = productCollection.find()
        const result = await cursor.toArray()
        res.send(result)

    })

    // Read(single data) operation [showing single product in client side]

    app.get('/products/:id', async(req,res)=> {
        const id = req.params.id
        const query = { _id : new ObjectId(id)}
        const result= await productCollection.findOne(query)
        res.send(result)
    })


    // UPDATE operation

    app.put('/products/:id',async(req,res) => {
        const id= req.params.id
        const filter = {_id : new ObjectId(id)}
        const options = {upsert:true}
        const updatedProduct = req.body

        const product = {
           $set : {
            image: updatedProduct.updatedImage,
            name: updatedProduct.updatedName,
            brandName: updatedProduct.updatedBrandName,
            type: updatedProduct.updatedType,
            price: updatedProduct.updatedPrice,
            shortDescription: updatedProduct.updatedShortDescription,
            rating: updatedProduct.updatedRating,

           }
        }
        
        const result = await productCollection.updateOne(filter,product,options)
        res.send(result)
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res) => {
    res.send('assignment 10 server side is running ')
})

app.listen(port, () => {
    console.log(`assignment 10 server side is running at port : ${port}`)
})

