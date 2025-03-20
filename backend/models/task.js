const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    phone: { type: Number, required: true },
    notes: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true } // Reference to Agent
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;