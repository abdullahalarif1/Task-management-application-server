const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


//middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.xwxepqp.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();


        const tasksCollection = client.db('tasksManagement').collection('tasks')

        // task post
        app.post('/tasks', async (req, res) => {
            const tasks = req.body
            const result = await tasksCollection.insertOne(tasks)
            res.send(result)
        })


        // task get
        app.get('/tasks', async (req, res) => {
            const result = await tasksCollection.find().toArray()
            res.send(result);
        })


        // task delete
        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await tasksCollection.deleteOne(query)
            res.send(result)
        })


        //get id
        app.get('/tasks/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await tasksCollection.findOne(query)
            res.send(result)
        })


        // task update
        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id
            const user = req.body
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedUser = {
                $set: {
                    title: user.title,
                    description: user.description,
                    status: user.status,
                    date: user.date,
                }
            }
            const result = await tasksCollection.updateOne(filter, updatedUser, options)
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



app.get('/', (req, res) => {
    res.send('tasks is running')

})

app.listen(port, () => {
    console.log(`tasks server running on ${port}`);
})