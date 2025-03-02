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
app.get('/lessons', async (req, res) => { // GET request for /lessons endpoint
    try {
        const allLessons = await lessons.find({}).toArray(); // get all lessons from MongoDB
        res.json(allLessons); // send lessons as JSON response
    } catch (error) {
        console.error("Error fetching lessons:", error); // log error
        res.status(500).json({ message: 'Error getting lessons' }); // send error response
    }
});

// GET request for search functionality
app.get('/search', async (req, res) => { // 
    try { // search attempts + error checking
        const query = req.query.q || ''; // "what does the user want to search for?" / related query
        // search methods below
        const searchQuery = { // searching in progress
            $or: [ // search filters
                { subject: { $regex: query, $options: 'i' } },
                { location: { $regex: query, $options: 'i' } } // ensuring the search isn't case sensitive
            ]
        };
        const searchResults = await lessons.find(searchQuery).toArray(); // begin search
        res.json(searchResults); // send results as JSON
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ message: 'Search failed' }); // send error response
    }
}); // search ends here

// orders/cart/checkout route(?)
app.post('/orders', async (req, res) => { // POST request for /orders 
    try { // will receive order data 
        const { name, phone, cart } = req.body; // order data
        // order metadata error check
        if (!name || !phone || !cart || !Array.isArray(cart)) {
            return res.status(400).json({ message: 'order data not valid' });
        }


        const order = { // order/cart data
            name, // customer name
            phone, // customer phone
            lessonIDs: cart.map(item => item.id), // lesson ids from cart
            quantities: cart.map(item => item.quantity), // lesson quantity in card
            orderDate: new Date() // order date
        };

        const result = await users.insertOne(order); // order data will be insreted into the db
        res.status(201).json({ // no problems with the order/order successful
            message: 'order created',
            orderId: result.insertedId // reset basket/back to the beginning
        }); 
        // order submission error checking below
    } catch (error) {
        console.error("order creation error:", error);
        res.status(500).json({ message: 'order creation failed' }); //  this message will be shown to user if order fails (do not confues with console.error)
    }
}); // order ends here

// put request for updated lessons stock etc.
app.put('/lessons/:id', async (req, res) => { 
    try { // lesson update attempts + error checking
        const lessonId = req.params.id;
        const updates = req.body;

        if (!ObjectId.isValid(lessonId)) { // lesson id error check
            return res.status(400).json({ message: 'invalid lesson id format' }); 
        }

        // lesson metadata management
        const result = await lessons.updateOne(
            { _id: new ObjectId(lessonId) }, // get lesson data via lesson id
            { $set: updates } // sending lesson updates
        );

        // error checking if lesson is found/matches info in the database
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'lesson not found in database' });
        }

        // lesson update/done success message
        res.json({ message: 'lesson updated successfully' });
    } catch (error) { // this line + below line -> problem with updating
        console.error("lesson update error:", error);
        res.status(500).json({ message: 'update failed' });
    } // lesson update ends here
});  // put request ends here

