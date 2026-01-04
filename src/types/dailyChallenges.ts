export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: {
    type: 'complete_level' | 'earn_xp' | 'perfect_score' | 'complete_room' | 'first_try';
    value: number;
    levelId?: number;
    roomId?: string;
  };
  xpReward: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PlayerDailyData {
  date: string; // YYYY-MM-DD format
  completedChallenges: string[];
  xpEarnedToday: number;
  levelsCompletedToday: number[];
  perfectScoresToday: number;
  firstTriesToday: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLoginDate: string | null;
  streakXpClaimed: boolean;
}

// Challenge templates that get randomized daily
const CHALLENGE_TEMPLATES: Omit<DailyChallenge, 'id'>[] = [
  {
    title: 'Quick Learner',
    description: 'Complete any level today',
    icon: '📚',
    requirement: { type: 'complete_level', value: 1 },
    xpReward: 50,
    difficulty: 'easy',
  },
  {
    title: 'XP Hunter',
    description: 'Earn 200 XP today',
    icon: '⚡',
    requirement: { type: 'earn_xp', value: 200 },
    xpReward: 75,
    difficulty: 'easy',
  },
  {
    title: 'Perfectionist',
    description: 'Score 100% on any level',
    icon: '💯',
    requirement: { type: 'perfect_score', value: 100 },
    xpReward: 150,
    difficulty: 'hard',
  },
  {
    title: 'Natural Talent',
    description: 'Pass a level on your first try',
    icon: '🎯',
    requirement: { type: 'first_try', value: 1 },
    xpReward: 100,
    difficulty: 'medium',
  },
  {
    title: 'Double Down',
    description: 'Complete 2 levels today',
    icon: '✌️',
    requirement: { type: 'complete_level', value: 2 },
    xpReward: 100,
    difficulty: 'medium',
  },
  {
    title: 'XP Grinder',
    description: 'Earn 500 XP today',
    icon: '🔥',
    requirement: { type: 'earn_xp', value: 500 },
    xpReward: 150,
    difficulty: 'hard',
  },
];

// Generate daily challenges based on date seed
export const generateDailyChallenges = (date: Date): DailyChallenge[] => {
  const dateString = date.toISOString().split('T')[0];
  const seed = dateString.split('-').reduce((acc, part) => acc + parseInt(part), 0);
  
  // Shuffle templates based on seed
  const shuffled = [...CHALLENGE_TEMPLATES].sort((a, b) => {
    const hashA = (seed * 31 + a.title.length) % 100;
    const hashB = (seed * 31 + b.title.length) % 100;
    return hashA - hashB;
  });

  // Pick 3 challenges (1 easy, 1 medium, 1 hard)
  const easy = shuffled.find(c => c.difficulty === 'easy')!;
  const medium = shuffled.find(c => c.difficulty === 'medium')!;
  const hard = shuffled.find(c => c.difficulty === 'hard')!;

  return [easy, medium, hard].map((challenge, index) => ({
    ...challenge,
    id: `${dateString}-${index}`,
  }));
};

// Streak bonus XP based on streak length
export const getStreakBonus = (streak: number): number => {
  if (streak >= 30) return 200;
  if (streak >= 14) return 100;
  if (streak >= 7) return 50;
  if (streak >= 3) return 25;
  return 0;
};

export const getStreakMessage = (streak: number): string => {
  if (streak >= 30) return '🔥 Legendary! 30+ day streak!';
  if (streak >= 14) return '💪 Amazing! 2 week streak!';
  if (streak >= 7) return '⭐ Impressive! 1 week streak!';
  if (streak >= 3) return '👍 Nice! 3 day streak!';
  if (streak >= 1) return '✨ Keep it going!';
  return 'Start your streak today!';
};
