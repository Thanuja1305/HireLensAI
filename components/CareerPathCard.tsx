import React from 'react';
import { CareerPathAnalysis } from '../types';
import ScoreRing from './ScoreRing';
import { PathIcon, BriefcaseIcon } from './icons/Icons';

interface CareerPathCardProps {
    careerPath: CareerPathAnalysis;
}

const CareerPathCard: React.FC<CareerPathCardProps> = ({ careerPath }) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex flex-col items-center">
                    <ScoreRing score={careerPath.career_readiness} />
                    <p className="text-lg font-bold text-slate-700 mt-2">Career Readiness</p>
                </div>
                <div className="flex-1 w-full">
                     <h4 className="flex items-center gap-2 text-md font-semibold text-slate-700 mb-3">
                        <PathIcon className="w-5 h-5 text-cyan-500" />
                        Potential Next Roles
                    </h4>
                    <div className="space-y-2">
                        {careerPath.next_roles.map((role, index) => (
                            <div key={index} className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <span className="font-medium text-slate-800 flex items-center gap-2">
                                    <BriefcaseIcon className="w-4 h-4 text-slate-500" />
                                    {role.role}
                                </span>
                                <span className="font-semibold text-cyan-600 text-xs bg-cyan-100 px-2 py-1 rounded-full">{role.time_to_reach}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareerPathCard;
