// importing relevant packges/ environments
const express = require('express'); // using express.js package/framework
const { MongoClient, ObjectId } = require('mongodb'); // mongodb package
const cors = require('cors');
const path = require('path'); // cors + path package
require('dotenv').config(); // remembered dotenv package

// express app initailization
const app = express();
const port = process.env.PORT || 3000; // redner.com + local port

// middleware work below
app.use(cors());
app.use(express.json());

// middleware/logger - sends out requests 
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request for ${req.url}`);

    // header request
    console.log('Request Headers:', req.headers);

    // post/put requests
    if (req.body && Object.keys(req.body).length) { // post requests
        console.log('Request Body:', JSON.stringify(req.body)); // request body
    } else if (req.method === 'GET' && req.query && Object.keys(req.query).length) { // get requests
        console.log('Request Query:', JSON.stringify(req.query)); // request query
    }

    next();
});
//backend images / static file related etc.
app.use('/images', express.static(path.join(__dirname, 'images'))); // directing to imgs folder
app.use('/images', (req, res) => {
    res.status(404).send('Not found'); // image hasnt loaded
});
//mongodb related code below
const mongouri = "mongodb+srv://abi:arpw1@ehelp.ybon4.mongodb.net/ehelp?retryWrites=true&w=majority"; // mongodb connection string + ensuring the database is connected

let client; // mongodb  client 
let db; // database
let lessons; // collection
let users; // collection

// connecting to the mongodb
async function connectToMongoDB() { // async function to connect to the mongodb
    try { // this will attempt to connect to mongodb 
        client = new MongoClient(mongouri); // client connection
        await client.connect(); 
        console.log("Connected to MongoDB Atlas"); // confirmation that mongodb is connected

        db = client.db('ehelp'); // database name
        lessons = db.collection('lessons'); // collection name (database -->collections --> [lesson name])
        users = db.collection('orders'); // Changed to 'orders' for clarity

        // this will create lesson metadata if you are setting up for the first time
        const count = await lessons.countDocuments(); // counting the number of documents in the lessons collection
        if (count === 0) { // refer to the comment above const count = await
            await lessons.insertMany([ // inserting lesson metadata
                { subject: 'English', location: 'room G04', price: 10, spaces: 5, image: '../images/english.svg' },
                { subject: 'Math', location: 'room G05', price: 10, spaces: 5, image: '../images/maths.svg' },
                { subject: 'Science', location: 'room G09', price: 15, spaces: 3, image: '../images/science.svg' },
                { subject: 'IT', location: 'room G08', price: 20, spaces: 8, image: '../images/it.svg' },
                { subject: 'History', location: 'room G10', price: 15, spaces: 8, image: '../images/history.svg' },
                { subject: 'Geography', location: 'room G11', price: 12, spaces: 6, image: '../images/geography.svg' },
                { subject: 'Art', location: 'room G12', price: 18, spaces: 4, image: '../images/art.svg' },
                { subject: 'Chinese', location: 'room G13', price: 10, spaces: 10, image: '../images/chinese.svg' },
                { subject: 'Music', location: 'room G14', price: 20, spaces: 5, image: '../images/music.svg' },
                { subject: 'Law', location: 'room G15', price: 15, spaces: 7, image: '../images/law.svg' }
            ]); // lesson content that has been inserted 
            console.log("Lessons collection initialized"); // confirmation message that lesson info is setuip
        }

        return true; // connection to mongodb is successful
    } catch (error) { // if connection to mongodb is not successful
        console.error("MongoDB connection error:", error);
        return false; 
    }
} // mongodb connection ends here 
// api routes/coding below
app.get('/lessons', async (req, res) => { // get request for lessons
    const result = await lessons.find({}).toArray(); // finding all lessons
    res.json(result); // response in json format
}); // get request ends here
app.get('search', async (req, res) => { // get request for search
    const { subject } = req.query; // query for subject
    const result = await lessons.find({ subject }).toArray(); // finding lessons based on subject
    res.json(result); // response in json format
}
);
