const express = require('express');
const router = express.Router();
const {verifyToken, isAdmin} =require("../middleware/authMiddleware")
const { createTask, getAllTasks, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');

// Admin only
router.post('/task', verifyToken, isAdmin, createTask);

//get all task
router.get('/getTasks', verifyToken ,getAllTasks);

//get all task by id
router.get('/getTaskById/:id', verifyToken, getTaskById);

//get task update
router.put('/updateTask/:id', verifyToken, updateTask);

//get delete by id
router.delete('/task/:id', verifyToken, isAdmin, deleteTask);

module.exports = router;
