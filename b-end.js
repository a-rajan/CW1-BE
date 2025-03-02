// importing relevant packges/ environments
const express = require('express'); // using express.js package/framework
const { MongoClient, ObjectId } = require('mongodb'); // mongodb package
const cors = require('cors'); 
const path = require('path'); // cors + path package
    require('dotenv').config(); // remembered dotenv package

// express app initailization
const app = express();