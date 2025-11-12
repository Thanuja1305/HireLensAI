import React from 'react';
import { ShieldCheckIcon, ShieldExclamationIcon } from './icons/Icons';

interface InsightCardProps {
  title: string;
  items: string[];
  type: 'strength' | 'improvement';
}

const InsightCard: React.FC<InsightCardProps> = ({ title, items, type }) => {
  const isStrength = type === 'strength';
  const icon = isStrength ? (
    <ShieldCheckIcon className="w-5 h-5 text-green-500" />
  ) : (
    <ShieldExclamationIcon className="w-5 h-5 text-yellow-500" />
  );
  
  const listColor = isStrength ? 'text-slate-600' : 'text-slate-600';

  if (!items || items.length === 0) {
    return (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 h-full">
            <h4 className="flex items-center gap-2 text-md font-semibold text-slate-700 mb-3">
                {icon}
                {title}
            </h4>
            <p className="text-sm text-slate-500">No specific items to show here.</p>
        </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 h-full">
      <h4 className="flex items-center gap-2 text-md font-semibold text-slate-700 mb-3">
        {icon}
        {title}
      </h4>
      <ul className={`list-disc list-inside space-y-1 text-sm pl-2 ${listColor}`}>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default InsightCard;
