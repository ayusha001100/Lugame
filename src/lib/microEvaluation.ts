import { GameLevel, QuestPhase } from '@/types/game';

export interface MicroReview {
  score: number; // 0-100
  passed: boolean;
  managerTitle: string;
  managerReview: string;
  mistakes: string[];
  tips: string[];
  keywordsToPass: string[];
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export function evaluateMicroPhase(level: GameLevel, phase: QuestPhase, submission: any): MicroReview {
  const managerTitle = `Manager Review — ${level.npcName}`;
  const passingScore = phase.rubric?.passingScore ?? level.rubric?.passingScore ?? 70;

  // Default response
  let score = 80;
  const mistakes: string[] = [];
  const tips: string[] = [];
  const keywordsToPass: string[] = [];

  if (phase.taskType === 'highlight') {
    const all = (phase.taskData?.highlights || []) as Array<{ id: string; label: string; correct?: boolean }>;
    const correct = all.filter(h => h.correct);
    const selectedIds: string[] = submission?.selected || [];
    const selected = all.filter(h => selectedIds.includes(h.id));
    const correctSelected = selected.filter(h => h.correct).length;
    const falsePos = selected.filter(h => !h.correct).length;
    const totalCorrect = Math.max(1, correct.length);

    // Reward catching generic phrases, punish flagging strong proof lines
    score = clamp(Math.round((correctSelected / totalCorrect) * 100 - falsePos * 20), 0, 100);

    if (falsePos > 0) mistakes.push("You flagged strong proof phrases—don’t remove specificity.");
    if (correctSelected < correct.length) mistakes.push("You missed some generic phrases. Those kill conversion.");

    tips.push("Generic words: 'revolutionary', 'next-gen', 'synergy'—they say nothing.");
    tips.push("Strong copy = Persona + Pain + Outcome + Proof.");
    keywordsToPass.push("persona", "pain", "outcome", "proof");
  }

  if (phase.taskType === 'mcq' || phase.taskType === 'multi-select') {
    const correct = phase.taskData?.correct;
    const selected = submission;
    const isMulti = phase.taskType === 'multi-select';

    if (isMulti) {
      const correctArr = Array.isArray(correct) ? correct : [correct].filter(Boolean);
      const selectedArr = Array.isArray(selected) ? selected : [selected].filter(Boolean);
      const correctSet = new Set(correctArr);
      const selectedSet = new Set(selectedArr);
      const hit = [...selectedSet].filter(x => correctSet.has(x)).length;
      const miss = [...correctSet].filter(x => !selectedSet.has(x)).length;
      const extra = [...selectedSet].filter(x => !correctSet.has(x)).length;
      score = clamp(Math.round((hit / Math.max(1, correctArr.length)) * 100 - extra * 15), 0, 100);
      if (miss) mistakes.push("You missed at least one critical option.");
      if (extra) mistakes.push("You selected extra options that weaken your logic.");
    } else {
      const isCorrect = typeof selected === 'string' && selected === correct;
      score = isCorrect ? 100 : 0;
      if (!isCorrect) mistakes.push("Wrong choice for this situation.");
    }

    tips.push("Pick the answer that changes the funnel outcome, not the prettiest wording.");
    keywordsToPass.push("intent", "funnel stage", "conversion");
  }

  if (phase.taskType === 'fill-blanks') {
    const expected: string[] | undefined = phase.taskData?.expected;
    let chosen: string[] = [];

    // Accept both old and new submission formats
    if (typeof submission === 'string') {
      chosen = submission.split(',').map(s => s.trim()).filter(Boolean);
    } else if (submission?.filled) {
      const filled = submission.filled as Record<string, string>;
      chosen = Object.keys(filled).sort((a, b) => Number(a) - Number(b)).map(k => filled[k]);
    }

    if (expected && expected.length) {
      const hit = expected.filter((v, i) => chosen[i] === v).length;
      score = clamp(Math.round((hit / Math.max(1, expected.length)) * 100), 0, 100);
      if (hit < expected.length) mistakes.push("Some chips don’t match the strongest persona→pain→outcome→proof structure.");
      tips.push("Keep it tight: Persona → Pain → Outcome → Proof. No fluff.");
      keywordsToPass.push(...expected.slice(0, 3));
    } else {
      // If no expected answer provided, just enforce completion
      score = chosen.length > 0 ? 85 : 0;
      if (!chosen.length) mistakes.push("You didn’t complete the template.");
      tips.push("Use proof chips (free trial, time saved) to increase credibility.");
      keywordsToPass.push("free trial", "time saved", "proof");
    }
  }

  if (phase.taskType === 'rank-order') {
    const correctOrder: string[] | undefined = phase.taskData?.correctOrder;
    const chosen: string[] = Array.isArray(submission) ? submission : [];
    if (correctOrder && correctOrder.length) {
      const hit = correctOrder.filter((v, i) => chosen[i] === v).length;
      score = clamp(Math.round((hit / Math.max(1, correctOrder.length)) * 100), 0, 100);
      if (hit < correctOrder.length) mistakes.push("Your prioritization order is off—ROI usually follows intent.");
      tips.push("For B2B: Search (high intent) + Retargeting usually beat awareness-heavy channels early.");
      keywordsToPass.push("high intent", "retargeting", "ROI");
    } else {
      score = 85;
      tips.push("Prioritize by intent and measurability (ROAS/CAC), not vibes.");
      keywordsToPass.push("ROAS", "CAC", "budget allocation");
    }
  }

  if (phase.taskType === 'short-answer') {
    const text = typeof submission === 'string' ? submission.toLowerCase() : '';
    const hasPersona = /(founder|manager|team|agency|intern|business|b2b|saas)/.test(text);
    const hasPain = /(waste|manual|busy|slow|admin|overwhelm|time)/.test(text);
    const hasOutcome = /(save|increase|reduce|grow|hours|minutes|%|x)/.test(text);
    const hasProof = /(free trial|14-day|case study|in 60|seconds|proof)/.test(text);
    const points = [hasPersona, hasPain, hasOutcome, hasProof].filter(Boolean).length;
    score = clamp(55 + points * 12, 0, 100);

    if (!hasPersona) mistakes.push("No clear audience/persona.");
    if (!hasOutcome) mistakes.push("No measurable outcome (time, % or x).");
    if (!hasProof) mistakes.push("No proof element (trial, speed, credibility).");
    tips.push("Write like a marketer: promise + proof + action CTA.");
    keywordsToPass.push("persona", "outcome", "free trial", "in 60 seconds");
  }

  const passed = score >= passingScore;
  const managerReview = passed
    ? `Good. This phase is clean. Keep momentum—don’t add fluff, add proof.`
    : `Not yet. You’re close, but you’re missing the conversion drivers. Fix the mistakes below and you’ll pass.`;

  return {
    score,
    passed,
    managerTitle,
    managerReview,
    mistakes,
    tips,
    keywordsToPass,
  };
}


