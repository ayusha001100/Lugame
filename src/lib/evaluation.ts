export interface EvaluationResult {
    overallScore: number;
    passed: boolean;
    feedback: string;
    criteriaScores: Array<{
        name: string;
        score: number;
        feedback: string;
    }>;
    improvement: string;
}

export const evaluateSubmission = async (
    submission: string,
    rubric: {
        criteria: Array<{
            name: string;
            description: string;
            weight: number;
        }>;
        passingScore: number;
    }
): Promise<EvaluationResult> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const wordCount = submission.trim().split(/\s+/).length;
    const charCount = submission.length;

    // Simple heuristic for scoring
    let baseScore = 65;
    if (wordCount > 50) baseScore += 10;
    if (wordCount > 100) baseScore += 10;
    if (charCount > 500) baseScore += 5;

    // Add some randomness
    baseScore += Math.floor(Math.random() * 10);
    baseScore = Math.min(100, baseScore);

    const passed = baseScore >= rubric.passingScore;

    const criteriaScores = rubric.criteria.map(c => {
        const score = Math.min(100, baseScore + Math.floor(Math.random() * 10) - 5);
        return {
            name: c.name,
            score,
            feedback: score > 70
                ? `Great job on the ${c.name.toLowerCase()} aspect. You've demonstrated a solid understanding.`
                : `The ${c.name.toLowerCase()} could be more detailed. Try to incorporate more specific examples.`
        };
    });

    return {
        overallScore: baseScore,
        passed,
        feedback: passed
            ? "Excellent work! Your submission meets all the key requirements and shows a professional level of marketing insight."
            : "Your submission is a good start, but it needs more depth and specific strategic thinking to meet our standards.",
        criteriaScores,
        improvement: "Consider using more data-driven arguments and specifically addressing the target audience's pain points."
    };
};

export const evaluateCreativeSubmission = async (
    elements: any[],
    rubric: {
        criteria: Array<{
            name: string;
            description: string;
            weight: number;
        }>;
        passingScore: number;
    }
): Promise<EvaluationResult> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    let baseScore = 70;
    if (elements.length > 5) baseScore += 10;
    if (elements.length > 10) baseScore += 10;

    baseScore += Math.floor(Math.random() * 10);
    baseScore = Math.min(100, baseScore);

    const passed = baseScore >= rubric.passingScore;

    const criteriaScores = rubric.criteria.map(c => {
        const score = Math.min(100, baseScore + Math.floor(Math.random() * 10) - 5);
        return {
            name: c.name,
            score,
            feedback: score > 70
                ? `The visual hierarchy for ${c.name.toLowerCase()} is well-executed.`
                : `The ${c.name.toLowerCase()} could be improved with better alignment and contrast.`
        };
    });

    return {
        overallScore: baseScore,
        passed,
        feedback: passed
            ? "The creative design is visually appealing and effectively communicates the brand message."
            : "The layout feels a bit cluttered. Focus on simplifying the composition.",
        criteriaScores,
        improvement: "Try to create more white space to let the key call-to-action stand out more effectively."
    };
};
