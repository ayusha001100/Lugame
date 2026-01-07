import { UnlockedAchievement } from './achievements';
import { PlayerDailyData, StreakData } from './dailyChallenges';

/**
 * MODULE 1: Identity & Player Profile
 */
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

  // Role & Preferences
  role: 'intern' | 'specialist' | 'manager' | 'lead';
  cohort: string;
  preferences: PlayerPreferences;

  // Energy & Economy (MODULE 7)
  stamina: number;
  maxStamina: number;
  tokens: number; // Hint/Retry currency
  lastStaminaRegenAt: Date | null;

  // Global State (MODULE 2)
  stats: PlayerStats;
  worldState: WorldState;

  // Lives system (Legacy - combined with stamina)
  lives: number;
  maxLives: number;
  lastLifeLostAt: Date | null;

  // Premium status (MODULE 7)
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

export interface PlayerPreferences {
  communicationTone: 'professional' | 'casual' | 'bold';
  preferredDifficulty: 'standard' | 'elite';
  personaChoices: Record<string, string>;
}

export interface PlayerStats {
  skillTree: Record<string, number>; // SEO, Ads, Copy, Analytics levels
  reputation: number;
  trust: Record<'manager' | 'designer' | 'founder', number>;
  performanceKPIs: MarketingKPIs;
  inventory: string[]; // Items/Tokens collected (Module 2)
  energy: number; // For actions (Module 7)
}

export interface MarketingKPIs {
  roas: number;
  cac: number;
  conversionRate: number;
  leads: number;
  budgetSpent: number;
  revenue: number; // Added for Simulation (Module 8)
  stipend: number; // Added based on UI mockup
}

export interface WorldState {
  currentDay: number; // Day 0 to Day 20 (MODULE 2)
  dayProgress: number; // 0 to 100% of current day
  unlockedRooms: string[];
  narrativeFlags: string[];
  npcMoods: Record<string, number>;
  activeCampaigns: string[]; // For simulation (Module 8)
}

/**
 * MODULE 5: Submission & Artifact System
 */
export interface PortfolioItem {
  levelId: number;
  title: string;
  category: 'SEO' | 'Ads' | 'Copy' | 'Analytics' | 'Strategy' | 'Creative' | 'Design';
  content: any; // Dynamic based on task type
  artifactUrl?: string; // For downloadable view
  score: number;
  feedback: EvaluationResult; // Store full eval for portfolio
  isPublished: boolean;
  completedAt: Date;
}

/**
 * MODULE 3 & 4: Quest & Task Engine
 */
export type TaskType =
  | 'mcq'
  | 'multi-select'
  | 'drag-drop'
  | 'rank-order'
  | 'highlight'
  | 'fill-blanks'
  | 'short-answer'
  | 'creative-canvas'
  | 'timed-challenge'
  | 'sim-mini-game'
  | 'swipe'
  | 'markup';

export interface GameLevel {
  id: number;
  questId?: string;
  title: string;
  subtitle: string;
  description: string;
  room: 'marketing' | 'content' | 'ads' | 'analytics' | 'manager' | 'creative';
  npcName: string;
  npcRole: string;
  npcDialogue: DialogueNode[]; // MODULE 9

  // Multi-Phase Quest (New Structure)
  phases?: LevelPhase[];
  
  // Task Logic (Legacy - for simple levels)
  taskType?: TaskType;
  taskData?: any; 
  taskPrompt?: string;
  taskHints?: string[];

  // Requirements & Rewards
  difficulty: 'easy' | 'medium' | 'hard';
  competencies: string[]; 
  rubric: EvaluationRubric; 
  xpReward: number;
  stipendReward?: number; // Total stipend for this level
  tokenReward?: number;
  isPremium: boolean;

  // Simulation Inputs (MODULE 8)
  simulationImpact?: Partial<MarketingKPIs>;
}

export interface LevelPhase {
  id: string;
  type: 'diagnose' | 'build' | 'improve';
  title: string;
  description: string;
  taskType: TaskType;
  taskData: any;
  taskPrompt: string;
  taskHints?: string[];
  stipendReward?: number; // Stipend for this specific phase
}

export interface DialogueNode {
  id: string;
  text: string;
  options?: DialogueOption[];
  emotion?: 'neutral' | 'happy' | 'angry' | 'surprised';
}

export interface DialogueOption {
  text: string;
  nextId: string;
  impact?: {
    trust?: number;
    reputation?: number;
    flag?: string;
  };
}

export interface EvaluationRubric {
  criteria: RubricCriteria[];
  passingScore: number;
  maxAttempts: number;
  aiGradingPrompt?: string; // MODULE 6
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
  content: any;
  attempt: number;
  duration?: number; // For timed challenges
}

/**
 * MODULE 6: AI Evaluation
 */
export interface PhaseEvaluation {
  id: string;
  score: number;
  passed: boolean;
  feedback: string;
  managerMood: 'happy' | 'angry' | 'neutral' | 'disappointed';
  managerMessage: string;
}

export interface EvaluationResult {
  score: number;
  passed: boolean;
  feedback: string;
  strengths: string[];
  fixes: string[];
  redoSuggestions: string[];
  nextBestAction: string;
  kpiImpact?: Partial<MarketingKPIs>;
  criteriaScores: {
    name: string;
    score: number;
    feedback: string;
  }[];
  canRetry: boolean;
  attemptsLeft: number;
  isPremiumReview?: boolean;
  managerMood?: 'happy' | 'angry' | 'neutral' | 'surprised' | 'disappointed';
  managerMessage?: string;
  suggestedKeywords?: string[];
  phaseEvaluations?: Record<string, PhaseEvaluation>;
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
  | 'auth'
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
  | 'achievements'
  | 'simulation'
  | 'skill-tree'
  | 'certification';

export interface AudioState {
  isMusicPlaying: boolean;
  isSfxEnabled: boolean;
  volume: number;
}
