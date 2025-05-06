const express = require('express');
const { login, register, updateUser, healthCheck ,getUser,getAllUsers } = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');


const router = express.Router();
router.get('/healthCheck', healthCheck)
// Login route (public)
router.post('/login', login);

// Register route (public)
router.post('/register', register);

// Update route (protected, only for authenticated users)
router.put('/update', verifyToken, updateUser);
router.get('/user/:id', getUser);
router.get('/fetchUsers',verifyToken,isAdmin, getAllUsers);

module.exports = router;