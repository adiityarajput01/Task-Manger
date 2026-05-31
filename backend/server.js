const express = require("express");
require('dotenv').config(); 
const auth_routes = require('./routes/auth');
const connectDB = require('./config/db');

const app = express();

connectDB();


app.use(express.json());

app.use("/api/auth", auth_routes)

app.route('/').get((req,res)=>{
    res.send('Server is running.');
})


const PORT = process.env.PORT || 5000
app.listen(5000, ()=>{console.log(`Server Started on port ${PORT}`)});