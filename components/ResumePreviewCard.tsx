import React, { useState } from 'react';
import { DocumentTextIcon } from './icons/Icons';
import DocumentPreviewModal from './DocumentPreviewModal';

interface ResumePreviewCardProps {
    resumeText: string;
    fileName: string;
}

const ResumePreviewCard: React.FC<ResumePreviewCardProps> = ({ resumeText, fileName }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Preview will only work for text-based content. If original was PDF/DOCX,
    // we show the extracted text, not the original formatting.
    const getPreviewFile = () => {
        // Force .txt extension for previewer to use text-mode
        const previewFileName = fileName.replace(/\.(pdf|docx)$/i, '.txt');
        return new File([resumeText], previewFileName, { type: 'text/plain' });
    }

    return (
        <>
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-2">
                    <DocumentTextIcon className="w-6 h-6" />
                    Resume Content
                </h3>
                <div className="p-2 bg-gray-50 rounded-md max-h-40 overflow-hidden relative">
                    <pre className="text-xs text-slate-600 whitespace-pre-wrap font-sans break-words">{resumeText}</pre>
                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-gray-50 to-transparent" />
                </div>
                 <button 
                    onClick={() => setIsModalOpen(true)}
                    className="mt-3 w-full text-sm font-semibold text-cyan-600 hover:text-cyan-800 transition-colors py-2 rounded-md bg-cyan-50 hover:bg-cyan-100"
                >
                    View Full Resume Text
                </button>
            </div>
            {isModalOpen && (
                <DocumentPreviewModal 
                    file={getPreviewFile()} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </>
    );
};

export default ResumePreviewCard;
