import React from 'react';
import { SalaryEstimate } from '../types';
import { CashIcon } from './icons/Icons';

interface SalaryEstimateCardProps {
  estimate: SalaryEstimate;
}

const SalaryEstimateCard: React.FC<SalaryEstimateCardProps> = ({ estimate }) => {
  if (!estimate) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: estimate.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm animate-fade-in mt-6">
      <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-3">
        <CashIcon className="w-6 h-6 text-green-600" />
        Estimated Salary
      </h3>
      <div className="space-y-3">
        <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-green-700">{formatCurrency(estimate.median)} / year</p>
            <p className="text-sm text-slate-600">
                Range: {formatCurrency(estimate.min)} - {formatCurrency(estimate.max)}
            </p>
             <p className="text-xs text-gray-400 mt-1">Confidence: {(estimate.confidence * 100).toFixed(0)}%</p>
        </div>
        <p className="text-xs text-slate-500 pt-2 text-center">{estimate.explanation}</p>
      </div>
    </div>
  );
};

export default SalaryEstimateCard;
