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
        taskData?: any;
    }
): Promise<EvaluationResultData> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const attempt = config.attempt || 1;
    const phaseId = config.phaseId;
    const levelId = config.levelId;
    const taskData = config.taskData || {};

    // DETERMINISTIC EVALUATION FOR OBJECTIVE TASKS (NEW MODULE 6.1)
    // Ensures questions are actually checked against the 'correct' data in levels.ts
    const isObjective = ['mcq', 'fill-blanks', 'swipe', 'markup', 'rank-order'].includes(config.taskType);

    if (isObjective && taskData) {
        let isCorrect = false;
        let objectiveScore = 0;

        try {
            switch (config.taskType) {
                case 'mcq':
                    isCorrect = submission === taskData.correct;
                    objectiveScore = isCorrect ? 100 : 0;
                    break;
                case 'fill-blanks':
                    // Normalize for comparison
                    const submissionArray = Array.isArray(submission) ? submission : submission.split(',').map((s: string) => s.trim());
                    const correctArray = taskData.correct || [];
                    isCorrect = JSON.stringify(submissionArray) === JSON.stringify(correctArray);
                    objectiveScore = isCorrect ? 100 : 0;
                    break;
                case 'swipe':
                    const swipeItems = taskData.items || [];
                    let swipeMatches = 0;
                    // Submission is Record<string, 'approve' | 'reject'>
                    Object.entries(submission).forEach(([id, type]) => {
                        const original = swipeItems.find((i: any) => i.id === id);
                        if (original && original.type === type) swipeMatches++;
                    });
                    objectiveScore = Math.round((swipeMatches / swipeItems.length) * 100);
                    isCorrect = objectiveScore >= (config.passingScore || 80);
                    break;
                case 'markup':
                    const markupTargets = (taskData.targets || []).map((t: string) => t.toLowerCase());
                    const submissionText = (submission || "").toLowerCase();
                    // Check how many target phrases are found in the marked text
                    let foundCount = 0;
                    markupTargets.forEach((target: string) => {
                        if (submissionText.includes(target)) foundCount++;
                    });
                    objectiveScore = Math.round((foundCount / markupTargets.length) * 100);
                    isCorrect = objectiveScore >= (config.passingScore || 60);
                    break;
                case 'rank-order':
                    // Compare arrays - items should be in correct order in taskData.items
                    isCorrect = JSON.stringify(submission) === JSON.stringify(taskData.items);
                    objectiveScore = isCorrect ? 100 : 0;
                    break;
            }

            if (isCorrect || objectiveScore > 0) {
                return {
                    score: objectiveScore,
                    passed: objectiveScore >= (config.passingScore || 60),
                    feedback: objectiveScore >= 80 ? "Your strategic logic is perfectly aligned with the mission brief." : "You've identified most of the key elements, but some strategic gaps remain.",
                    strengths: objectiveScore >= 80 ? ["Logical precision", "Pattern recognition"] : ["Basic understanding"],
                    fixes: objectiveScore < 100 ? ["Analyze the core KPIs again"] : [],
                    redoSuggestions: objectiveScore < 100 ? ["Review the strategic hints in the Mission Intel"] : [],
                    nextBestAction: objectiveScore >= 60 ? "Proceed to next phase" : "Recalibrate and retry",
                    criteriaScores: config.criteria.map(c => ({ name: c.name, score: objectiveScore, feedback: "Validated against mission data." })),
                    improvement: objectiveScore < 100 ? "Look for deeper psychological triggers in the options." : "Excellent work. No improvements needed.",
                    managerMood: objectiveScore >= 80 ? 'happy' : (objectiveScore >= 60 ? 'neutral' : 'angry'),
                    managerMessage: objectiveScore >= 80 ? "That's exactly what I was looking for. Keep this momentum." : "It's acceptable, but I know you can do better.",
                    kpiImpact: { conversionRate: (objectiveScore / 100) * 1, leads: Math.floor((objectiveScore / 100) * 50) }
                };
            }
        } catch (e) {
            console.warn("Objective check failed, falling back to AI:", e);
        }
    }

    // Fallback if API key is missing
    if (!apiKey) {
        console.warn("VITE_GEMINI_API_KEY missing. Using fallback evaluation.");
        return fallbackEvaluation(submission, config, taskData);
    }

    try {
        const difficultyContext = levelId <= 3
            ? "This is an introductory level (NOVICE). The intern is new. Be extremely lenient and encouraging. If they have the basic idea right, give them a high score (80-90+). Focus on teaching them the ropes. Do NOT fail them unless the answer is completely irrelevant."
            : levelId <= 7
                ? "This is a mid-level challenge (PROFESSIONAL). Be professional and balanced. Expect correct industry terminology and logical reasoning. Grade fairly but strictly. Small mistakes are okay but should be mentioned in the fixes."
                : "This is an advanced level (ELITE). You are now looking for a future Lead Strategist. Be highly critical, cynical, and tough. Do NOT accept mediocre work. Even small strategic errors should result in a score below the passing threshold. Make them work for it.";

        const prompt = `
        You are a Senior Marketing Director at NovaTech. You are evaluating a submission from a Marketing Intern.
        
        MISSION CONTEXT:
        - LEVEL ID: ${levelId}
        - DIFFICULTY MODE: ${levelId <= 3 ? "LENIENT" : levelId <= 7 ? "STANDARD" : "ULTRA-STRICT"}
        - LEVEL TITLE: ${config.levelTitle || "N/A"}
        - DESIGNATED TASK: ${config.levelPrompt || "N/A"}
        - TASK TYPE: ${config.taskType}
        - CORRECT DATA/ANSWER (USE THIS AS TRUTH): ${JSON.stringify(taskData)}
        
        SUBMISSION:
        "${typeof submission === 'string' ? submission : JSON.stringify(submission)}"
        
        RUBRIC & CRITERIA:
        ${config.criteria.map(c => `- ${c.name}: ${c.description} (Weight: ${c.weight}%)`).join('\n')}
        PASSING SCORE: ${config.passingScore}
        
        INSTRUCTIONS:
        1. Compare the SUBMISSION against the CORRECT DATA.
        2. If the task is objective (MCQ, etc.) and doesn't match the CORRECT DATA, they MUST fail.
        3. For subjective tasks (Short Answer), grade based on how well they covered the expected keywords or intent in the CORRECT DATA.
        4. Be professional and detailed.
        
        MANAGER PERSONA RULES:
        - If score >= 80: Mood is "happy". Manager is impressed.
        - If score >= 60 and < 80: Mood is "neutral". Manager expects more.
        - If score < 60: Mood is "disappointed" or "angry" if repetitive.
        
        RETURN JSON STRUCTURE:
        {
            "score": number (0-100),
            "passed": boolean,
            "feedback": "string",
            "strengths": ["string"],
            "fixes": ["string"],
            "redoSuggestions": ["string"],
            "nextBestAction": "string",
            "managerMood": "happy" | "neutral" | "disappointed" | "angry",
            "managerMessage": "string",
            "suggestedKeywords": ["string"],
            "criteriaScores": [
                { "name": "string", "score": number, "feedback": "string" }
            ],
            "improvement": "string"
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
        return fallbackEvaluation(submission, config, taskData);
    }
};

const fallbackEvaluation = async (submission: any, config: any, taskData: any): Promise<EvaluationResultData> => {
    const wordCount = typeof submission === 'string' ? submission.trim().split(/\s+/).length : 0;
    const isObjective = ['mcq', 'fill-blanks', 'swipe', 'markup', 'rank-order'].includes(config.taskType);

    // If it's an objective task but deterministic check failed/was skipped, check again here
    if (isObjective && taskData) {
        // (Similar logic to above but simplified for fallback)
        let localScore = 0;
        if (config.taskType === 'mcq') localScore = submission === taskData.correct ? 100 : 0;
        if (config.taskType === 'fill-blanks') {
            const subArr = Array.isArray(submission) ? submission : submission.split(',').map((s: any) => s.trim());
            localScore = JSON.stringify(subArr) === JSON.stringify(taskData.correct) ? 100 : 0;
        }

        if (localScore > 0 || config.taskType === 'mcq' || config.taskType === 'rank-order') {
            const passed = localScore >= (config.passingScore || 60);
            return {
                score: localScore,
                passed,
                feedback: localScore >= 80 ? "Strategic alignment verified." : "Logic mismatch detected in central hub.",
                strengths: localScore >= 80 ? ["Precision"] : [],
                fixes: localScore < 100 ? ["Re-read the mission brief"] : [],
                redoSuggestions: [],
                nextBestAction: passed ? "Advance" : "Retry",
                criteriaScores: config.criteria.map((c: any) => ({ name: c.name, score: localScore, feedback: "Offline validation." })),
                improvement: "Ensure selected parameters match the intended strategic outcome.",
                managerMood: localScore >= 80 ? 'happy' : 'angry',
                managerMessage: localScore >= 80 ? "Correct. Carry on." : "Incorrect. Are you paying attention?",
                kpiImpact: { leads: localScore >= 80 ? 20 : 0 }
            };
        }
    }
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
        taskData?: any;
    }
): Promise<EvaluationResultData> => {
    return evaluateSubmission(elements, { ...config, taskType: 'creative-canvas' as any });
};
