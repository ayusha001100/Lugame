import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player, GameScreen, PortfolioItem, EvaluationResult, AudioState } from '@/types/game';
import { ACHIEVEMENTS, Achievement, UnlockedAchievement } from '@/types/achievements';
import { PlayerDailyData, StreakData, generateDailyChallenges, getStreakBonus } from '@/types/dailyChallenges';
import { GAME_LEVELS, OFFICE_ROOMS } from '@/data/levels';
import { supabase } from '@/integrations/supabase/client';

interface GameState {
  player: Player | null;
  currentScreen: GameScreen;
  currentLevelId: number | null;
  currentRoomId: string | null;
  currentAttempt: number;
  lastEvaluation: EvaluationResult | null;
  audio: AudioState;
  pendingAchievement: Achievement | null;
  showTutorial: boolean;
  showDailyChallenges: boolean;
  
  // Computed daily/streak data accessors
  dailyData: PlayerDailyData | null;
  streakData: StreakData | null;
  
  // Actions
  setPlayer: (player: Player) => void;
  updatePlayer: (updates: Partial<Player>) => void;
  setScreen: (screen: GameScreen) => void;
  setCurrentLevel: (levelId: number | null) => void;
  setCurrentRoom: (roomId: string | null) => void;
  addXP: (amount: number) => void;
  completeLevel: (levelId: number, portfolioItem: PortfolioItem, isFirstTry?: boolean) => void;
  setEvaluation: (result: EvaluationResult | null) => void;
  incrementAttempt: () => void;
  resetAttempt: () => void;
  resetGame: () => void;
  
  // Lives system
  loseLife: () => void;
  regenerateLife: () => void;
  checkLivesRegen: () => void;
  canPlay: () => boolean;
  getTimeUntilNextLife: () => number;
  
  // Premium
  setPremium: (isPremium: boolean, expiresAt?: Date) => void;
  
  // Audio
  setAudio: (updates: Partial<AudioState>) => void;
  toggleMusic: () => void;
  toggleSfx: () => void;

  // Leaderboard
  syncToLeaderboard: () => Promise<void>;

  // Achievements
  checkAchievements: (score?: number, isFirstTry?: boolean) => void;
  clearPendingAchievement: () => void;

  // Level unlocking
  isLevelUnlocked: (levelId: number) => boolean;

  // Tutorial
  setShowTutorial: (show: boolean) => void;
  completeTutorial: () => void;

  // Daily challenges & Streak
  setShowDailyChallenges: (show: boolean) => void;
  checkDailyLogin: () => void;
  claimStreakBonus: () => void;
  updateDailyProgress: (type: 'level' | 'xp' | 'perfectScore' | 'firstTry', value?: number) => void;
  completeDailyChallenge: (challengeId: string) => void;
}

const LIFE_REGEN_TIME = 8 * 60 * 60 * 1000; // 8 hours per life
const MAX_LIVES = 3;

const getTodayString = () => new Date().toISOString().split('T')[0];

const getDefaultStreakData = (): StreakData => ({
  currentStreak: 0,
  longestStreak: 0,
  lastLoginDate: null,
  streakXpClaimed: false,
});

const getDefaultDailyData = (date: string): PlayerDailyData => ({
  date,
  completedChallenges: [],
  xpEarnedToday: 0,
  levelsCompletedToday: [],
  perfectScoresToday: 0,
  firstTriesToday: 0,
});

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      player: null,
      currentScreen: 'splash',
      currentLevelId: null,
      currentRoomId: null,
      currentAttempt: 1,
      lastEvaluation: null,
      pendingAchievement: null,
      showTutorial: false,
      showDailyChallenges: false,
      audio: {
        isMusicPlaying: false,
        isSfxEnabled: true,
        volume: 0.5,
      },

      // Computed accessors
      get dailyData() {
        return get().player?.dailyData || null;
      },
      get streakData() {
        return get().player?.streakData || null;
      },

      setPlayer: (player) => set({ player }),
      
      updatePlayer: (updates) => set((state) => ({
        player: state.player ? { ...state.player, ...updates } : null
      })),
      
      setScreen: (screen) => set({ currentScreen: screen }),
      
      setCurrentLevel: (levelId) => set({ currentLevelId: levelId, currentAttempt: 1, lastEvaluation: null }),
      
      setCurrentRoom: (roomId) => set({ currentRoomId: roomId }),
      
      addXP: (amount) => {
        set((state) => {
          if (!state.player) return state;
          const newXP = state.player.xp + amount;
          const newLevel = Math.floor(newXP / 500) + 1;
          
          // Update daily XP tracking
          const today = getTodayString();
          const dailyData = state.player.dailyData?.date === today
            ? { ...state.player.dailyData, xpEarnedToday: state.player.dailyData.xpEarnedToday + amount }
            : { ...getDefaultDailyData(today), xpEarnedToday: amount };
          
          return {
            player: {
              ...state.player,
              xp: newXP,
              level: newLevel,
              dailyData,
            }
          };
        });
      },
      
      completeLevel: (levelId, portfolioItem, isFirstTry = false) => {
        set((state) => {
          if (!state.player) return state;
          const completedLevels = state.player.completedLevels.includes(levelId)
            ? state.player.completedLevels
            : [...state.player.completedLevels, levelId];
          
          const existingIndex = state.player.portfolio.findIndex(p => p.levelId === levelId);
          const portfolio = existingIndex >= 0
            ? state.player.portfolio.map((p, i) => i === existingIndex ? portfolioItem : p)
            : [...state.player.portfolio, portfolioItem];
          
          // Update daily tracking
          const today = getTodayString();
          let dailyData = state.player.dailyData?.date === today
            ? { ...state.player.dailyData }
            : getDefaultDailyData(today);
          
          if (!dailyData.levelsCompletedToday.includes(levelId)) {
            dailyData.levelsCompletedToday = [...dailyData.levelsCompletedToday, levelId];
          }
          
          if (portfolioItem.score === 100) {
            dailyData.perfectScoresToday++;
          }
          
          if (isFirstTry) {
            dailyData.firstTriesToday++;
          }
          
          return {
            player: {
              ...state.player,
              completedLevels,
              portfolio,
              dailyData,
            }
          };
        });

        // Check achievements after level completion
        setTimeout(() => {
          get().checkAchievements(portfolioItem.score, isFirstTry);
        }, 100);
      },
      
      setEvaluation: (result) => set({ lastEvaluation: result }),
      
      incrementAttempt: () => set((state) => ({ currentAttempt: state.currentAttempt + 1 })),
      
      resetAttempt: () => set({ currentAttempt: 1 }),
      
      resetGame: () => set({
        player: null,
        currentScreen: 'splash',
        currentLevelId: null,
        currentRoomId: null,
        currentAttempt: 1,
        lastEvaluation: null
      }),

      // Lives system
      loseLife: () => set((state) => {
        if (!state.player) return state;
        const newLives = Math.max(0, state.player.lives - 1);
        return {
          player: {
            ...state.player,
            lives: newLives,
            lastLifeLostAt: newLives < state.player.lives ? new Date() : state.player.lastLifeLostAt
          }
        };
      }),

      regenerateLife: () => set((state) => {
        if (!state.player) return state;
        const newLives = Math.min(MAX_LIVES, state.player.lives + 1);
        return {
          player: {
            ...state.player,
            lives: newLives,
            lastLifeLostAt: newLives === MAX_LIVES ? null : state.player.lastLifeLostAt
          }
        };
      }),

      checkLivesRegen: () => {
        const state = get();
        if (!state.player || state.player.lives >= MAX_LIVES || !state.player.lastLifeLostAt) return;
        
        const timeSinceLastLost = Date.now() - new Date(state.player.lastLifeLostAt).getTime();
        const livesToRegen = Math.floor(timeSinceLastLost / LIFE_REGEN_TIME);
        
        if (livesToRegen > 0) {
          const newLives = Math.min(MAX_LIVES, state.player.lives + livesToRegen);
          set({
            player: {
              ...state.player,
              lives: newLives,
              lastLifeLostAt: newLives === MAX_LIVES ? null : new Date()
            }
          });
        }
      },

      canPlay: () => {
        const state = get();
        if (!state.player) return false;
        // All features are now free - always allow play
        return true;
      },

      getTimeUntilNextLife: () => {
        const state = get();
        if (!state.player || state.player.lives >= MAX_LIVES || !state.player.lastLifeLostAt) return 0;
        
        const timeSinceLastLost = Date.now() - new Date(state.player.lastLifeLostAt).getTime();
        const timeInCurrentCycle = timeSinceLastLost % LIFE_REGEN_TIME;
        return LIFE_REGEN_TIME - timeInCurrentCycle;
      },

      // Premium
      setPremium: (isPremium, expiresAt) => set((state) => {
        if (!state.player) return state;
        return {
          player: {
            ...state.player,
            isPremium,
            premiumExpiresAt: expiresAt || null,
            lives: isPremium ? MAX_LIVES : state.player.lives
          }
        };
      }),

      // Audio
      setAudio: (updates) => set((state) => ({
        audio: { ...state.audio, ...updates }
      })),

      toggleMusic: () => set((state) => ({
        audio: { ...state.audio, isMusicPlaying: !state.audio.isMusicPlaying }
      })),

      toggleSfx: () => set((state) => ({
        audio: { ...state.audio, isSfxEnabled: !state.audio.isSfxEnabled }
      })),

      // Leaderboard sync
      syncToLeaderboard: async () => {
        const state = get();
        if (!state.player) return;

        try {
          const highestScore = state.player.portfolio.reduce((max, item) => 
            Math.max(max, item.score), 0
          );

          const { error } = await supabase
            .from('leaderboard')
            .upsert({
              player_id: state.player.id,
              player_name: state.player.name,
              total_xp: state.player.xp,
              levels_completed: state.player.completedLevels.length,
              highest_score: highestScore,
              avatar_gender: state.player.gender,
              avatar_style: state.player.avatarStyle,
            }, {
              onConflict: 'player_id'
            });

          if (error) {
            console.error('Error syncing to leaderboard:', error);
          }
        } catch (error) {
          console.error('Error syncing to leaderboard:', error);
        }
      },

      // Achievements
      checkAchievements: (score?: number, isFirstTry?: boolean) => {
        const state = get();
        if (!state.player) return;

        const unlockedIds = state.player.achievements?.map(a => a.achievementId) || [];
        let newAchievement: Achievement | null = null;
        let xpToAdd = 0;
        const newUnlockedAchievements: UnlockedAchievement[] = [];

        for (const achievement of ACHIEVEMENTS) {
          if (unlockedIds.includes(achievement.id)) continue;

          let unlocked = false;

          switch (achievement.requirement.type) {
            case 'levels_completed':
              unlocked = state.player.completedLevels.length >= achievement.requirement.value;
              break;
            case 'total_xp':
              unlocked = state.player.xp >= achievement.requirement.value;
              break;
            case 'perfect_score':
              unlocked = score !== undefined && score >= achievement.requirement.value;
              break;
            case 'first_try':
              unlocked = isFirstTry === true;
              break;
            case 'all_levels':
              unlocked = state.player.completedLevels.length >= GAME_LEVELS.length;
              break;
            case 'room_completed':
              if (achievement.requirement.roomId) {
                const room = OFFICE_ROOMS.find(r => r.id === achievement.requirement.roomId);
                if (room) {
                  const roomLevelIds = room.levels;
                  const completedInRoom = roomLevelIds.filter(id => 
                    state.player!.completedLevels.includes(id)
                  ).length;
                  unlocked = completedInRoom >= roomLevelIds.length;
                }
              }
              break;
          }

          if (unlocked) {
            newUnlockedAchievements.push({
              achievementId: achievement.id,
              unlockedAt: new Date(),
            });
            xpToAdd += achievement.xpReward;
            if (!newAchievement) {
              newAchievement = achievement;
            }
          }
        }

        if (newUnlockedAchievements.length > 0) {
          set((state) => {
            if (!state.player) return state;
            const existingAchievements = state.player.achievements || [];
            return {
              player: {
                ...state.player,
                achievements: [...existingAchievements, ...newUnlockedAchievements],
                xp: state.player.xp + xpToAdd,
              },
              pendingAchievement: newAchievement,
            };
          });
        }
      },

      clearPendingAchievement: () => set({ pendingAchievement: null }),

      // Level unlocking - sequential progression
      isLevelUnlocked: (levelId: number) => {
        const state = get();
        if (!state.player) return false;
        
        // Level 1 is always unlocked
        if (levelId === 1) return true;
        
        // Check if previous level is completed
        const previousLevelCompleted = state.player.completedLevels.includes(levelId - 1);
        return previousLevelCompleted;
      },

      // Tutorial
      setShowTutorial: (show) => set({ showTutorial: show }),
      
      completeTutorial: () => set((state) => ({
        showTutorial: false,
        player: state.player ? { ...state.player, hasSeenTutorial: true } : null
      })),

      // Daily challenges & Streak
      setShowDailyChallenges: (show) => set({ showDailyChallenges: show }),

      checkDailyLogin: () => {
        const state = get();
        if (!state.player) return;

        const today = getTodayString();
        const streakData = state.player.streakData || getDefaultStreakData();
        const lastLogin = streakData.lastLoginDate;

        let newStreak = streakData.currentStreak;
        let streakBroken = false;

        if (lastLogin) {
          const lastLoginDate = new Date(lastLogin);
          const todayDate = new Date(today);
          const diffDays = Math.floor((todayDate.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24));

          if (diffDays === 0) {
            // Same day, no change
            return;
          } else if (diffDays === 1) {
            // Consecutive day
            newStreak++;
          } else {
            // Streak broken
            newStreak = 1;
            streakBroken = true;
          }
        } else {
          // First login
          newStreak = 1;
        }

        const newStreakData: StreakData = {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, streakData.longestStreak),
          lastLoginDate: today,
          streakXpClaimed: false,
        };

        // Reset daily data for new day
        const dailyData = state.player.dailyData?.date === today
          ? state.player.dailyData
          : getDefaultDailyData(today);

        set({
          player: {
            ...state.player,
            streakData: newStreakData,
            dailyData,
          },
          showDailyChallenges: true, // Show daily challenges popup on login
        });
      },

      claimStreakBonus: () => set((state) => {
        if (!state.player || !state.player.streakData) return state;
        return {
          player: {
            ...state.player,
            streakData: {
              ...state.player.streakData,
              streakXpClaimed: true,
            },
          },
        };
      }),

      updateDailyProgress: (type, value) => set((state) => {
        if (!state.player) return state;
        
        const today = getTodayString();
        let dailyData = state.player.dailyData?.date === today
          ? { ...state.player.dailyData }
          : getDefaultDailyData(today);

        switch (type) {
          case 'level':
            if (value && !dailyData.levelsCompletedToday.includes(value)) {
              dailyData.levelsCompletedToday = [...dailyData.levelsCompletedToday, value];
            }
            break;
          case 'xp':
            dailyData.xpEarnedToday += value || 0;
            break;
          case 'perfectScore':
            dailyData.perfectScoresToday++;
            break;
          case 'firstTry':
            dailyData.firstTriesToday++;
            break;
        }

        return {
          player: {
            ...state.player,
            dailyData,
          },
        };
      }),

      completeDailyChallenge: (challengeId) => set((state) => {
        if (!state.player || !state.player.dailyData) return state;
        
        if (state.player.dailyData.completedChallenges.includes(challengeId)) {
          return state;
        }

        return {
          player: {
            ...state.player,
            dailyData: {
              ...state.player.dailyData,
              completedChallenges: [...state.player.dailyData.completedChallenges, challengeId],
            },
          },
        };
      }),
    }),
    {
      name: 'marketcraft-game-storage'
    }
  )
);
