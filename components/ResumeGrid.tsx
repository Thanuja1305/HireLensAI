import React from 'react';
import { CandidateMatch } from '../types';
import ResumeCard from './ResumeCard';

interface ResumeGridProps {
    candidates: CandidateMatch[];
    onSelectCandidate: (candidate: CandidateMatch) => void;
}

const ResumeGrid: React.FC<ResumeGridProps> = ({ candidates, onSelectCandidate }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {candidates.map((candidate) => (
                <ResumeCard
                    key={candidate.id}
                    candidate={candidate}
                    onClick={() => onSelectCandidate(candidate)}
                />
            ))}
        </div>
    );
};

export default ResumeGrid;
