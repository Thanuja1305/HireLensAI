import React from 'react';

interface AuthPageProps {
  onLoginSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  return (
    <div className="w-full max-w-md mx-auto text-center p-8 bg-white/60 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-200 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Authentication</h1>
      <p className="text-gray-600 mb-6">
        For demonstration purposes, authentication is simulated. Click below to proceed to the application.
      </p>
      <button
        onClick={onLoginSuccess}
        className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
      >
        Proceed to HireLens
      </button>
    </div>
  );
};

export default AuthPage;
