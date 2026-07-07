import React, { useState } from 'react';
// Assuming lucide-react is installed since it's in your stack
import { UploadCloud, Loader2 } from 'lucide-react'; 

const UploadComponent = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage('');
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a PDF or CSV file first.');
            return;
        }

        setIsUploading(true);
        setMessage('');

        const formData = new FormData();
        // IMPORTANT: The backend multer is looking for exactly 'dataset'
        formData.append('dataset', file);

        try {
            // Pointing to your new Node backend port
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
            
            const response = await fetch(`${baseUrl}/papers/upload`, {
                method: 'POST',
                body: formData,
                // Note: Do NOT set 'Content-Type' header here. 
                // The browser sets it automatically with the correct boundary for FormData.
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`✅ ${data.message}`);
                setFile(null); // Clear the file input
                
                // If the dashboard passed a refresh function, call it so the new paper appears!
                if (onUploadSuccess) {
                    setTimeout(() => onUploadSuccess(), 1500); 
                }
            } else {
                setMessage(`❌ Error: ${data.message}`);
            }
        } catch (error) {
            setMessage(`❌ Upload failed: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-blue-500" />
                Upload New Paper or Dataset
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <input 
                    type="file" 
                    accept=".pdf,.csv"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100 cursor-pointer"
                />
                <button 
                    onClick={handleUpload} 
                    disabled={!file || isUploading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                    {isUploading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                    ) : (
                        'Upload to Database'
                    )}
                </button>
            </div>

            {message && (
                <div className={`mt-4 text-sm font-medium ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default UploadComponent;