const express = require('express');
const router = express.Router();
const {verifyToken, isAdmin} =require("../middleware/authMiddleware")
const { createTask, getAllTasks, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');

// Admin only
router.post('/task', verifyToken, isAdmin, createTask);
router.get('/getTasks', verifyToken ,getAllTasks);
router.get('/getTaskById/:id', verifyToken, getTaskById);
router.put('/task/:id', verifyToken, updateTask);
router.delete('/task/:id', verifyToken, isAdmin, deleteTask);

module.exports = router;
