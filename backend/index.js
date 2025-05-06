const express = require('express');
require("dotenv").config();
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projectRoutes');
const connectDB = require('./db')
var cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);

app.listen(process.env.PORT, () => {
   
  console.log(`server is running at ${process.env.PORT}`);
//   console.log(process.env.JWT_SECRET)
});
