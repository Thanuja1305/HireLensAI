import React, { useState } from 'react';
import { DocumentTextIcon } from './icons/Icons';
import DocumentPreviewModal from './DocumentPreviewModal';

interface ResumePreviewCardProps {
    file: File;
    resumeText: string;
}

const ResumePreviewCard: React.FC<ResumePreviewCardProps> = ({ file, resumeText }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <>
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-2">
                    <DocumentTextIcon className="w-6 h-6" />
                    <span className="truncate">Resume: {file.name}</span>
                </h3>
                <div className="p-2 bg-gray-50 rounded-md max-h-40 overflow-hidden relative">
                    <p className="text-xs text-slate-500 italic mb-2">AI-extracted text preview:</p>
                    <pre className="text-xs text-slate-600 whitespace-pre-wrap font-sans break-words">{resumeText}</pre>
                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-gray-50 to-transparent" />
                </div>
                 <button 
                    onClick={() => setIsModalOpen(true)}
                    className="mt-3 w-full text-sm font-semibold text-cyan-600 hover:text-cyan-800 transition-colors py-2 rounded-md bg-cyan-50 hover:bg-cyan-100"
                >
                    View Original Resume
                </button>
            </div>
            {isModalOpen && (
                <DocumentPreviewModal 
                    file={file} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </>
    );
};

export default ResumePreviewCard;