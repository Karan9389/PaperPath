import React, { useState } from 'react';
import { UploadCloud, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'; 

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
        <div className="bg-[var(--bg-overlay)] p-6 rounded-[24px] border border-[var(--border-subtle)] space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className="text-[13px] font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-[var(--accent-green)]" />
                    Dataset Ingestion Pipeline
                </h3>
                <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-[var(--accent-blue)] bg-[rgba(10,132,255,0.15)] px-2.5 py-1 rounded-full">.PDF</span>
                    <span className="text-[10px] font-bold text-[var(--accent-green)] bg-[rgba(48,209,88,0.15)] px-2.5 py-1 rounded-full">.CSV</span>
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <input 
                    type="file" 
                    accept=".pdf,.csv"
                    onChange={handleFileChange}
                    className="block w-full text-[13px] font-medium text-[var(--text-secondary)]
                        file:mr-4 file:py-2.5 file:px-4
                        file:rounded-full file:border-0
                        file:text-[13px] file:font-bold
                        file:bg-[var(--bg-raised)] file:text-[var(--text-primary)]
                        hover:file:bg-[var(--bg-surface)] cursor-pointer
                        bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-1.5 transition-colors"
                />
                <button 
                    onClick={handleUpload} 
                    disabled={!file || isUploading}
                    className="bg-[var(--accent-green)] hover:bg-[#32d75f] text-white px-5 py-3 rounded-full font-bold text-[13px] tracking-wide disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-sm shrink-0"
                >
                    {isUploading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Ingesting...</>
                    ) : (
                        'Ingest Dataset'
                    )}
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-xl border text-[13px] font-bold flex items-center space-x-2.5 ${
                    message.startsWith('✅')
                        ? 'bg-[rgba(48,209,88,0.15)] border-[rgba(48,209,88,0.3)] text-[var(--accent-green)]'
                        : 'bg-[rgba(255,69,58,0.15)] border-[rgba(255,69,58,0.3)] text-[var(--accent-red)]'
                }`}>
                    {message.startsWith('✅') ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0" />
                    ) : (
                        <AlertCircle className="h-5 w-5 shrink-0" />
                    )}
                    <span>{message.replace(/^[✅❌]\s*/, '')}</span>
                </div>
            )}
        </div>
    );
};

export default UploadComponent;