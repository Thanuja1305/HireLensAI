import React from 'react';
import { CredlyVerificationResult } from '../types';
import { AwardIconCheckSolid, AwardIconX, LinkIcon } from './icons/Icons';

interface CredlyVerificationCardProps {
    result: CredlyVerificationResult;
}

const CredlyVerificationCard: React.FC<CredlyVerificationCardProps> = ({ result }) => {
    const isVerified = result.status === 'Verified';

    return (
        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
                 <h3 className="text-lg font-bold text-slate-800">Credly Badge Verification</h3>
                 {result.profileUrl && (
                     <a href={result.profileUrl} target="_blank" rel="noopener noreferrer" className="text-sm bg-gray-200 hover:bg-gray-300 text-slate-800 font-semibold py-1 px-3 rounded-lg transition-colors flex items-center gap-1.5 flex-shrink-0">
                         View Profile <LinkIcon className="w-4 h-4" />
                     </a>
                 )}
            </div>

            <div className={`flex items-center gap-2 mt-2 mb-4 p-2 rounded-md ${isVerified ? 'bg-green-50' : 'bg-gray-100'}`}>
                {isVerified ? (
                    <AwardIconCheckSolid className="w-5 h-5 text-green-600" />
                ) : (
                    <AwardIconX className="w-5 h-5 text-gray-500" />
                )}
                <p className={`text-sm font-semibold ${isVerified ? 'text-green-800' : 'text-gray-700'}`}>
                    {isVerified ? `Profile Verified (${result.badges.length} badges found)` : 'Profile Not Found or No Public Badges'}
                </p>
            </div>
            
            {isVerified && result.badges.length > 0 && (
                <div className="space-y-2">
                     <h4 className="text-xs font-bold text-slate-500 uppercase">Verified Badges</h4>
                     {result.badges.map((badge, index) => (
                         <a href={badge.url} target="_blank" rel="noopener noreferrer" key={index} className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                             <div className="flex justify-between items-start">
                                 <div>
                                    <p className="font-semibold text-blue-700">{badge.name}</p>
                                    <p className="text-xs text-slate-500">Issued by: {badge.issuer}</p>
                                 </div>
                                 <p className="text-xs text-slate-500 flex-shrink-0">{badge.issueDate}</p>
                             </div>
                         </a>
                     ))}
                </div>
            )}
        </div>
    );
};

export default CredlyVerificationCard;
