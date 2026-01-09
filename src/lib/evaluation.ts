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

const POLLINATIONS_URL = "https://text.pollinations.ai/";

/**
 * MODULE 6: AI Evaluation & Feedback Orchestrator
 * Uses Pollinations AI (Free) as the primary evaluation engine.
 */
export const evaluateSubmission = async (
    submission: any,
    config: {
        criteria: any[];
        passingScore: number;
        taskType: TaskType;
        levelId: number;
        rubricPrompt?: string;
        levelTitle?: string;
        levelPrompt?: string;
        attempt?: number;
        phaseId?: string;
        taskData?: any;
        rubric?: any;
    }
): Promise<EvaluationResultData> => {
    const taskData = config.taskData || {};

    // DETERMINISTIC EVALUATION FOR OBJECTIVE TASKS
    const isObjective = ['mcq', 'fill-blanks', 'swipe', 'markup', 'rank-order', 'match-following', 'ab-test'].includes(config.taskType);
    const evaluationMode = taskData.evaluationMode || (isObjective ? 'exact_match' : 'ai_semantic');

    if (isObjective && taskData && !evaluationMode.includes('ai_')) {
        try {
            let isCorrect = false;
            let objectiveScore = 0;

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
                    const userOrder = submission as string[];
                    const correctOrder = taskData.correctOrder || taskData.items || [];
                    
                    if (JSON.stringify(userOrder) === JSON.stringify(correctOrder)) {
                        objectiveScore = 100;
                        isCorrect = true;
                    } else {
                        // Partial credit for rank-order
                        let matches = 0;
                        userOrder.forEach((item, index) => {
                            if (item === correctOrder[index]) matches++;
                        });
                        objectiveScore = Math.round((matches / correctOrder.length) * 100);
                        isCorrect = objectiveScore >= (config.passingScore || 70);
                    }
                    break;
            }

            if (isCorrect || objectiveScore > 0) {
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

    // AI EVALUATION PROMPT CONSTRUCTION
    const isRankOrder = config.taskType === 'rank-order';
    const submissionText = isRankOrder 
        ? `Ranked Order: ${Array.isArray(submission) ? submission.map((s, i) => `${i + 1}. ${s}`).join(', ') : submission}`
        : (typeof submission === 'string' ? submission : JSON.stringify(submission));

    const difficultyContext = config.levelId <= 3 ? "NOVICE - Be lenient." : config.levelId < 9 ? "PROFESSIONAL - Be strict but fair." : "ELITE - Be critical.";
    Rubric: ${config.criteria.map(c => `${c.name} (Wt: ${c.weight}%)`).join(', ')}
    
    Output strictly valid JSON:
    {
        "score": number (0-100),
        "passed": boolean,
        "feedback": "string",
        "strengths": ["string"],
        "fixes": ["string"],
        "managerMessage": "string",
        "managerMood": "happy" | "neutral" | "angry",
        "criteriaScores": [{"name": "string", "score": number, "feedback": "string"}]
    }
    `;

    // STRATEGY 1: POLLINATIONS (Primary - Free & Robust)
    try {
        console.log("Engaging Pollinations AI Auto-Grader...");
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout for responsiveness

        const response = await fetch(`${POLLINATIONS_URL}${encodeURIComponent(prompt + " \nIMPORTANT: Respond ONLY with the raw JSON. Do not use markdown blocks.")}?model=openai&seed=${Math.floor(Math.random() * 1000)}`, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            const text = await response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? jsonMatch[0] : text;
            const result = JSON.parse(jsonStr);

            if (typeof result.score === 'number') {
                return {
                    ...result,
                    passed: result.score >= (config.passingScore || 60),
                    feedback: result.feedback || "Evaluation complete.",
                    strengths: result.strengths || [],
                    fixes: result.fixes || [],
                    redoSuggestions: [],
                    nextBestAction: result.score >= 60 ? "Advance" : "Retry",
                    criteriaScores: result.criteriaScores || [],
                    improvement: "Focus on strategic depth.",
                    managerMood: result.managerMood || 'neutral',
                    managerMessage: result.managerMessage || "Review your data.",
                    kpiImpact: {
                        conversionRate: (result.score / 100) * 1.5,
                        leads: Math.floor((result.score / 100) * 120),
                        roas: (result.score / 100) * 0.8,
                        revenue: Math.floor((result.score / 100) * 6000)
                    }
                };
            }
        }
    } catch (e) {
        console.warn("Pollinations failed, attempting Gemini fallback...");
    }

    // STRATEGY 2: TRY GEMINI (Secondary Fallback)
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey && apiKey.length > 10) {
        const MODELS = ["gemini-1.5-flash", "gemini-pro"];
        for (const model of MODELS) {
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { responseMimeType: "application/json", temperature: 0.7, maxOutputTokens: 1000 }
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const result = JSON.parse(data.candidates[0].content.parts[0].text);
                    return {
                        ...result,
                        kpiImpact: {
                            conversionRate: (result.score / 100) * 2,
                            leads: Math.floor((result.score / 100) * 100),
                            roas: (result.score / 100) * 0.5,
                            revenue: Math.floor((result.score / 100) * 5000)
                        }
                    };
                }
            } catch (e) {
                console.warn(`Gemini Model ${model} failed...`, e);
            }
        }
    }

    return fallbackEvaluation(submission, config, taskData);
};

const fallbackEvaluation = async (submission: any, config: any, taskData: any): Promise<EvaluationResultData> => {
    const wordCount = typeof submission === 'string' ? submission.trim().split(/\s+/).length : 0;
    const isObjective = ['mcq', 'fill-blanks', 'swipe', 'markup', 'rank-order'].includes(config.taskType);

    // If it's an objective task but deterministic check failed/was skipped, check again here
    const evaluationMode = taskData?.evaluationMode || (isObjective ? 'exact_match' : 'ai_semantic');

    if (isObjective && taskData && !evaluationMode.includes('ai_')) {
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
