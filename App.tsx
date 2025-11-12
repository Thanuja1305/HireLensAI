import React, { useState, useEffect } from 'react';
import { Role } from './types';
import LandingPage from './components/LandingPage';
import JobSeekerDashboard from './components/JobSeekerDashboard';
import RecruiterDashboard from './components/RecruiterDashboard';
import ApiKeyMessage from './components/ApiKeyMessage';
import ChatbotWidget from './components/ChatbotWidget';

type AppState = 'landing' | 'jobseeker' | 'recruiter';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('landing');
    const [hasApiKey, setHasApiKey] = useState(true);

    useEffect(() => {
        if (!process.env.API_KEY) {
            setHasApiKey(false);
        }
    }, []);

    const handleSelectRole = (role: Role) => {
        setAppState(role);
    };

    const handleBackToHome = () => {
        setAppState('landing');
    }

    const renderContent = () => {
        switch (appState) {
            case 'jobseeker':
                return <JobSeekerDashboard onBack={handleBackToHome} />;
            case 'recruiter':
                return <RecruiterDashboard onBack={handleBackToHome} />;
            case 'landing':
            default:
                return <LandingPage onSelectRole={handleSelectRole} />;
        }
    };
    
    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center cursor-pointer" onClick={handleBackToHome}>
                            <h1 className="text-xl font-bold text-slate-800">HireLens AI</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {!hasApiKey ? <ApiKeyMessage /> : renderContent()}
            </main>
            
            {appState !== 'landing' && hasApiKey && <ChatbotWidget role={appState} />}
        </div>
    );
};

export default App;