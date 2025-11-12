import { GoogleGenAI, Type } from "@google/genai";
import { JobSeekerAnalysis, CandidateMatch } from '../types';

const getAi = () => {
    if (!process.env.API_KEY) {
        throw new Error("API key is not configured. Please set the API_KEY environment variable.");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
}

const parseGeminiError = (error: any): string => {
    console.error("Gemini API Error:", error);
    let message = "An unexpected error occurred during analysis. Please check the console for details.";

    if (error && typeof error.message === 'string') {
        let errorMessage = error.message;
        let lowerCaseMessage = errorMessage.toLowerCase();

        // Handle JSON-formatted error messages from the API
        if (errorMessage.trim().startsWith('{')) {
            try {
                const errorObj = JSON.parse(errorMessage);
                if (errorObj.error && errorObj.error.message) {
                    errorMessage = errorObj.error.message;
                    lowerCaseMessage = errorMessage.toLowerCase();
                }
            } catch (e) { /* Fall through */ }
        }
        
        // Specific user-facing messages for common issues
        if (lowerCaseMessage.includes('overloaded') || lowerCaseMessage.includes('503')) {
            return "The AI model is currently overloaded. Please try again in a moment.";
        }
        if (lowerCaseMessage.includes('api key not valid') || lowerCaseMessage.includes('permission denied')) {
            return "Your API key is invalid or missing required permissions. Please check your configuration and ensure it's enabled for the Gemini API.";
        }
        if (lowerCaseMessage.includes('billing') || lowerCaseMessage.includes('quota')) {
            return "You have exceeded your API quota or there is a billing issue with your account. Please check your Google Cloud project settings.";
        }
        if (lowerCaseMessage.includes('invalid response format')) { // Custom error from recruiter analysis
            return "The AI model returned an unexpected response format. This can happen during high load. Please try again.";
        }
        
        // For other errors, return the original message
        return errorMessage;
    }
    
    return message;
};


// Schema for Job Seeker Analysis
const jobSeekerAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        overview: {
            type: Type.OBJECT,
            properties: {
                match_score: { type: Type.NUMBER, description: "Overall match score between resume and job description (0-100)." },
                authenticity_score: { type: Type.NUMBER, description: "Resume authenticity score (0-100)." },
                summary: { type: Type.STRING, description: "Summary of candidate's fit for the role." },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                roles: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: { title: { type: Type.STRING }, fit: { type: Type.NUMBER } },
                        required: ["title", "fit"],
                    },
                },
            },
            required: ["match_score", "authenticity_score", "summary", "strengths", "weaknesses", "roles"],
        },
        ats_fit: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.NUMBER, description: "ATS compatibility score (0-100)." },
                suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                issues: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["score", "suggestions", "issues"],
        },
        skill_gap: {
            type: Type.OBJECT,
            properties: {
                skills_found: { type: Type.ARRAY, items: { type: Type.STRING } },
                missing_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                learning_recommendations: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            provider: { type: Type.STRING },
                            url: { type: Type.STRING },
                        },
                        required: ["title", "provider", "url"],
                    },
                },
            },
            required: ["skills_found", "missing_skills", "learning_recommendations"],
        },
        career_path: {
            type: Type.OBJECT,
            properties: {
                career_readiness: { type: Type.NUMBER, description: "Career readiness score (0-100)." },
                next_roles: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            role: { type: Type.STRING },
                            time_to_reach: { type: Type.STRING },
                        },
                        required: ["role", "time_to_reach"],
                    },
                },
            },
            required: ["career_readiness", "next_roles"],
        },
        personality: {
            type: Type.OBJECT,
            properties: {
                fit_score: { type: Type.NUMBER, description: "Personality fit score (0-100)." },
                culture_fit: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            environment: { type: Type.STRING },
                            score: { type: Type.NUMBER },
                        },
                        required: ["environment", "score"],
                    },
                },
                traits: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["fit_score", "culture_fit", "traits"],
        },
        salary_estimate: {
            type: Type.OBJECT,
            properties: {
                min: { type: Type.NUMBER },
                max: { type: Type.NUMBER },
                median: { type: Type.NUMBER },
                currency: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                explanation: { type: Type.STRING },
            },
            required: ["min", "max", "median", "currency", "confidence", "explanation"],
        },
    },
    required: ["overview", "ats_fit", "skill_gap", "career_path", "personality", "salary_estimate"],
};

export const analyzeResumeForJobSeeker = async (resumeText: string, jobDescription: string): Promise<JobSeekerAnalysis> => {
    const ai = getAi();
    const prompt = `
        Analyze the following resume against the provided job description from the perspective of a helpful career coach for the job seeker. 
        Provide a comprehensive analysis in JSON format according to the schema.
        
        **Job Description:**
        ${jobDescription}
        
        **Resume:**
        ${resumeText}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: jobSeekerAnalysisSchema,
            },
        });

        const text = response.text.trim();
        return JSON.parse(text);

    } catch (error: any) {
        throw new Error(parseGeminiError(error));
    }
};


// Note: Since responseSchema cannot be used with grounding tools like googleSearch,
// we will instruct the model to return JSON and then parse it.
const recruiterAnalysisPrompt = (resumeText: string, jobDescription: string) => `
    As an expert technical recruiter, analyze the following resume for the given job description.
    Use Google Search to verify claims about companies, technologies, and educational institutions.
    Provide a detailed analysis. Your entire response MUST be a single JSON object that conforms to the following TypeScript interface:

    \`\`\`typescript
    interface RecruiterAnalysis {
        candidateName: string; // The full name of the candidate.
        matchScore: number; // Score from 0-100 on how well this candidate matches the job description.
        summary: {
            summary: string; // 2-3 sentence summary for the recruiter.
            idealRoles: string[]; // List of ideal roles for this candidate.
            keySkills: string[]; // Top 5-7 key skills.
            verificationHighlights: string[]; // Key claims that stand out.
        };
        verification: {
            score: number; // Overall authenticity score from 0-100.
            status: 'Verified' | 'Needs Review' | 'Suspicious'; // Overall verification status.
            summary: string; // Brief summary of verification findings.
            flags: string[]; // Potential red flags.
            claimResults: {
                claim: string; // A specific claim from the resume.
                status: 'Verified' | 'Unverified' | 'Contradictory' | 'Uncertain';
                evidence: string; // Evidence found for or against the claim.
                explanation: string; // Brief explanation of the status.
            }[];
            consultedSources: string[]; // URLs of sources consulted.
        };
        fraudDetection: {
            riskLevel: 'Low' | 'Medium' | 'High';
            summary: string; // Summary of fraud detection findings.
            timelineIssues: string[]; // Inconsistencies or gaps in the timeline.
            suspiciousClaims: string[]; // Exaggerated or unlikely claims.
            plagiarismSignals: string[]; // Sections that appear copied.
        };
        salaryEstimate: {
            min: number;
            max: number;
            median: number;
            currency: string;
            confidence: number; // 0.0 to 1.0
            explanation: string;
        };
    }
    \`\`\`

    **Job Description:**
    ${jobDescription}
    
    **Resume:**
    ${resumeText}
`;

export const analyzeResumeForRecruiter = async (resumeText: string, jobDescription: string): Promise<Omit<CandidateMatch, 'id' | 'fileName' | 'file' | 'resumeText' | 'credlyVerification'>> => {
    const ai = getAi();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: recruiterAnalysisPrompt(resumeText, jobDescription),
            config: {
                tools: [{ googleSearch: {} }],
                temperature: 0.2, // Lower temperature for more consistent JSON
            },
        });

        const text = response.text.trim();
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```|({[\s\S]*})/);
        
        if (jsonMatch && (jsonMatch[1] || jsonMatch[2])) {
            const jsonString = jsonMatch[1] || jsonMatch[2];
            const parsed = JSON.parse(jsonString);

            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (groundingChunks) {
                const sources = groundingChunks
                    .map((chunk: any) => chunk.web?.uri)
                    .filter(Boolean);
                if (parsed.verification && parsed.verification.consultedSources) {
                    const combinedSources = [...parsed.verification.consultedSources, ...sources];
                    parsed.verification.consultedSources = [...new Set(combinedSources)];
                } else if (parsed.verification) {
                    parsed.verification.consultedSources = sources;
                }
            }
            return parsed;
        } else {
             console.error("Failed to parse AI response, no JSON found:", text);
             throw new Error("The AI model returned an invalid response format.");
        }
    } catch (error: any) {
        throw new Error(parseGeminiError(error));
    }
};

// This is a mocked function as there is no real Credly API to call.
export const verifyCredlyProfile = async (candidateName: string) => {
    console.log(`Simulating Credly check for ${candidateName}`);
    return Promise.resolve(undefined);
};