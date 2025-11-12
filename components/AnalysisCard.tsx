import React, { useState } from 'react';
import { JobSeekerAnalysis } from '../types';
import InsightCard from './InsightCard';
import ScoreRing from './ScoreRing';
import SkillGapCard from './SkillGapCard';
import CareerPathCard from './CareerPathCard';
import PersonalityFitCard from './PersonalityFitCard';
import SalaryEstimateCard from './SalaryEstimateCard';
import { AwardIcon, BeakerIcon, TrendingUpIcon, BrainCircuitIcon, PathIcon, TargetIcon, ClipboardCheckIcon } from './icons/Icons';

type TabName = 'Overview' | 'ATS Fit' | 'Skill Gap' | 'Career Path' | 'Personality';

const AnalysisCard: React.FC<{ analysis: JobSeekerAnalysis }> = ({ analysis }) => {
  const [activeTab, setActiveTab] = useState<TabName>('Overview');

  const tabs: { name: TabName; icon: React.ReactNode }[] = [
    { name: 'Overview', icon: <AwardIcon className="w-5 h-5" /> },
    { name: 'ATS Fit', icon: <ClipboardCheckIcon className="w-5 h-5" /> },
    { name: 'Skill Gap', icon: <TargetIcon className="w-5 h-5" /> },
    { name: 'Career Path', icon: <PathIcon className="w-5 h-5" /> },
    { name: 'Personality', icon: <BrainCircuitIcon className="w-5 h-5" /> },
  ];
  
  const renderRoleFit = (roles: {title: string, fit: number}[]) => {
      if (!roles || roles.length === 0) return null;
      return (
        <div>
            <h4 className="flex items-center gap-2 text-md font-semibold text-slate-700 mb-3">
                <TrendingUpIcon className="w-5 h-5 text-cyan-500" />
                Top Matching Roles
            </h4>
            <div className="space-y-2">
                {roles.map(role => (
                    <div key={role.title} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-lg">
                        <span className="font-medium text-slate-800">{role.title}</span>
                        <span className="font-bold text-cyan-600">{role.fit}% Fit</span>
                    </div>
                ))}
            </div>
        </div>
      );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="space-y-6">
            <p className="text-slate-600 text-sm">{analysis.overview.summary}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <ScoreRing score={analysis.overview.match_score} size={100} strokeWidth={8} />
                    <p className="text-sm font-bold text-slate-700 mt-2">Overall Match Score</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <ScoreRing score={analysis.ats_fit.score} size={100} strokeWidth={8} />
                    <p className="text-sm font-bold text-slate-700 mt-2">ATS Compatibility</p>
                </div>
                 <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <ScoreRing score={analysis.overview.authenticity_score} size={100} strokeWidth={8} />
                    <p className="text-sm font-bold text-slate-700 mt-2">Resume Authenticity</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InsightCard title="Key Strengths" items={analysis.overview.strengths} type="strength" />
                <InsightCard title="Areas for Improvement" items={analysis.overview.weaknesses} type="improvement" />
            </div>
            {renderRoleFit(analysis.overview.roles)}
          </div>
        );
      case 'ATS Fit':
        return (
           <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex flex-col items-center">
                        <ScoreRing score={analysis.ats_fit.score} />
                        <p className="text-lg font-bold text-slate-700 mt-2">ATS Score</p>
                    </div>
                    <div className="flex-1">
                        <InsightCard title="Optimization Suggestions" items={analysis.ats_fit.suggestions} type="improvement" />
                    </div>
                </div>
                {analysis.ats_fit.issues.length > 0 && <InsightCard title="Formatting & Readability Issues" items={analysis.ats_fit.issues} type="improvement" />}
           </div>
        );
      case 'Skill Gap':
        return <SkillGapCard skillGap={analysis.skill_gap} />;
      case 'Career Path':
        return <CareerPathCard careerPath={analysis.career_path} />;
      case 'Personality':
        return <PersonalityFitCard personality={analysis.personality} />;
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="border-b border-gray-200 mb-4">
        <nav className="-mb-px flex space-x-2 md:space-x-4 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`${
                activeTab === tab.name
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap flex items-center gap-2 py-3 px-2 md:px-3 border-b-2 font-medium text-sm transition-colors`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-1">{renderContent()}</div>
      {activeTab === 'Overview' && analysis.salary_estimate && <SalaryEstimateCard estimate={analysis.salary_estimate} />}
    </div>
  );
};

export default AnalysisCard;
