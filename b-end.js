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
  console.log(`${req.method} request for ${req.url}`);
  next();
});
