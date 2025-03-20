
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs'); // Import the fs module
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const Admin = require('./models/Admin'); // Move import to top
const Agent = require('./models/Agent')
const Task = require('./models/task')
// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const secret = process.env.JWT_SECRET;
const upload = multer({ dest: 'uploads/' });

// Session setup
app.use(session({
    secret: (secret),  // Change this to a secure key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }   // Set true if using HTTPS
}));

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb+srv://singhaikrish769:LzdMUeUnTuKyfF6Z@krishcluster.axufc.mongodb.net/adminDB";
mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB connection error:", err));


// Admin Signup Route
app.post('/admin/signup', async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Log the request body
        const { name, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).send("Password and Confirm Password do not match");
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save Admin
        const admin = new Admin({ name, email, password: hashedPassword });
        await admin.save();

        console.log("Admin Created:", admin);
        res.json({ message: "Signup successful, redirecting..." });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).send("Error signing up: " + error.message);
    }
});


// Admin Login Route
app.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(401).json({ message: "Invalid email or password" });

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid email or password" });

        // Set session and cookie
        req.session.adminId = admin._id;
        res.cookie('adminId', admin._id, { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 });

        res.json({ message: "Login successful, redirecting..." });  // ✅ Fix res.redirect()
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post('/agent/login', async (req,res)=>{
    try{
        const { email, password } = req.body;
        const agent = await Agent.findOne({ email });
        if (!agent) return res.status(401).json({ message: "Invalid email or password" });

        const isPasswordValid = await bcrypt.compare(password, agent.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid email or password" });

        req.session.agentId = agent._id;
        res.cookie('agentId', agent._id, { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ message: "Login successful, redirecting...", agentId: agent._id  });  // ✅ Fix res.redirect()
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

app.post('/api/add-agent', async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;

        // Validate input
        if (!name || !email || !mobile || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if agent already exists
        const existingAgent = await Agent.findOne({ email });
        if (existingAgent) {
            return res.status(400).json({ message: "Agent with this email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new agent
        const agent = new Agent({ name, email, mobile, password: hashedPassword });
        await agent.save();

        console.log("Agent Created:", agent);
        res.status(201).json({ message: "Agent added successfully", agent });
    } catch (error) {
        console.error("Add Agent Error:", error);
        res.status(500).json({ message: "Error adding agent: " + error.message });
    }
});

app.post('/api/upload-csv', upload.single('file'), async (req, res) => {
    try {
        const filePath = req.file.path;

        // Read and parse the CSV file
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                // Validate CSV format
                if (!results.every(item => item.FirstName && item.Phone && item.Notes)) {
                    return res.status(400).json({ message: "Invalid CSV format" });
                }

                // Fetch all agents
                const agents = await Agent.find();
                if (agents.length === 0) {
                    return res.status(400).json({ message: "No agents available" });
                }

                // Distribute tasks among agents
                const tasksPerAgent = Math.floor(results.length / agents.length);
                let remainingTasks = results.length % agents.length;

                let taskIndex = 0;
                for (let i = 0; i < agents.length; i++) {
                    const agent = agents[i];
                    const tasksToAssign = tasksPerAgent + (remainingTasks > 0 ? 1 : 0);
                    remainingTasks--;

                    for (let j = 0; j < tasksToAssign; j++) {
                        const taskData = results[taskIndex];
                        const task = new Task({
                            firstName: taskData.FirstName,
                            phone: taskData.Phone,
                            notes: taskData.Notes,
                            assignedTo: agent._id
                        });
                        await task.save();
                        taskIndex++;
                    }
                }

                // Delete the uploaded file
                fs.unlinkSync(filePath);

                res.status(201).json({ message: "Tasks distributed successfully" });
            });
    } catch (error) {
        console.error("Upload CSV Error:", error);
        res.status(500).json({ message: "Error uploading CSV: " + error.message });
    }
});

app.get('/api/tasks', async (req, res) => {
    try {
        // Populate 'assignedTo' field to include the agent's name and email
        const tasks = await Task.find().populate('assignedTo', 'name email');
        res.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Error fetching tasks" });
    }
});

app.get('/api/tasks/:agentId', async (req, res) => {
    try {
        const { agentId } = req.params;
        const tasks = await Task.find({ assignedTo: agentId });
        res.json(tasks);
    } catch (error) {
        console.error("Error fetching agent's tasks:", error);
        res.status(500).json({ message: "Error fetching tasks" });
    }
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
