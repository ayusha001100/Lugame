import { TaskType, MarketingKPIs } from '@/types/game';

export interface EvaluationResultData {
    score: number;
    passed: boolean;
    feedback: string;
    strengths: string[];
    fixes: string[];
    redoSuggestions: string[];
    nextBestAction: string;
    criteriaScores: Array<{
        name: string;
        score: number;
        feedback: string;
    }>;
    improvement: string;
    kpiImpact?: Partial<MarketingKPIs>;
    managerMood?: 'happy' | 'angry' | 'neutral' | 'surprised' | 'disappointed';
    managerMessage?: string;
    suggestedKeywords?: string[];
}

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

/**
 * MODULE 6: AI Evaluation & Feedback Orchestrator
 * Connects to Gemini API for professional marketing evaluation
 */
export const evaluateSubmission = async (
    submission: any,
    config: {
        criteria: any[];
        passingScore: number;
        taskType: TaskType;
        levelId: number; // Knowledge of current level for dynamic difficulty
        rubricPrompt?: string;
        levelTitle?: string;
        levelPrompt?: string;
        attempt?: number;
        phaseId?: string; 
    }
): Promise<EvaluationResultData> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const attempt = config.attempt || 1;
    const phaseId = config.phaseId;
    const levelId = config.levelId;

    // Fallback if API key is missing
    if (!apiKey) {
        console.warn("VITE_GEMINI_API_KEY missing. Using fallback evaluation.");
        return fallbackEvaluation(submission, config);
    }

    try {
        const difficultyContext = levelId <= 3 
            ? "This is an introductory level (NOVICE). The intern is new. Be extremely lenient and encouraging. If they have the basic idea right, give them a high score (80-90+). Focus on teaching them the ropes. Do NOT fail them unless the answer is completely irrelevant." 
            : levelId <= 7 
                ? "This is a mid-level challenge (PROFESSIONAL). Be professional and balanced. Expect correct industry terminology and logical reasoning. Grade fairly but strictly. Small mistakes are okay but should be mentioned in the fixes." 
                : "This is an advanced level (ELITE). You are now looking for a future Lead Strategist. Be highly critical, cynical, and tough. Do NOT accept mediocre work. Even small strategic errors should result in a score below the passing threshold. Make them work for it.";

        const prompt = `
        You are a Senior Marketing Director at NovaTech. You are evaluating a submission from a Marketing Intern.
        
        LEVEL ID: ${levelId}
        DIFFICULTY MODE: ${levelId <= 3 ? "LENIENT" : levelId <= 7 ? "STANDARD" : "ULTRA-STRICT"}
        DIFFICULTY CONTEXT: ${difficultyContext}
        LEVEL TITLE: ${config.levelTitle || "N/A"}
        TASK: ${config.levelPrompt || "N/A"}
        TASK TYPE: ${config.taskType}
        ATTEMPT NUMBER: ${attempt}
        ${phaseId ? `PHASE: ${phaseId}` : ""}
        
        SUBMISSION:
        "${typeof submission === 'string' ? submission : JSON.stringify(submission)}"
        
        RUBRIC & CRITERIA:
        ${config.criteria.map(c => `- ${c.name}: ${c.description} (Weight: ${c.weight}%)`).join('\n')}
        PASSING SCORE: ${config.passingScore} (60% is standard)
        
        INSTRUCTIONS:
        1. Evaluate based on the DIFFICULTY MODE. In LENIENT mode, find reasons to pass them. In ULTRA-STRICT mode, find reasons to fail them unless they are perfect.
        2. Provide a professional, detailed review.
        3. Identify 3-4 specific "keywords" or "phrases" the intern should have used to pass or improve.
        4. Determine a "Manager Mood" and a short "Manager Message" (direct quote).
        
        MANAGER PERSONA RULES:
        - If score >= 80: Mood is "happy". Manager is impressed and praises the intern's potential.
        - If score >= 60 and < 80: Mood is "neutral". Manager is okay with the work but expects more growth.
        - If score < 60 and ATTEMPT = 1: Mood is "disappointed". Manager is firm but expects a better second attempt.
        - If score < 60 and ATTEMPT > 1: Mood is "angry". Manager yells, is rude, and mentions that repeating mistakes is unacceptable for an intern at NovaTech. Use strong corporate language (e.g., "This is a waste of my time!", "Are you even listening?!").
        
        RETURN JSON STRUCTURE:
        {
            "score": number (0-100),
            "passed": boolean,
            "feedback": "string (detailed review of 3-4 sentences)",
            "strengths": ["string", "string"],
            "fixes": ["string (specific areas to improve)"],
            "redoSuggestions": ["string (how to rewrite/fix)"],
            "nextBestAction": "string",
            "managerMood": "happy" | "neutral" | "disappointed" | "angry",
            "managerMessage": "string (direct quote from manager)",
            "suggestedKeywords": ["string", "string"],
            "criteriaScores": [
                { "name": "string", "score": number, "feedback": "string" }
            ],
            "improvement": "string (general advice including the suggested keywords to write to pass)"
        }
        `;

        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { 
                    responseMimeType: "application/json",
                    temperature: 0.8
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API call failed: ${JSON.stringify(errorData)}`);
        }
        
        const data = await response.json();
        const rawContent = data.candidates[0].content.parts[0].text;
        const result = JSON.parse(rawContent);

        // Ensure passed is based on 60% if not specified
        result.passed = result.score >= (config.passingScore || 60);

        return {
            ...result,
            kpiImpact: {
                conversionRate: (result.score / 100) * 2,
                leads: Math.floor((result.score / 100) * 100),
                roas: (result.score / 100) * 0.5,
                revenue: Math.floor((result.score / 100) * 5000)
            }
        };

    } catch (error) {
        console.error("Gemini Evaluation Error:", error);
        return fallbackEvaluation(submission, config);
    }
};

const fallbackEvaluation = async (submission: any, config: any): Promise<EvaluationResultData> => {
    const wordCount = typeof submission === 'string' ? submission.trim().split(/\s+/).length : 0;
    const attempt = config.attempt || 1;
    const phaseId = config.phaseId;
    
    const criteriaScores = config.criteria.map((c: any) => {
        const score = Math.min(100, 40 + (wordCount * 2) + (Math.random() * 10));
        return {
            name: c.name,
            score: Math.floor(score),
            feedback: score > 80 ? "Good work." : "Needs more detail."
        };
    });

    const averageScore = Math.floor(criteriaScores.reduce((acc: number, curr: any) => acc + curr.score, 0) / criteriaScores.length);
    const passed = averageScore >= (config.passingScore || 60);

    let mood: 'happy' | 'neutral' | 'disappointed' | 'angry' = 'neutral';
    let message = "Keep working on it.";

    if (averageScore >= 80) {
        mood = 'happy';
        message = "Exemplary work, intern! You're showing real promise.";
    } else if (averageScore >= 60) {
        mood = 'neutral';
        message = "Acceptable. But at NovaTech, we aim for excellence, not just 'acceptable'.";
    } else if (attempt > 1) {
        mood = 'angry';
        message = "AGAIN?! Are you even trying to learn? This is a disgrace to the department!";
    } else {
        mood = 'disappointed';
        message = "This isn't what I expected. Take these hints and fix it immediately.";
    }

    return {
        score: averageScore,
        passed,
        feedback: "Fallback evaluation used. Gemini API connection failed.",
        strengths: ["Task submitted"],
        fixes: ["Requires more depth"],
        redoSuggestions: ["Focus on the core KPIs and audience targeting"],
        nextBestAction: passed ? "Next Level" : "Retry with hints",
        criteriaScores,
        improvement: "Use keywords like 'ROAS', 'CTR', 'Segments', and 'LTV' to improve your score.",
        managerMood: mood,
        managerMessage: message,
        suggestedKeywords: ['ROAS', 'CTR', 'CPC', 'Targeting'],
        kpiImpact: { conversionRate: 0.5, leads: 20, roas: 0.1, revenue: 500 }
    };
};

export const evaluateCreativeSubmission = async (
    elements: any[],
    config: {
        levelId: number;
        criteria: any[];
        passingScore: number;
        levelTitle?: string;
        levelPrompt?: string;
    }
): Promise<EvaluationResultData> => {
    return evaluateSubmission(elements, { ...config, taskType: 'creative-canvas' as any });
};
