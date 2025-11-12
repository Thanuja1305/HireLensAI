import React from 'react';
import { SkillGapAnalysis } from '../types';
import { TargetIcon, LinkIcon, BeakerIcon } from './icons/Icons';

interface SkillGapCardProps {
    skillGap: SkillGapAnalysis;
}

const SkillGapCard: React.FC<SkillGapCardProps> = ({ skillGap }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="flex items-center gap-2 text-md font-semibold text-slate-700 mb-3">
                        <TargetIcon className="w-5 h-5 text-green-500" />
                        Skills Found
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm pl-2 text-slate-600">
                        {skillGap.skills_found.map((skill, index) => <li key={index}>{skill}</li>)}
                    </ul>
                </div>
                 <div>
                    <h4 className="flex items-center gap-2 text-md font-semibold text-slate-700 mb-3">
                        <TargetIcon className="w-5 h-5 text-yellow-500" />
                        Missing Skills
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm pl-2 text-slate-600">
                        {skillGap.missing_skills.map((skill, index) => <li key={index}>{skill}</li>)}
                    </ul>
                </div>
            </div>

            {skillGap.learning_recommendations && skillGap.learning_recommendations.length > 0 && (
                <div>
                    <h4 className="flex items-center gap-2 text-md font-semibold text-slate-700 mb-3">
                         <BeakerIcon className="w-5 h-5 text-cyan-500" />
                        Learning Recommendations
                    </h4>
                    <div className="space-y-2">
                        {skillGap.learning_recommendations.map((rec, index) => (
                            <a href={rec.url} target="_blank" rel="noopener noreferrer" key={index} className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                                <p className="font-semibold text-cyan-700">{rec.title}</p>
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                    Provider: {rec.provider} <LinkIcon className="w-3 h-3" />
                                </p>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillGapCard;
