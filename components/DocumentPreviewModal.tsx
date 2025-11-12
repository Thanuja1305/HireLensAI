import React, { useState, useEffect } from 'react';
import PdfPreviewer from './PdfPreviewer';
import DocxPreviewer from './DocxPreviewer';
import { XIcon } from './icons/Icons';

interface DocumentPreviewModalProps {
    file: File;
    onClose: () => void;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ file, onClose }) => {
    const [textContent, setTextContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
            setIsLoading(true);
            const reader = new FileReader();
            reader.onload = (e) => {
                setTextContent(e.target?.result as string);
                setIsLoading(false);
            };
            reader.onerror = () => {
                setTextContent('Could not read this file.');
                setIsLoading(false);
            }
            reader.readAsText(file);
        }
    }, [file]);

    const renderPreview = () => {
        const fileType = file.name.split('.').pop()?.toLowerCase();
        
        if (isLoading) {
             return (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
                </div>
            );
        }

        if (fileType === 'pdf') {
            return <PdfPreviewer file={file} />;
        }
        if (fileType === 'docx') {
            return <DocxPreviewer file={file} />;
        }
        if (fileType === 'txt' && textContent) {
            return <pre className="p-4 text-sm text-slate-700 whitespace-pre-wrap font-sans bg-white">{textContent}</pre>;
        }
       
        return <p className="p-4 bg-white">Preview not available for this file type.</p>;
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={handleBackdropClick}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <header className="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
                <h2 className="text-lg font-semibold text-slate-800 truncate pr-4">{file.name}</h2>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                    <XIcon className="w-6 h-6 text-slate-600"/>
                </button>
            </header>
            <main className="overflow-y-auto bg-gray-200">
                {renderPreview()}
            </main>
          </div>
        </div>
    );
};

export default DocumentPreviewModal;
