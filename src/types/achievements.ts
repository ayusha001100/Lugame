export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'progress' | 'mastery' | 'special' | 'streak';
  requirement: {
    type: 'levels_completed' | 'total_xp' | 'perfect_score' | 'room_completed' | 'first_try' | 'all_levels';
    value: number;
    roomId?: string;
  };
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const ACHIEVEMENTS: Achievement[] = [
  // Progress achievements
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Complete your first level',
    icon: '🎯',
    category: 'progress',
    requirement: { type: 'levels_completed', value: 1 },
    xpReward: 50,
    rarity: 'common',
  },
  {
    id: 'getting_started',
    title: 'Getting Started',
    description: 'Complete 3 levels',
    icon: '🚀',
    category: 'progress',
    requirement: { type: 'levels_completed', value: 3 },
    xpReward: 100,
    rarity: 'common',
  },
  {
    id: 'halfway_hero',
    title: 'Halfway Hero',
    description: 'Complete 5 levels',
    icon: '⭐',
    category: 'progress',
    requirement: { type: 'levels_completed', value: 5 },
    xpReward: 200,
    rarity: 'rare',
  },
  {
    id: 'marketing_master',
    title: 'Marketing Master',
    description: 'Complete all 10 levels',
    icon: '👑',
    category: 'progress',
    requirement: { type: 'all_levels', value: 10 },
    xpReward: 1000,
    rarity: 'legendary',
  },
  
  // Mastery achievements
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Score 100% on any level',
    icon: '💯',
    category: 'mastery',
    requirement: { type: 'perfect_score', value: 100 },
    xpReward: 150,
    rarity: 'rare',
  },
  {
    id: 'first_try',
    title: 'Natural Talent',
    description: 'Pass a level on your first attempt',
    icon: '🎪',
    category: 'mastery',
    requirement: { type: 'first_try', value: 1 },
    xpReward: 75,
    rarity: 'common',
  },
  
  // XP achievements
  {
    id: 'xp_collector',
    title: 'XP Collector',
    description: 'Earn 500 total XP',
    icon: '⚡',
    category: 'progress',
    requirement: { type: 'total_xp', value: 500 },
    xpReward: 100,
    rarity: 'common',
  },
  {
    id: 'xp_hunter',
    title: 'XP Hunter',
    description: 'Earn 1000 total XP',
    icon: '🔥',
    category: 'progress',
    requirement: { type: 'total_xp', value: 1000 },
    xpReward: 200,
    rarity: 'rare',
  },
  {
    id: 'xp_legend',
    title: 'XP Legend',
    description: 'Earn 2500 total XP',
    icon: '🌟',
    category: 'progress',
    requirement: { type: 'total_xp', value: 2500 },
    xpReward: 500,
    rarity: 'epic',
  },
  
  // Room completion achievements
  {
    id: 'content_creator',
    title: 'Content Creator',
    description: 'Complete all Content Strategy levels',
    icon: '✍️',
    category: 'special',
    requirement: { type: 'room_completed', value: 1, roomId: 'content' },
    xpReward: 300,
    rarity: 'epic',
  },
  {
    id: 'ad_wizard',
    title: 'Ad Wizard',
    description: 'Complete all Paid Media levels',
    icon: '📢',
    category: 'special',
    requirement: { type: 'room_completed', value: 1, roomId: 'ads' },
    xpReward: 300,
    rarity: 'epic',
  },
  {
    id: 'data_driven',
    title: 'Data Driven',
    description: 'Complete all Analytics levels',
    icon: '📊',
    category: 'special',
    requirement: { type: 'room_completed', value: 1, roomId: 'analytics' },
    xpReward: 300,
    rarity: 'epic',
  },
];

export interface UnlockedAchievement {
  achievementId: string;
  unlockedAt: Date;
}
