import React, { useState } from 'react';
import { FraudDetectionResult } from '../types';
import { ShieldCheckIcon, ShieldExclamationIcon, ShieldXIcon } from './icons/Icons';

interface FraudDetectionCardProps {
    result: FraudDetectionResult;
}

const RiskLevelBadge: React.FC<{ level: 'Low' | 'Medium' | 'High' }> = ({ level }) => {
    const config = {
        Low: {
            text: 'Low Risk',
            icon: <ShieldCheckIcon className="w-5 h-5" />,
            classes: 'bg-green-100 text-green-800 border-green-200'
        },
        Medium: {
            text: 'Medium Risk',
            icon: <ShieldExclamationIcon className="w-5 h-5" />,
            classes: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        },
        High: {
            text: 'High Risk',
            icon: <ShieldXIcon className="w-5 h-5" />,
            classes: 'bg-red-100 text-red-800 border-red-200'
        }
    };
    const current = config[level];
    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-bold rounded-full border ${current.classes}`}>
            {current.icon}
            {current.text}
        </span>
    );
};

const IssueList: React.FC<{ title: string; issues: string[] }> = ({ title, issues }) => {
    const [isOpen, setIsOpen] = useState(true);
    if (issues.length === 0) return null;

    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left font-semibold text-slate-700 flex justify-between items-center">
                <span>{title} ({issues.length})</span>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>&#9660;</span>
            </button>
            {isOpen && (
                 <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm pl-4 mt-2 animate-fade-in">
                    {issues.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            )}
        </div>
    );
}

const FraudDetectionCard: React.FC<FraudDetectionCardProps> = ({ result }) => {
    return (
        <div className="w-full p-4 bg-white rounded-lg border border-gray-200 shadow-sm mt-4 animate-fade-in">
            <div className="text-center border-b border-gray-200 pb-3 mb-3">
                <h3 className="text-lg font-bold text-slate-800">Fraud Detection Report</h3>
                <div className="mt-2">
                    <RiskLevelBadge level={result.riskLevel} />
                </div>
                <p className="text-sm text-slate-600 mt-2">{result.summary}</p>
            </div>
            
            <div className="space-y-3">
                <IssueList title="Timeline Issues" issues={result.timelineIssues} />
                <IssueList title="Suspicious Claims" issues={result.suspiciousClaims} />
                <IssueList title="Plagiarism Signals" issues={result.plagiarismSignals} />
            </div>
        </div>
    );
};

export default FraudDetectionCard;
