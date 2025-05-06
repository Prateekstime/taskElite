const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['completed', 'inProgress', 'pending'], default: 'inProgress' },
  priority: { type: String, enum: ['high', 'medium', 'low'] },
  assignedTo: { type: String, required: true },
  dueDate: { type: Date },
  completedDate: { type: Date },
  startTime: { type: String }
});

module.exports = mongoose.model('Task', taskSchema);
