import React from 'react';
import { CandidateMatch } from '../types';
import ResumeCard from './ResumeCard';

interface CandidateSidePanelProps {
    candidates: CandidateMatch[];
    selectedCandidateId?: string | null;
    onSelectCandidate: (candidate: CandidateMatch) => void;
}

const CandidateSidePanel: React.FC<CandidateSidePanelProps> = ({ candidates, selectedCandidateId, onSelectCandidate }) => {
    return (
        <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-2">
            {candidates.map((candidate) => (
                <ResumeCard
                    key={candidate.id}
                    candidate={candidate}
                    onClick={() => onSelectCandidate(candidate)}
                    isSelected={candidate.id === selectedCandidateId}
                />
            ))}
        </div>
    );
};

export default CandidateSidePanel;
