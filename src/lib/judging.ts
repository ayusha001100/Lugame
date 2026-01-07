import { Player, GameLevel } from '@/types/game';

export interface JudgingProfile {
  strictness: number; // 0..1 (higher = stricter)
  passAdjust: number; // added to rubric passingScore
  scoreBoost: number; // added to computed score before clamp
  label: 'gentle' | 'standard' | 'strict';
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

/**
 * Judging should be light early, stricter later:
 * - ramps with level.id
 * - ramps with in-game day (world remembers)
 * - slight ramp with completed level count
 */
export function getJudgingProfile(player: Player, level: GameLevel): JudgingProfile {
  const dayFactor = clamp(((player.worldState?.currentDay ?? 1) - 1) / 10, 0, 1); // Day 1..11 -> 0..1
  const levelFactor = clamp((level.id - 1) / 15, 0, 1); // Level 1..16 -> 0..1
  const progressFactor = clamp((player.completedLevels?.length ?? 0) / 20, 0, 1);

  // strictness: start gentle (0.25) and ramp to ~0.9
  const strictness = clamp(0.25 + 0.45 * levelFactor + 0.25 * dayFactor + 0.15 * progressFactor, 0.25, 0.9);

  // passAdjust: early -10 points, late +5 points
  const passAdjust = Math.round(-10 + ((strictness - 0.25) / 0.65) * 15);

  // scoreBoost: early +8 points, late +0 points
  const scoreBoost = Math.round(clamp(8 - ((strictness - 0.25) / 0.65) * 8, 0, 8));

  const label: JudgingProfile['label'] =
    strictness < 0.5 ? 'gentle' : strictness < 0.75 ? 'standard' : 'strict';

  return { strictness, passAdjust, scoreBoost, label };
}


