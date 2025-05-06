const mongoose = require('mongoose');
require('dotenv').config();  // This loads the variables from .env file

const connectDB = async () => {
  console.log(process.env.MONGO_URI)
  try {

    await mongoose.connect("mongodb://127.0.0.1:27017/task-elite", {
      useNewUrlParser: true,
      useUnifiedTopology: true,

    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports= connectDB
