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

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";

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
        rubric?: any;
    }
): Promise<EvaluationResultData> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const attempt = config.attempt || 1;
    const phaseId = config.phaseId;
    const levelId = config.levelId;
    const taskData = config.taskData || {};

    // DETERMINISTIC EVALUATION FOR OBJECTIVE TASKS (NEW MODULE 6.1)
    const isObjective = ['mcq', 'fill-blanks', 'swipe', 'markup', 'rank-order', 'match-following', 'ab-test'].includes(config.taskType);
    const evaluationMode = taskData.evaluationMode || (isObjective ? 'exact_match' : 'ai_semantic');

    if (isObjective && taskData) {
        let isCorrect = false;
        let objectiveScore = 0;

        try {
            switch (config.taskType) {
                case 'mcq':
                case 'ab-test':
                    isCorrect = submission === taskData.correct;
                    objectiveScore = isCorrect ? 100 : 0;
                    break;
                case 'fill-blanks':
                    const submissionArray = Array.isArray(submission) ? submission : (typeof submission === 'string' ? submission.split(',').map((s: string) => s.trim()) : []);
                    const correctArray = taskData.correct || [];
                    isCorrect = JSON.stringify(submissionArray) === JSON.stringify(correctArray);
                    objectiveScore = isCorrect ? 100 : 0;
                    break;
                case 'match-following':
                    const userPairs = submission as Array<{ left: string, right: string }>;
                    const correctPairs = taskData.pairs as Array<{ left: string, right: string }>;
                    if (!userPairs || !correctPairs) break;
                    let matches = 0;
                    userPairs.forEach(up => {
                        const match = correctPairs.find(cp => cp.left === up.left && cp.right === up.right);
                        if (match) matches++;
                    });
                    objectiveScore = Math.round((matches / correctPairs.length) * 100);
                    isCorrect = objectiveScore >= (config.passingScore || 70);
                    break;
                case 'swipe':
                    const swipeItems = taskData.items || [];
                    let swipeMatches = 0;
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
                    let foundCount = 0;
                    markupTargets.forEach((target: string) => {
                        if (submissionText.includes(target)) foundCount++;
                    });
                    objectiveScore = Math.round((foundCount / markupTargets.length) * 100);
                    isCorrect = objectiveScore >= (config.passingScore || 60);
                    break;
                case 'rank-order':
                    isCorrect = JSON.stringify(submission) === JSON.stringify(taskData.items);
                    objectiveScore = isCorrect ? 100 : 0;
                    break;
            }

            if (isCorrect || objectiveScore > 0) {
                // Get dialogue from rubric if available
                const rubric = (config as any).rubric || (taskData.rubric);
                let managerMessage = objectiveScore >= 80 ? "Your strategic logic is perfectly aligned with the mission brief." : "You've identified most of the key elements, but some strategic gaps remain.";

                if (rubric?.feedbackDialogues) {
                    if (objectiveScore >= 85) managerMessage = rubric.feedbackDialogues.high;
                    else if (objectiveScore >= 70) managerMessage = rubric.feedbackDialogues.medium;
                    else managerMessage = rubric.feedbackDialogues.low;
                }

                return {
                    score: objectiveScore,
                    passed: objectiveScore >= (config.passingScore || 60),
                    feedback: objectiveScore >= 80 ? "Strategic logic verified." : "Gaps detected in alignment.",
                    strengths: objectiveScore >= 80 ? ["Precision", "Accuracy"] : ["Basic Logic"],
                    fixes: objectiveScore < 100 ? ["Analyze target variables more closely"] : [],
                    redoSuggestions: objectiveScore < 100 ? ["Review mission briefing"] : [],
                    nextBestAction: objectiveScore >= 60 ? "Advance" : "Retry",
                    criteriaScores: config.criteria.map(c => ({ name: c.name, score: objectiveScore, feedback: "Strategic Validation." })),
                    improvement: objectiveScore < 100 ? "Look for deeper triggers." : "Perfect work.",
                    managerMood: objectiveScore >= 80 ? 'happy' : (objectiveScore >= 60 ? 'neutral' : 'angry'),
                    managerMessage,
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
            ? "NOVICE - Be lenient and encouraging."
            : levelId <= 7
                ? "PROFESSIONAL - Be strict and fair."
                : "ELITE - Be extremely tough and critical.";

        const prompt = `
        You are an Elite Senior Marketing Director at a top-tier growth agency globally. Your standards are exceptionally high. Evaluate this Intern's submission with surgical precision. 
        
        CONTEXT:
        - MISSION PROTOCOL: ${config.levelTitle || "N/A"}
        - STRATEGIC OBJECTIVE: ${config.levelPrompt || "N/A"}
        - TASK INTERACTION TYPE: ${config.taskType}
        - MISSION CRITICAL DATA: ${JSON.stringify(taskData)}
        
        PLAYER'S SUBMISSION:
        "${typeof submission === 'string' ? submission : JSON.stringify(submission)}"
        
        ELITE EVALUATION RUBRIC:
        ${config.criteria.map(c => `- ${c.name}: ${c.description} (Weight: ${c.weight}%)`).join('\n')}
        MINIMUM VIABLE PERFORMANCE: ${config.passingScore}%
        
        MARKING RIGOR (THE 'BEST OF THE BEST' POLICY):
        1. STRATEGIC SOPHISTICATION: Does the answer show deep thinking, or is it surface-level? 
        2. QUALITY FLOOR: Generic, one-word, or overly brief answers MUST be penalized. They should NEVER exceed 40%, even if technically correct.
        3. TACTICAL LOGIC: Does the response logically connect the variables to a high-ROAS outcome?
        4. RIGOR SCALE: ${difficultyContext}
        5. ELITE MARKING: 90%+ is reserved for responses that could be presented to a real Fortune 500 board.
        
        FEEDBACK PROTOCOL:
        - Be professional, sharp, and critique like a mentor.
        - Call out missed variables from 'Mission Critical Data' by name.
        - Reward use of industry-standard frameworks (AIDA, Hook-Story-Offer, etc.).
        
        RETURN OUTPUT RIGIDLY IN THIS JSON FORMAT:
        {
            "score": number (0-100), 
            "passed": boolean, 
            "feedback": "A high-level summary of strategy vs outcome",
            "strengths": ["list of 2-3 specific tactical wins"], 
            "fixes": ["list of 2-3 critical strategic gaps"], 
            "redoSuggestions": ["how to specifically level-up the logic"],
            "nextBestAction": "The immediate next strategic move in the funnel", 
            "managerMood": "happy" | "neutral" | "disappointed" | "angry",
            "managerMessage": "Direct quote from the Director (${config.levelTitle ? 'Sarah Chen' : 'Director'})", 
            "suggestedKeywords": ["3-5 industry terms relevant here"],
            "criteriaScores": [ { "name": "string", "score": number, "feedback": "string" } ],
            "improvement": "One sentence on the psychological/analytical shift needed"
        }
        `;

        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json", temperature: 0.7 }
            })
        });

        if (!response.ok) throw new Error("API failed");

        const data = await response.json();
        const result = JSON.parse(data.candidates[0].content.parts[0].text);

        // Override manager message if rubric dialogues exist
        const rubric = (config as any).rubric || taskData.rubric;
        if (rubric?.feedbackDialogues) {
            if (result.score >= 85) result.managerMessage = rubric.feedbackDialogues.high;
            else if (result.score >= 70) result.managerMessage = rubric.feedbackDialogues.medium;
            else result.managerMessage = rubric.feedbackDialogues.low;
        }

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
