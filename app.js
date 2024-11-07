require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes');
const cloudinary = require('cloudinary').v2

const app = express();

//cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//setup mongoose
mongoose.connect(process.env.MONG_URI, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

//Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.set('view engine', 'ejs');

//routes
app.use('/', taskRoutes)

//Server
app.listen(5000, ()=> console.log('server listening at http://localhost:5000'));
