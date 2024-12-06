const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0bmcc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });

        const equipmentCollection = client
            .db("equipmentDB")
            .collection("equipment");

        app.post("/equipments", async (req, res) => {
            const equipment = req.body;
            const result = await equipmentCollection.insertOne(equipment);
            console.log(result);
            res.send(result);
        });

        app.get("/equipments", async (req, res) => {
            const result = await equipmentCollection.find().toArray();
            res.send(result);
        });

        app.put("/updateEquipment/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const prevEquipment = req.body;
            const udpatedEquipment = {
                $set: {
                    username: prevEquipment.username,
                    useremail: prevEquipment.useremail,
                    name: prevEquipment.name,
                    category: prevEquipment.category,
                    price: prevEquipment.price,
                    rating: prevEquipment.rating,
                    customization: prevEquipment.customization,
                    deliveryTime: prevEquipment.deliveryTime,
                    image: prevEquipment.image,
                    stockAvailability: prevEquipment.stockAvailability,
                    description: prevEquipment.description,
                },
            };

            const result = await equipmentCollection.updateOne(
                filter,
                udpatedEquipment,
                options
            );
            res.send(result);
        });

        app.get("/equipment/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await equipmentCollection.findOne(query);
            res.send(result);
        });

        app.delete("/equipment/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await equipmentCollection.deleteOne(query);
            res.send(result);
        });

        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Esports Edge server is running properly.");
});

app.listen(port, () => {
    console.log(`Esports Edge server is running on port: ${port}`);
});
