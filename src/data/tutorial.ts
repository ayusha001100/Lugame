export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  highlight?: 'hub' | 'room' | 'level' | 'portfolio' | 'achievements';
  tip?: string;
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to MarketCraft!',
    description: 'You\'re about to become a marketing intern at NovaTech, a cutting-edge tech company. Complete real marketing tasks and build your portfolio!',
    icon: '👋',
    tip: 'Every task you complete is saved to your portfolio.',
  },
  {
    id: 'office',
    title: 'The Office Hub',
    description: 'This is your central workspace. From here, you can access different departments like Marketing, Content, Ads, and Analytics.',
    icon: '🏢',
    highlight: 'hub',
    tip: 'Each department has unique challenges suited to different skills.',
  },
  {
    id: 'levels',
    title: 'Sequential Learning',
    description: 'Complete levels in order to unlock new challenges. Each level builds on skills from the previous one, ensuring you learn progressively.',
    icon: '📈',
    highlight: 'level',
    tip: 'You must complete Level 1 before unlocking Level 2, and so on.',
  },
  {
    id: 'tasks',
    title: 'Complete Real Tasks',
    description: 'Each level presents a real marketing task. Write ad copy, create content calendars, analyze data, and more. Your work is evaluated by AI mentors.',
    icon: '✍️',
    tip: 'Read the task prompt carefully and use the hints if you get stuck!',
  },
  {
    id: 'evaluation',
    title: 'AI-Powered Feedback',
    description: 'Submit your work and receive instant, detailed feedback on multiple criteria. Learn from the suggestions to improve your marketing skills.',
    icon: '🤖',
    tip: 'Scoring 70% or higher means you pass the level!',
  },
  {
    id: 'portfolio',
    title: 'Build Your Portfolio',
    description: 'Every completed task is saved to your professional portfolio. Use it to showcase your skills to potential employers!',
    icon: '📁',
    highlight: 'portfolio',
    tip: 'Higher scores mean more impressive portfolio pieces.',
  },
  {
    id: 'achievements',
    title: 'Earn Achievements',
    description: 'Unlock badges by reaching milestones. Complete your first level, score 100%, finish all levels, and more. Each achievement gives bonus XP!',
    icon: '🏆',
    highlight: 'achievements',
    tip: 'Check the Achievements screen to see what you can unlock.',
  },
  {
    id: 'dailies',
    title: 'Daily Challenges',
    description: 'New challenges appear every day! Complete them for bonus XP and maintain your login streak for extra rewards.',
    icon: '🔥',
    tip: 'Login every day to build your streak and maximize rewards!',
  },
  {
    id: 'ready',
    title: 'You\'re Ready!',
    description: 'Head to the office and start your marketing career. Remember: every expert was once a beginner. Good luck, intern!',
    icon: '🚀',
    tip: 'Start with Level 1 in any department to begin your journey.',
  },
];
