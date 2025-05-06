const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// User login with email and password
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password with hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.healthCheck = async (req, res) => {
 

  try {
    res.status(200).json({ healthCheck:true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


//
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const avatar = `https://avatar.iran.liara.run/username?username=${name}`

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    user = new User({ name, email, password: hashedPassword, role, avatar });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// User update logic (allows user to update name, email, avatar)
exports.updateUser = async (req, res) => {
  const userId = req.user.id;  n
  const { name, email, avatar } = req.body;

  try {
    // Update the user's information
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, avatar }, 
      { new: true }  // Return the updated user document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getUser = async (req, res) => {
  const userId = req.params.id; 
  console.log(userId) // Extract user id from JWT token


  try {
    // Update the user's information
    const user = await User.findById(
      userId
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users from MongoDB
    const users = await User.find();

    // Check if any users exist
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
