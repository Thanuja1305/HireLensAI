import React from 'react';
import { CandidateMatch } from '../types';
import ScoreRing from './ScoreRing';
import RecruiterSummaryCard from './RecruiterSummaryCard';
import VerificationResultCard from './VerificationResultCard';
import FraudDetectionCard from './FraudDetectionCard';
import SalaryEstimateCard from './SalaryEstimateCard';
import CredlyVerificationCard from './CredlyVerificationCard';
import ResumePreviewCard from './ResumePreviewCard';

interface CandidateDetailViewProps {
    candidate: CandidateMatch;
}

const CandidateDetailView: React.FC<CandidateDetailViewProps> = ({ candidate }) => {
    return (
        <div className="animate-fade-in space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold text-slate-800">{candidate.candidateName}</h2>
                    <p className="text-sm text-slate-500">{candidate.fileName}</p>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center">
                    <ScoreRing score={candidate.matchScore} size={80} strokeWidth={8}/>
                    <p className="text-sm font-bold text-slate-700 mt-2">Match Score</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                    <RecruiterSummaryCard summary={candidate.summary} />
                    <VerificationResultCard verification={candidate.verification} />
                    {candidate.credlyVerification && <CredlyVerificationCard result={candidate.credlyVerification} />}
                </div>
                <div className="space-y-4">
                     <ResumePreviewCard resumeText={candidate.resumeText} fileName={candidate.fileName} />
                    <SalaryEstimateCard estimate={candidate.salaryEstimate} />
                    <FraudDetectionCard result={candidate.fraudDetection} />
                </div>
            </div>
        </div>
    );
};

export default CandidateDetailView;
