import React, { useState } from 'react';
import { analyzeResumeForJobSeeker } from '../services/geminiService';
import { JobSeekerAnalysis } from '../types';
import FileUpload from './FileUpload';
import AnalysisCard from './AnalysisCard';
import LoadingSpinner from './LoadingSpinner';
import { AlertTriangleIcon } from './icons/Icons';

declare const pdfjsLib: any;
declare const mammoth: any;

interface JobSeekerDashboardProps {
    onBack: () => void;
}

const JobSeekerDashboard: React.FC<JobSeekerDashboardProps> = ({ onBack }) => {
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [resumeText, setResumeText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [analysis, setAnalysis] = useState<JobSeekerAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const extractTextFromFile = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (event) => {
                if (!event.target?.result) {
                    return reject(new Error("Failed to read file."));
                }
                try {
                    if (file.name.toLowerCase().endsWith('.pdf')) {
                        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(event.target.result as ArrayBuffer) }).promise;
                        let text = '';
                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const content = await page.getTextContent();
                            text += content.items.map((item: any) => item.str).join(' ') + '\n';
                        }
                        resolve(text);
                    } else if (file.name.toLowerCase().endsWith('.docx')) {
                         const result = await mammoth.extractRawText({ arrayBuffer: event.target.result as ArrayBuffer });
                         resolve(result.value);
                    } else {
                        // For .txt and other files
                        const decoder = new TextDecoder('utf-8');
                        resolve(decoder.decode(event.target.result as ArrayBuffer));
                    }
                } catch (error) {
                    console.error("Error extracting text:", error);
                    reject(new Error("Could not parse file content."));
                }
            };
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
        });
    };

    const handleFileSelect = async (file: File | null) => {
        setResumeFile(file);
        setResumeText('');
        setError(null);
        if (file) {
            try {
                const text = await extractTextFromFile(file);
                setResumeText(text);
            } catch (e: any) {
                setError(e.message || "Could not read text from file.");
            }
        }
    };

    const handleAnalyze = async () => {
        if (!resumeText || !jobDescription) {
            setError("Please provide both a resume and a job description.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            const result = await analyzeResumeForJobSeeker(resumeText, jobDescription);
            setAnalysis(result);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            <button onClick={onBack} className="text-sm font-semibold text-cyan-600 hover:text-cyan-800 mb-4">&larr; Back to Home</button>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800">Job Seeker Analysis</h2>
                    <p className="text-slate-600 mt-2">Get an AI-powered analysis of your resume against a target job description.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Upload Your Resume</label>
                        <FileUpload onFileSelect={handleFileSelect} acceptedTypes=".txt,.pdf,.docx" />
                         {resumeText && !error && (
                            <textarea
                                className="mt-2 w-full h-40 p-2 border border-gray-300 rounded-md text-xs bg-gray-50"
                                value={resumeText}
                                readOnly
                                placeholder="Resume content will appear here..."
                            />
                        )}
                    </div>
                    <div>
                        <label htmlFor="job-description" className="block text-sm font-medium text-slate-700 mb-2">Paste Job Description</label>
                        <textarea
                            id="job-description"
                            rows={10}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 transition"
                            placeholder="Paste the full job description here..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </div>
                </div>

                <div className="text-center">
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading || !resumeText || !jobDescription}
                        className="inline-flex items-center justify-center px-8 py-3 bg-cyan-600 text-white font-bold rounded-lg shadow-md hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? <><LoadingSpinner /> <span className="ml-2">Analyzing...</span></> : 'Analyze My Resume'}
                    </button>
                </div>

                {error && (
                    <div className="mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                        <div className="flex">
                            <div className="py-1"><AlertTriangleIcon className="h-5 w-5 text-red-500 mr-3" /></div>
                            <div>
                                <p className="font-bold">Error</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    </div>
                )}
                
                {analysis && (
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <h3 className="text-2xl font-bold text-slate-800 text-center mb-6">Your Personalized Analysis</h3>
                        <AnalysisCard analysis={analysis} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobSeekerDashboard;