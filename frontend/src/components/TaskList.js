import React, { useEffect, useState } from 'react';
import '../public/styles/tasklist.css';
const TaskList = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/tasks');
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

        fetchTasks();
    }, []);

    return (
        <div className="task-list">
            <h2>Distributed Tasks</h2>
            <ul>
                {tasks.map((task, index) => (
                    <li key={index}>
                        <strong>{task.firstName}</strong> - {task.phone} ({task.notes}) 
                        <br />
                        <small>Assigned to: {task.assignedTo?.name || "Unknown"}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
