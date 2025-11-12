import React, { useState } from 'react';
import { ComprehensiveVerificationResult } from '../types';
import ScoreRing from './ScoreRing';
import VerifiedBadge from './VerifiedBadge';
import { LinkIcon } from './icons/Icons';

interface VerificationResultCardProps {
    verification: ComprehensiveVerificationResult;
}

const VerificationResultCard: React.FC<VerificationResultCardProps> = ({ verification }) => {
    const [showClaims, setShowClaims] = useState(true);

    return (
        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-3">Claim Verification & Authenticity</h3>
            
            <div className="flex flex-col md:flex-row gap-6 items-center border-b border-gray-200 pb-4 mb-4">
                <div className="flex flex-col items-center">
                    <ScoreRing score={verification.score} size={100} />
                    <p className="text-sm font-bold text-slate-700 mt-2">Authenticity Score</p>
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-slate-700">Overall Status</h4>
                         <VerifiedBadge status={verification.status} />
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{verification.summary}</p>
                    {verification.flags.length > 0 && (
                        <div>
                             <h5 className="text-xs font-bold text-slate-500 uppercase mb-1">Flags</h5>
                             <div className="flex flex-wrap gap-2">
                                {verification.flags.map((flag, index) => (
                                    <span key={index} className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">{flag}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                 <button onClick={() => setShowClaims(!showClaims)} className="text-md font-semibold text-slate-800 w-full text-left flex justify-between items-center">
                    <span>Detailed Claim Analysis ({verification.claimResults.length})</span>
                    <span className={`transform transition-transform ${showClaims ? 'rotate-180' : ''}`}>&#9660;</span>
                 </button>

                 {showClaims && (
                     <div className="space-y-3 animate-fade-in">
                        {verification.claimResults.map((claim, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-start gap-2">
                                    <p className="font-semibold text-sm text-slate-800">{claim.claim}</p>
                                    <div className="flex-shrink-0">
                                        <VerifiedBadge status={claim.status} />
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 italic"><strong>Evidence:</strong> {claim.evidence}</p>
                                <p className="text-xs text-slate-500 mt-1"><strong>Explanation:</strong> {claim.explanation}</p>
                            </div>
                        ))}
                    </div>
                 )}
                 
                 {verification.consultedSources && verification.consultedSources.length > 0 && (
                     <div>
                         <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Consulted Sources</h4>
                         <div className="flex flex-wrap gap-2">
                            {verification.consultedSources.map((source, index) => (
                                <a href={source} key={index} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md hover:underline flex items-center gap-1">
                                    <LinkIcon className="w-3 h-3" />
                                    {new URL(source).hostname}
                                </a>
                            ))}
                         </div>
                     </div>
                 )}
            </div>
        </div>
    );
};

export default VerificationResultCard;
