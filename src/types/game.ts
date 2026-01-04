import { UnlockedAchievement } from './achievements';
import { PlayerDailyData, StreakData } from './dailyChallenges';

export interface Player {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'neutral';
  avatarStyle: number;
  xp: number;
  level: number;
  completedLevels: number[];
  portfolio: PortfolioItem[];
  createdAt: Date;
  // Lives system
  lives: number;
  maxLives: number;
  lastLifeLostAt: Date | null;
  // Premium status
  isPremium: boolean;
  premiumExpiresAt: Date | null;
  // Achievements
  achievements: UnlockedAchievement[];
  // Tutorial
  hasSeenTutorial: boolean;
  // Daily & Streak
  dailyData: PlayerDailyData | null;
  streakData: StreakData;
}

export interface PortfolioItem {
  levelId: number;
  title: string;
  content: string;
  score: number;
  feedback: string;
  completedAt: Date;
}

export interface GameLevel {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  room: 'marketing' | 'content' | 'ads' | 'analytics' | 'manager' | 'creative';
  npcName: string;
  npcRole: string;
  npcDialogue: string[];
  taskType: 'text' | 'multiText' | 'selection' | 'builder' | 'canvas';
  difficulty?: 'easy' | 'medium' | 'hard';
  taskPrompt: string;
  taskHints: string[];
  rubric: EvaluationRubric;
  xpReward: number;
  isPremium: boolean;
  artifactType: string;
}

export interface EvaluationRubric {
  criteria: RubricCriteria[];
  passingScore: number;
  maxAttempts: number;
}

export interface RubricCriteria {
  name: string;
  description: string;
  weight: number;
  examples: {
    good: string;
    bad: string;
  };
}

export interface TaskSubmission {
  levelId: number;
  content: string | string[];
  attempt: number;
}

export interface EvaluationResult {
  score: number;
  passed: boolean;
  feedback: string;
  criteriaScores: {
    name: string;
    score: number;
    feedback: string;
  }[];
  improvement: string;
  canRetry: boolean;
  attemptsLeft: number;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  icon: string;
  levels: number[];
  unlocked: boolean;
  image?: string;
}

export type GameScreen = 
  | 'splash'
  | 'character-creation'
  | 'office-hub'
  | 'room'
  | 'level'
  | 'evaluation'
  | 'portfolio'
  | 'settings'
  | 'premium'
  | 'no-lives'
  | 'leaderboard'
  | 'achievements';

export interface AudioState {
  isMusicPlaying: boolean;
  isSfxEnabled: boolean;
  volume: number;
}
