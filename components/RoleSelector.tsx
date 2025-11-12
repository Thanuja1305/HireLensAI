import React from 'react';
import { Role } from '../types';

interface RoleSelectorProps {
  onSelectRole: (role: Role) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  return (
    <div className="w-full max-w-4xl mx-auto text-center p-8 bg-white/60 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-200 animate-fade-in">
      <h1 className="text-4xl font-bold text-slate-800 mb-2">Welcome to HireLens AI</h1>
      <p className="text-lg text-slate-600 mb-8">
        Your intelligent assistant for navigating the job market.
      </p>
      <p className="text-xl font-semibold text-slate-700 mb-6">Choose your role to get started:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Seeker Card */}
        <button
          onClick={() => onSelectRole('jobseeker')}
          className="group p-8 bg-white rounded-xl shadow-md hover:shadow-xl border border-transparent hover:border-cyan-500 transition-all transform hover:-translate-y-1"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Job Seeker</h2>
            <p className="text-slate-600">Analyze your resume, discover skill gaps, and get personalized career advice.</p>
          </div>
        </button>
        
        {/* Recruiter Card */}
        <button
          onClick={() => onSelectRole('recruiter')}
          className="group p-8 bg-white rounded-xl shadow-md hover:shadow-xl border border-transparent hover:border-cyan-500 transition-all transform hover:-translate-y-1"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Recruiter</h2>
            <p className="text-slate-600">Screen candidates, verify claims, and detect resume fraud with AI-powered insights.</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default RoleSelector;
