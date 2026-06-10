const express = require("express");
require('dotenv').config(); 
const cors = require('cors');
const auth_routes = require('./routes/auth');
const connectDB = require('./config/db');
const task_routes = require('./routes/task');

const app = express();

connectDB();

app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://13.232.210.27:3000",  // your EC2 frontend
        "http://13.232.210.27" 
    ], 
    credentials: true
}));
app.use(express.json());


app.use("/api/auth", auth_routes);
app.use("/api/tasks",task_routes);


app.route('/').get((req,res)=>{
    res.send('Server is running.');
})


const PORT = process.env.PORT || 5000
app.listen(5000, ()=>{console.log(`Server Started on port ${PORT}`)});