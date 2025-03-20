import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import AgentLogin from './components/AgentLogin';
import AddAgent from './components/AddAgent';
import UploadCSV from './components/UploadCSV';
import TaskList from './components/TaskList';
import Dashboard from './components/dashboard';
import Admindash from './components/admindash';
import Agenttask from './components/AgentTask';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin-Dashboard" element={<Admindash/>} />
                <Route path="/agent-login" element={<AgentLogin />} />
                <Route path="/add-agent" element={<AddAgent />} />
                <Route path="/upload-csv" element={<UploadCSV />} />
                <Route path="/tasks" element={<TaskList />} />
                <Route path="/tasks/:agentId" element={<Agenttask />} />
                <Route path="/" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default App;