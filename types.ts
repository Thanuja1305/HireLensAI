export type Role = 'jobseeker' | 'recruiter';

// For Job Seeker Analysis
export interface SalaryEstimate {
    min: number;
    max: number;
    median: number;
    currency: string;
    confidence: number;
    explanation: string;
}

export interface PersonalityAnalysis {
    fit_score: number;
    culture_fit: {
        environment: string;
        score: number;
    }[];
    traits: string[];
}

export interface CareerPathAnalysis {
    career_readiness: number;
    next_roles: {
        role: string;
        time_to_reach: string;
    }[];
}

export interface SkillGapAnalysis {
    skills_found: string[];
    missing_skills: string[];
    learning_recommendations: {
        title: string;
        provider: string;
        url: string;
    }[];
}

export interface AtsFitAnalysis {
    score: number;
    suggestions: string[];
    issues: string[];
}

export interface OverviewAnalysis {
    match_score: number;
    authenticity_score: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    roles: {
        title: string;
        fit: number;
    }[];
}

export interface JobSeekerAnalysis {
    overview: OverviewAnalysis;
    ats_fit: AtsFitAnalysis;
    skill_gap: SkillGapAnalysis;
    career_path: CareerPathAnalysis;
    personality: PersonalityAnalysis;
    salary_estimate: SalaryEstimate;
}

// For Recruiter Analysis
export interface RecruiterSummary {
    summary: string;
    idealRoles: string[];
    keySkills: string[];
    verificationHighlights: string[];
}

export interface ComprehensiveVerificationResult {
    score: number;
    status: 'Verified' | 'Needs Review' | 'Suspicious';
    summary: string;
    flags: string[];
    claimResults: {
        claim: string;
        status: 'Verified' | 'Unverified' | 'Contradictory' | 'Uncertain';
        evidence: string;
        explanation: string;
    }[];
    consultedSources: string[];
}

export interface FraudDetectionResult {
    riskLevel: 'Low' | 'Medium' | 'High';
    summary: string;
    timelineIssues: string[];
    suspiciousClaims: string[];
    plagiarismSignals: string[];
}

export interface CredlyVerificationResult {
    status: 'Verified' | 'Not Found';
    profileUrl?: string;
    badges: {
        name: string;
        issuer: string;
        issueDate: string;
        url: string;
    }[];
}

export interface CandidateMatch {
    id: string;
    fileName: string;
    file: File;
    resumeText: string;
    candidateName: string;
    matchScore: number;
    summary: RecruiterSummary;
    verification: ComprehensiveVerificationResult;
    fraudDetection: FraudDetectionResult;
    salaryEstimate: SalaryEstimate;
    credlyVerification?: CredlyVerificationResult;
}