import React, { useState } from 'react';
import '../public/styles/addagent.css';
import '../public/styles/style.css';
const AddAgent = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/add-agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                alert('Agent added successfully!');
                setFormData({ name: '', email: '', mobile: '', password: '' });
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to add agent');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add agent');
        }
    };

    return (
        <div className="add-agent-form">
            <h2>Add Agent</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Mobile Number:</label>
                    <input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Add Agent</button>
            </form>
        </div>
    );
};

export default AddAgent;