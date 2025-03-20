import React from "react";
import { useNavigate } from "react-router-dom";
import '../public/styles/style.css';
const RoleSelection = () => {
    const navigate = useNavigate();

    return (
        <div className="role-selection-container">
            <h2>Select Your Role</h2>
            <div className="button-container">
                <button onClick={() => navigate("/admin-login")} className="role-button admin">
                    Admin
                </button>
                <button onClick={() => navigate("/agent-login")} className="role-button agent">
                    Agent
                </button>
            </div>
        </div>
    );
};

export default RoleSelection;
