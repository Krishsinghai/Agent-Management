import React from "react";
import '../public/styles/bdia.css';
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
    const navigate = useNavigate();

    return (
        <div className="role-selection-container">
            <h2>Select Your Role</h2>
            <div className="button-container">
                <button onClick={() => navigate("/add-agent")} className="role-button admin">
                    Add Agent
                </button>
                <button onClick={() => navigate("/upload-csv")} className="role-button agent">
                    Upload CSV
                </button>
                <button onClick={() => navigate("/tasks")} className="role-button agent">
                    Task List
                </button>
            </div>
        </div>
    );
};

export default RoleSelection;
