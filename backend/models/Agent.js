const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true }, // Mobile number with country code
    password: { type: String, required: true }
});

const Agent = mongoose.model('Agent', agentSchema);

module.exports = Agent;