import React, { useState } from 'react';
import '../public/styles/addagent.css';
import '../public/styles/style.css';
const UploadCSV = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5000/api/upload-csv', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                setMessage("Tasks distributed successfully");
            } else {
                const data = await response.json();
                setMessage(data.message || "Failed to upload CSV");
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage("Failed to upload CSV");
        }
    };

    return (
        <div className="upload-csv-form">
            <h2>Upload CSV</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Select CSV File:</label>
                    <input
                        type="file"
                        accept=".csv, .xlsx, .xls"
                        onChange={handleFileChange}
                        required
                    />
                </div>
                <button type="submit">Upload</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UploadCSV;
