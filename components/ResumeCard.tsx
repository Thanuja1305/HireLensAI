import React from 'react';
import { CandidateMatch } from '../types';
import ScoreRing from './ScoreRing';
import VerifiedBadge from './VerifiedBadge';

interface ResumeCardProps {
    candidate: CandidateMatch;
    onClick: () => void;
    isSelected?: boolean;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ candidate, onClick, isSelected }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                isSelected 
                    ? 'bg-cyan-50 border-cyan-500 shadow-md' 
                    : 'bg-white border-gray-200 hover:border-cyan-400 hover:shadow-lg'
            }`}
        >
            <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                    <p className="text-md font-bold text-slate-800 truncate">{candidate.candidateName}</p>
                    <p className="text-xs text-slate-500 truncate">{candidate.fileName}</p>
                </div>
                <div className="flex-shrink-0">
                    <ScoreRing score={candidate.matchScore} size={40} strokeWidth={4} />
                </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-600">Verification:</span>
                    <VerifiedBadge status={candidate.verification.status} />
                 </div>
            </div>
        </button>
    );
};

export default ResumeCard;
