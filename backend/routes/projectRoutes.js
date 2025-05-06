const express = require('express');
const router = express.Router();

const {verifyToken, isAdmin} =require("../middleware/authMiddleware")
const { createProject,getAllProjects,getProjectById,updateProject,deleteProject } = require('../controllers/projectController');

// Admin only
router.post('/projects', verifyToken, isAdmin, createProject);
router.get('/projects', verifyToken, getAllProjects);
router.get('/projects/:id', verifyToken, getProjectById);
router.put('/projects/:id', verifyToken, updateProject);
router.delete('/projects/:id', verifyToken, isAdmin, deleteProject);
module.exports = router;
