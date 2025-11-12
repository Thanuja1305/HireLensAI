import React from 'react';
import { PersonalityAnalysis } from '../types';
import ScoreRing from './ScoreRing';
import { BrainCircuitIcon, UserCircleIcon } from './icons/Icons';

interface PersonalityFitCardProps {
    personality: PersonalityAnalysis;
}

const PersonalityFitCard: React.FC<PersonalityFitCardProps> = ({ personality }) => {
    
    const getBarColor = (score: number) => {
        if (score >= 80) return 'bg-cyan-500';
        if (score >= 60) return 'bg-cyan-400';
        return 'bg-cyan-300';
    };
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex flex-col items-center">
                    <ScoreRing score={personality.fit_score} />
                    <p className="text-lg font-bold text-slate-700 mt-2">Overall Fit Score</p>
                </div>
                <div className="flex-1 w-full">
                     <h4 className="flex items-center gap-2 text-md font-semibold text-slate-700 mb-3">
                        <BrainCircuitIcon className="w-5 h-5 text-cyan-500" />
                        Culture Fit
                    </h4>
                    <div className="space-y-2">
                        {personality.culture_fit.map((fit, index) => (
                            <div key={index} className="text-sm">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-slate-800">{fit.environment}</span>
                                    <span className="font-semibold text-cyan-600">{fit.score}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className={`${getBarColor(fit.score)} h-2 rounded-full`} style={{ width: `${fit.score}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {personality.traits && personality.traits.length > 0 && (
                <div>
                    <h4 className="flex items-center gap-2 text-md font-semibold text-slate-700 mb-3">
                         <UserCircleIcon className="w-5 h-5 text-cyan-500" />
                        Inferred Personality Traits
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {personality.traits.map((trait, index) => (
                           <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full border border-gray-200">
                               {trait}
                           </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonalityFitCard;
