import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../public/styles/style.css';
const TaskDashboard = () => {
    const { agentId } = useParams(); // Get agentId from URL
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchAgentTasks = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/tasks/${agentId}`);
                if (response.ok) {
                    const data = await response.json();
                    setTasks(data);
                } else {
                    console.error("Failed to fetch tasks");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchAgentTasks();
    }, [agentId]);

    return (
        <div className="task-dashboard">
            <h2>Your Assigned Tasks</h2>
            {tasks.length === 0 ? (
                <p>No tasks assigned yet.</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task._id}>
                            <strong>{task.firstName}</strong> - {task.phone} ({task.notes})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TaskDashboard;
