

import React, { useState } from 'react';
import { analyzeResumeForRecruiter, verifyCredlyProfile } from '../services/geminiService';
import { CandidateMatch } from '../types';
import MultiFileUpload from './MultiFileUpload';
import MatchResultsDisplay from './MatchResultsDisplay';
import LoadingSpinner from './LoadingSpinner';
import { AlertTriangleIcon } from './icons/Icons';

declare const pdfjsLib: any;
declare const mammoth: any;

interface RecruiterDashboardProps {
    onBack: () => void;
}

const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ onBack }) => {
    const [resumeFiles, setResumeFiles] = useState<File[]>([]);
    const [jobDescription, setJobDescription] = useState('');
    const [analysisResults, setAnalysisResults] = useState<CandidateMatch[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

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
                        const decoder = new TextDecoder('utf-8');
                        resolve(decoder.decode(event.target.result as ArrayBuffer));
                    }
                } catch (error) {
                    console.error("Error extracting text:", error);
                    reject(new Error(`Could not parse content from ${file.name}.`));
                }
            };
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
        });
    };

    const handleAnalyze = async () => {
        if (resumeFiles.length === 0 || !jobDescription) {
            setError("Please upload at least one resume and provide a job description.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysisResults([]);
        setProgress(0);

        try {
            const results: CandidateMatch[] = [];
            for (let i = 0; i < resumeFiles.length; i++) {
                const file = resumeFiles[i];
                try {
                    const resumeText = await extractTextFromFile(file);
                    const analysis = await analyzeResumeForRecruiter(resumeText, jobDescription);
                    
                    const credlyVerification = await verifyCredlyProfile(analysis.candidateName);

                    results.push({
                        ...analysis,
                        id: `${file.name}-${new Date().getTime()}`,
                        fileName: file.name,
                        resumeText: resumeText,
                        credlyVerification: credlyVerification,
                    });
                } catch (individualError: any) {
                     console.error(`Failed to process ${file.name}:`, individualError);
                }
                setProgress(((i + 1) / resumeFiles.length) * 100);
            }
            setAnalysisResults(results);

        } catch (err: any) {
            setError(err.message || "An unexpected error occurred during analysis.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            <button onClick={onBack} className="text-sm font-semibold text-cyan-600 hover:text-cyan-800 mb-4">&larr; Back to Home</button>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800">Recruiter Dashboard</h2>
                    <p className="text-slate-600 mt-2">Bulk analyze resumes, verify claims, and identify top candidates.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Upload Resumes</label>
                        <MultiFileUpload onFilesSelect={setResumeFiles} acceptedTypes=".txt,.pdf,.docx" />
                    </div>
                    <div>
                        <label htmlFor="job-description-recruiter" className="block text-sm font-medium text-slate-700 mb-2">Paste Job Description</label>
                        <textarea
                            id="job-description-recruiter"
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
                        disabled={isLoading || resumeFiles.length === 0 || !jobDescription}
                        className="inline-flex items-center justify-center px-8 py-3 bg-cyan-600 text-white font-bold rounded-lg shadow-md hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? <><LoadingSpinner /> <span className="ml-2">Analyzing {resumeFiles.length} Resumes... ({progress.toFixed(0)}%)</span></> : `Analyze ${resumeFiles.length > 0 ? resumeFiles.length : ''} Resumes`}
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
            </div>

            {analysisResults.length > 0 && !isLoading && (
                <div className="mt-8">
                    <MatchResultsDisplay candidates={analysisResults} />
                </div>
            )}
        </div>
    );
};

export default RecruiterDashboard;