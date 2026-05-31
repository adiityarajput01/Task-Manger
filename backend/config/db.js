const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI
const connectDB =  async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MONGODB CONNECTED');
    }
    catch(err){
        console.log('MongoDB connection failed:', err);
        process.exit(1);
    }
};

module.exports = connectDB;