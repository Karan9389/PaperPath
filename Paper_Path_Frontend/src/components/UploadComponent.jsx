import React, { useState } from 'react';
import { UploadCloud, Loader2, FileText, CheckCircle2, AlertCircle } from 'lucide-react'; 

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
        formData.append('dataset', file);

        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
            
            const response = await fetch(`${baseUrl}/papers/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`✅ ${data.message}`);
                setFile(null);
                
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
        <div className="bg-[#0d1117] p-5 rounded-md border border-[#30363d] space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#f0f6fc] uppercase tracking-wider flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-[#3fb950]" />
                    Dataset Ingestion Pipeline
                </h3>
                <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold text-[#58a6ff] bg-[#58a6ff]/10 border border-[#58a6ff]/30 px-2 py-0.5 rounded">.PDF</span>
                    <span className="text-[10px] font-mono font-bold text-[#3fb950] bg-[#238636]/10 border border-[#238636]/30 px-2 py-0.5 rounded">.CSV</span>
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <input 
                    type="file" 
                    accept=".pdf,.csv"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-[#848d96]
                        file:mr-4 file:py-2 file:px-3
                        file:rounded-md file:border-0
                        file:text-xs file:font-semibold
                        file:bg-[#21262d] file:text-[#c9d1d9]
                        hover:file:bg-[#30363d] cursor-pointer
                        bg-[#161b22] border border-[#30363d] rounded-md p-1"
                />
                <button 
                    onClick={handleUpload} 
                    disabled={!file || isUploading}
                    className="bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors shrink-0"
                >
                    {isUploading ? (
                        <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Ingesting...</>
                    ) : (
                        'Ingest Dataset'
                    )}
                </button>
            </div>

            {message && (
                <div className={`p-3 rounded-md border text-xs font-medium flex items-center space-x-2 ${
                    message.startsWith('✅')
                        ? 'bg-[#238636]/10 border-[#238636]/40 text-[#3fb950]'
                        : 'bg-[#da3633]/10 border-[#da3633]/40 text-[#f85149]'
                }`}>
                    {message.startsWith('✅') ? (
                        <CheckCircle2 className="h-4 w-4 text-[#3fb950] shrink-0" />
                    ) : (
                        <AlertCircle className="h-4 w-4 text-[#f85149] shrink-0" />
                    )}
                    <span>{message.replace(/^[✅❌]\s*/, '')}</span>
                </div>
            )}
        </div>
    );
};

export default UploadComponent;