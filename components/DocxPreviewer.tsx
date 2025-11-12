
import React, { useState, useEffect } from 'react';

declare const mammoth: any;

interface DocxPreviewerProps {
    file: File;
}

const DocxPreviewer: React.FC<DocxPreviewerProps> = ({ file }) => {
    const [htmlContent, setHtmlContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const convertDocx = async () => {
            setIsLoading(true);
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    mammoth.convertToHtml({ arrayBuffer: e.target.result })
                        .then((result: any) => {
                            setHtmlContent(result.value);
                            setIsLoading(false);
                        })
                        .catch((error: any) => {
                            console.error("Error converting DOCX:", error);
                            setHtmlContent('<p class="text-red-500">Could not preview this DOCX file.</p>');
                            setIsLoading(false);
                        });
                }
            };
            reader.readAsArrayBuffer(file);
        };
        convertDocx();
    }, [file]);
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
            </div>
        );
    }

    return (
        <div 
            className="p-4 prose prose-sm max-w-none" 
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
};

export default DocxPreviewer;
