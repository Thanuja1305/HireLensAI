import React from 'react';
import RoleSelector from './RoleSelector';
import { Role } from '../types';

interface LandingPageProps {
    onSelectRole: (role: Role) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole }) => {
    return (
        <div className="flex flex-col items-center justify-center">
            <RoleSelector onSelectRole={onSelectRole} />
        </div>
    );
};

export default LandingPage;
