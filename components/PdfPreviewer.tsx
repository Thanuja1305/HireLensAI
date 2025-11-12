

import React, { useState, useEffect, useRef } from 'react';
import { ZoomInIcon, ZoomOutIcon } from './icons/Icons';
import LoadingSpinner from './LoadingSpinner';

declare const pdfjsLib: any;

interface PdfPreviewerProps {
    file: File;
}

const PdfPreviewer: React.FC<PdfPreviewerProps> = ({ file }) => {
    const [pdfDoc, setPdfDoc] = useState<any>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [zoom, setZoom] = useState(1.5);
    const [isLoading, setIsLoading] = useState(true);
    const canvasesRef = useRef<(HTMLCanvasElement | null)[]>([]);

    useEffect(() => {
        const loadPdf = async () => {
            setIsLoading(true);
            const reader = new FileReader();
            reader.onload = async (e) => {
                if (e.target?.result) {
                    const typedArray = new Uint8Array(e.target.result as ArrayBuffer);
                    try {
                        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
                        setPdfDoc(pdf);
                        setNumPages(pdf.numPages);
                    } catch (error) {
                        console.error("Error loading PDF:", error);
                    }
                }
            };
            reader.readAsArrayBuffer(file);
        };
        loadPdf();
    }, [file]);

    useEffect(() => {
        const renderPages = async () => {
            if (pdfDoc) {
                for (let i = 1; i <= numPages; i++) {
                    const page = await pdfDoc.getPage(i);
                    const viewport = page.getViewport({ scale: zoom });
                    const canvas = canvasesRef.current[i - 1];
                    if (canvas) {
                        const context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        if (context) {
                            const renderContext = {
                                canvasContext: context,
                                viewport: viewport
                            };
                            await page.render(renderContext).promise;
                        }
                    }
                }
                setIsLoading(false);
            }
        };
        renderPages();
    }, [pdfDoc, numPages, zoom]);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));

    return (
        <div className="relative">
            <div className="sticky top-0 z-10 bg-gray-100/80 backdrop-blur-sm p-2 flex items-center justify-center gap-2 border-b border-gray-200">
                <button onClick={handleZoomOut} className="p-1 rounded-full hover:bg-gray-200 transition-colors"><ZoomOutIcon className="w-5 h-5" /></button>
                <span className="text-sm font-semibold w-12 text-center">{(zoom * 100).toFixed(0)}%</span>
                <button onClick={handleZoomIn} className="p-1 rounded-full hover:bg-gray-200 transition-colors"><ZoomInIcon className="w-5 h-5" /></button>
            </div>
            {isLoading && (
                 <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
                 </div>
            )}
            <div className="p-2 bg-gray-300">
                {Array.from(new Array(numPages), (el, index) => (
                    <canvas 
                        ref={el => { canvasesRef.current[index] = el; }} 
                        key={index} 
                        className="mx-auto mb-2 shadow-md"
                    />
                ))}
            </div>
        </div>
    );
};

export default PdfPreviewer;