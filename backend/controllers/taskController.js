const Task = require('../models/taskModel');



// Create a new task (Admin only)
exports.createTask = async (req, res) => {
  const { title, description, status, priority, assignedTo, dueDate, completedDate, startTime } = req.body;

  const taskId = `task_${new Date().toISOString() }`
 
  try {

    let existingTask = await Task.findOne({ taskId });
        if (existingTask) {
          return res.status(400).json({ message: 'Task already exists' });
        }
        

    const task = new Task({
        taskId, title, description, status, priority, assignedTo, dueDate, completedDate, startTime
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error });
  }
};

// Get all tasks (Admin only)
exports.getAllTasks = async (req, res) => {
  // console.log("getAllTask")
  try {
    const tasks = await Task.find();
    // console.log("getAllTask2")
    res.status(200).json(tasks,"got all tasks");
    // console.log("got all tasks")
  } catch (error) {
    res.status(400).json({ message: 'Error fetching tasks', error });
  }
};

// Get task by ID (Admin or authorized user)
exports.getTaskById = async (req, res) => {
  // const taskId = req.params.id; 
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching task', error });
  }
};

// Update task (Admin only)
exports.updateTask = async (req, res) => {
  const { title, description, status, priority, assignedTo, dueDate, completedDate, startTime } = req.body;
  const taskId = req.params.id; // Extract task ID from request parameters
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, description, status, priority, assignedTo, dueDate, completedDate, startTime },
      { new: true } // Returns the updated task
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task', error });
  }
};

// Delete task (Admin only)
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id; // Extract task ID from request parameters
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting task', error });
  }
};