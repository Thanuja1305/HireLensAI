import React, { useState, useEffect } from 'react';
import { CandidateMatch } from '../types';
import CandidateDetailView from './CandidateDetailView';
import CandidateSidePanel from './CandidateSidePanel';

interface MatchResultsDisplayProps {
    candidates: CandidateMatch[];
}

const MatchResultsDisplay: React.FC<MatchResultsDisplayProps> = ({ candidates }) => {
    const [selectedCandidate, setSelectedCandidate] = useState<CandidateMatch | null>(null);

    useEffect(() => {
        // Automatically select the first candidate when results are loaded
        if (candidates && candidates.length > 0) {
            setSelectedCandidate(candidates[0]);
        } else {
            setSelectedCandidate(null);
        }
    }, [candidates]);

    if (!candidates || candidates.length === 0) {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-md border">
                <h3 className="text-xl font-bold text-slate-800">No Results</h3>
                <p className="text-slate-500 mt-2">The analysis did not return any valid candidate profiles. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2 md:p-4">
             <h2 className="text-2xl font-bold text-slate-800 mb-4 px-2 md:px-0">Analysis Results</h2>
            <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
                <aside className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                   <CandidateSidePanel 
                     candidates={candidates} 
                     selectedCandidateId={selectedCandidate?.id}
                     onSelectCandidate={setSelectedCandidate}
                   />
                </aside>
                <main className="flex-1 min-w-0">
                    <div className="p-4 rounded-lg bg-gray-50/50 border h-full">
                     {selectedCandidate ? (
                        <CandidateDetailView candidate={selectedCandidate} />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-slate-500">Select a candidate to view details.</p>
                        </div>
                    )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MatchResultsDisplay;
