// importing relevant packges
const express = require('express'); // using express.js package/framework
const { MongoClient, ObjectId } = require('mongodb'); // mongodb package
const cors = require('cors'); 
const path = require('path'); // cors + path package

// express app initailization
const app = express();
const port = process.env.PORT || 3000; // redner.com + local port