import React from 'react';
import { RecruiterSummary } from '../types';
import { BriefcaseIcon, AwardIcon } from './icons/Icons';

interface RecruiterSummaryCardProps {
    summary: RecruiterSummary;
}

const RecruiterSummaryCard: React.FC<RecruiterSummaryCardProps> = ({ summary }) => {
    return (
        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-2">AI Summary</h3>
            <p className="text-sm text-slate-600 mb-4">{summary.summary}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                        <BriefcaseIcon className="w-4 h-4" />
                        Ideal Roles
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {summary.idealRoles.map((role, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                {role}
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                     <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                        <AwardIcon className="w-4 h-4" />
                        Key Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {summary.keySkills.map((skill, index) => (
                            <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            
            {summary.verificationHighlights && summary.verificationHighlights.length > 0 && (
                 <div className="mt-4">
                     <h4 className="text-sm font-semibold text-slate-700 mb-2">Verification Highlights</h4>
                     <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                         {summary.verificationHighlights.map((highlight, index) => <li key={index}>{highlight}</li>)}
                     </ul>
                 </div>
            )}
        </div>
    );
};

export default RecruiterSummaryCard;
