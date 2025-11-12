import React, { useState, useEffect, useMemo } from 'react';
import { CandidateMatch } from '../types';
import CandidateDetailView from './CandidateDetailView';
import CandidateSidePanel from './CandidateSidePanel';

interface MatchResultsDisplayProps {
    candidates: CandidateMatch[];
}

type SortKey = 'matchScore' | 'name' | 'verificationScore';

const MatchResultsDisplay: React.FC<MatchResultsDisplayProps> = ({ candidates }) => {
    const [selectedCandidate, setSelectedCandidate] = useState<CandidateMatch | null>(null);
    const [sortBy, setSortBy] = useState<SortKey>('matchScore');

    const sortedCandidates = useMemo(() => {
        const sorted = [...candidates];
        switch (sortBy) {
            case 'matchScore':
                sorted.sort((a, b) => b.matchScore - a.matchScore);
                break;
            case 'name':
                sorted.sort((a, b) => a.candidateName.localeCompare(b.candidateName));
                break;
            case 'verificationScore':
                sorted.sort((a, b) => b.verification.score - a.verification.score);
                break;
            default:
                break;
        }
        return sorted;
    }, [candidates, sortBy]);

    useEffect(() => {
        // Automatically select the first candidate when results are loaded or sorted
        if (sortedCandidates && sortedCandidates.length > 0) {
            setSelectedCandidate(sortedCandidates[0]);
        } else {
            setSelectedCandidate(null);
        }
    }, [sortedCandidates]);

    if (!candidates || candidates.length === 0) {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-md border">
                <h3 className="text-xl font-bold text-slate-800">No Results</h3>
                <p className="text-slate-500 mt-2">The analysis did not return any valid candidate profiles. Please try again.</p>
            </div>
        );
    }
    
    const SortButton: React.FC<{ sortKey: SortKey, children: React.ReactNode }> = ({ sortKey, children }) => (
        <button
            onClick={() => setSortBy(sortKey)}
            className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                sortBy === sortKey
                    ? 'bg-cyan-600 text-white shadow'
                    : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
            }`}
        >
            {children}
        </button>
    );

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2 md:p-4">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 px-2 md:px-0">
                <h2 className="text-2xl font-bold text-slate-800">Analysis Results</h2>
                <div className="flex items-center gap-2 mt-2 sm:mt-0 flex-wrap">
                    <span className="text-sm font-medium text-slate-500">Sort by:</span>
                    <SortButton sortKey="matchScore">Best Match</SortButton>
                    <SortButton sortKey="name">Name (A-Z)</SortButton>
                    <SortButton sortKey="verificationScore">Verification</SortButton>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
                <aside className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                   <CandidateSidePanel 
                     candidates={sortedCandidates} 
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
