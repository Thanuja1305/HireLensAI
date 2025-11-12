import React from 'react';
import { ComprehensiveVerificationResult } from '../types';
import { AwardIconCheckSolid, AwardIconX, AwardIconExclamation } from './icons/Icons';

interface VerifiedBadgeProps {
  status: ComprehensiveVerificationResult['status'] | 'Verified' | 'Unverified' | 'Contradictory' | 'Uncertain'; // Allow both status sets
}

const statusConfig = {
    Verified: {
        text: 'Verified',
        classes: 'bg-green-100 text-green-800 border-green-200',
        icon: <AwardIconCheckSolid className="w-4 h-4 text-green-600" />
    },
    'Needs Review': {
        text: 'Needs Review',
        classes: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <AwardIconExclamation className="w-4 h-4 text-yellow-600" />
    },
    Suspicious: {
        text: 'Suspicious',
        classes: 'bg-red-100 text-red-800 border-red-200',
        icon: <AwardIconX className="w-4 h-4 text-red-600" />
    },
    Unverified: {
        text: 'Unverified',
        classes: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <AwardIconExclamation className="w-4 h-4 text-gray-600" />
    },
    Contradictory: {
        text: 'Contradictory',
        classes: 'bg-red-100 text-red-800 border-red-200',
        icon: <AwardIconX className="w-4 h-4 text-red-600" />
    },
    Uncertain: {
        text: 'Uncertain',
        classes: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <AwardIconExclamation className="w-4 h-4 text-yellow-600" />
    }
};

const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ status }) => {
    // @ts-ignore
    const config = statusConfig[status] || statusConfig.Unverified;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md border ${config.classes}`}>
            {config.icon}
            {config.text}
        </span>
    );
};

export default VerifiedBadge;
