const express = require("express");
require('dotenv').config(); 
const connectDB = require('./config/db');

const app = express();

connectDB();


app.use(express.json());

app.route('/').get((req,res)=>{
    res.send('Server is running.');
})


const PORT = process.env.PORT || 5000
app.listen(5000, ()=>{console.log(`Server Started on port ${PORT}`)});