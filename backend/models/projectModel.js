const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['inProgress', 'completed', 'pending'], default: 'inProgress' },
  progress: { type: Number, min: 0, max: 100 },
  leadId: { type: String, required: true },
  teamMembers: [{ type: String }],
  dueDate: { type: Date },
  icon: { type: String }
});

module.exports = mongoose.model('Project', projectSchema);
