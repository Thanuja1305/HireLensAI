import React from 'react';
import { AlertTriangleIcon } from './icons/Icons';

const ApiKeyMessage: React.FC = () => {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg my-6" role="alert">
      <div className="flex">
        <div className="py-1">
            <AlertTriangleIcon className="h-6 w-6 text-yellow-500 mr-4"/>
        </div>
        <div>
          <p className="font-bold">Gemini API Key is Missing</p>
          <p className="text-sm">
            This application requires a Google Gemini API key to function. Please make sure it's properly configured in your environment variables to enable resume analysis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyMessage;
