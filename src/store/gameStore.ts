import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Player,
  GameScreen,
  PortfolioItem,
  EvaluationResult,
  AudioState,
  MarketingKPIs,
  PlayerStats,
  WorldState
} from '@/types/game';
import { Achievement } from '@/types/achievements';
import { GAME_LEVELS } from '@/data/levels';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { toast } from 'sonner';

interface GameState {
  player: Player | null;
  firebaseUser: User | null;
  currentScreen: GameScreen;
  currentLevelId: number | null;
  currentRoomId: string | null;
  currentAttempt: number;
  activePhaseIndex: number;
  lastEvaluation: EvaluationResult | null;
  audio: AudioState;
  pendingAchievement: Achievement | null;
  gameTime: string; // "09:00 AM" to "10:00 PM"
  isClockedIn: boolean;
  isResting: boolean; // New state for 10 PM - 9 AM
  growthData: { day: number; timestamp: number; revenue: number; leads: number; type?: string; isBaseline?: boolean }[];

  // Identity & Profile (MODULE 1)
  setPlayer: (player: Player) => void;
  updatePlayer: (updates: Partial<Player>) => void;
  setFirebaseUser: (user: User | null) => void;
  fetchPlayerProfile: (uid: string) => Promise<void>;
  savePlayerProfile: () => Promise<void>;
  saveSessionSnapshot: () => void;

  // Navigation
  setScreen: (screen: GameScreen) => void;
  setCurrentLevel: (levelId: number | null) => void;
  setCurrentRoom: (roomId: string | null) => void;
  setActivePhaseIndex: (index: number) => void;
  nextPhase: () => void;

  // Progression & Stats (MODULE 2)
  addXP: (amount: number) => void;
  updateKPIs: (impact: Partial<MarketingKPIs>) => void;
  updateTrust: (npc: 'manager' | 'designer' | 'founder', amount: number) => void;
  advanceDay: () => void;
  clockIn: () => void;
  clockOut: () => void;
  sleep: () => void; // New action
  tick: () => void; // New internal tick action

  // Level Management
  completePhase: (levelId: number, phaseId: string, result: EvaluationResult) => void;
  completeLevel: (levelId: number, portfolioItem: PortfolioItem, isFirstTry?: boolean) => void;
  setEvaluation: (result: EvaluationResult | null) => void;
  incrementAttempt: () => void;
  resetAttempt: () => void;
  loseLife: () => void;

  // Stamina & Monetization (MODULE 7)
  consumeStamina: (amount: number) => boolean;
  checkStaminaRegen: () => void;
  addTokens: (amount: number) => void;
  useToken: (amount: number) => boolean;
  addStipend: (amount: number) => void;

  // Audio & Settings
  setAudio: (updates: Partial<AudioState>) => void;
  toggleMusic: () => void;
  toggleSfx: () => void;

  // Achievement System
  checkAchievements: (score?: number, isFirstTry?: boolean) => void;
  clearPendingAchievement: () => void;

  // Helpers
  isLevelUnlocked: (levelId: number) => boolean;
  canPlay: () => boolean;

  // AI Assistant (MODULE 6)
  useAIToken: (levelId: number) => void;
  getAITokensLeft: (levelId: number) => number;
  addAISuggestion: (suggestion: string) => void;

  resetGame: () => void;
  retryLevel: () => boolean;
  earnRetryToken: () => void;
}

const STAMINA_REGEN_TIME = 15 * 1000; // 15 seconds for energy regen
const LIFE_REGEN_TIME = 120 * 1000; // 2 minutes for 1 life point
const MAX_STAMINA = 100;
const MAX_LIVES = 3;
const LEVEL_STAMINA_COST = 10;
export const ENERGY_COST_PER_TASK = 15;
const STIPEND_PENALTY_EARLY_CLOCK_OUT = 200; // Penalty for clocking out before 6 PM
const ENERGY_REGEN_AMOUNT = 10; // 10% regen every 15s

const formatTime = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const mins = totalMinutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`;
};

const parseTimeToMinutes = (timeStr: string) => {
  const [time, period] = timeStr.split(' ');
  let [hours, mins] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + mins;
};

const getTodayString = () => new Date().toISOString().split('T')[0];

const getDefaultStats = (): PlayerStats => ({
  skillTree: { SEO: 0, Ads: 0, Copy: 0, Analytics: 0 },
  reputation: 10,
  trust: { manager: 50, designer: 50, founder: 20 },
  performanceKPIs: {
    roas: 0,
    cac: 0,
    conversionRate: 0,
    leads: 0,
    budgetSpent: 0,
    revenue: 0,
    stipend: 0
  },
  inventory: [],
  energy: 100
});

const getDefaultWorldState = (): WorldState => ({
  currentDay: 1,
  dayProgress: 0,
  unlockedRooms: ['marketing', 'ads', 'content', 'analytics', 'manager'],
  narrativeFlags: [],
  npcMoods: { manager: 5, designer: 5, founder: 3 },
  activeCampaigns: []
});

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      player: null,
      firebaseUser: null,
      currentScreen: 'splash',
      currentLevelId: null,
      currentRoomId: null,
      currentAttempt: 1,
      activePhaseIndex: 0,
      lastEvaluation: null,
      pendingAchievement: null,
      gameTime: "09:00 AM",
      isClockedIn: false,
      isResting: false,
      growthData: (() => {
        // Generate an organic-looking baseline trajectory for the company before the player started
        const baseline = [];
        const now = Date.now();
        let curRevenue = 2000;
        let curLeads = 50;
        for (let i = -20; i < 0; i++) {
          curRevenue += Math.floor(Math.random() * 200);
          curLeads += Math.floor(Math.random() * 5);
          baseline.push({
            day: -1, // Hidden but mapped
            timestamp: now - (Math.abs(i) * 3600 * 1000), // Hourly steps back
            revenue: curRevenue,
            leads: curLeads,
            isBaseline: true
          });
        }
        return baseline;
      })(),
      audio: {
        isMusicPlaying: false,
        isSfxEnabled: true,
        volume: 0.5,
      },

      setPlayer: (player) => {
        set({ player });
        get().savePlayerProfile();
      },

      updatePlayer: (updates) => {
        set((state) => ({
          player: state.player ? { ...state.player, ...updates } : null
        }));
        get().savePlayerProfile();
      },

      saveSessionSnapshot: () => {
        const { player, currentScreen, currentRoomId, currentLevelId, activePhaseIndex } = get();
        if (!player) return;

        get().updatePlayer({
          worldState: {
            ...player.worldState,
            lastActiveScreen: currentScreen,
            lastActiveRoomId: currentRoomId,
            lastActiveLevelId: currentLevelId,
            lastActivePhaseIndex: activePhaseIndex
          }
        });
      },

      setFirebaseUser: (user) => set({ firebaseUser: user }),

      fetchPlayerProfile: async (uid) => {
        try {
          const docRef = doc(db, 'players', uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const playerData = docSnap.data() as Player;
            set({ player: playerData });

            // Restore Session Snapshot
            if (playerData.worldState?.lastActiveScreen) {
              set({
                currentScreen: playerData.worldState.lastActiveScreen as any,
                currentRoomId: playerData.worldState.lastActiveRoomId || null,
                currentLevelId: playerData.worldState.lastActiveLevelId || null,
                activePhaseIndex: playerData.worldState.lastActivePhaseIndex || 0
              });
              toast.info("Resuming your last session...");
            }
          }
        } catch (error) {
          console.error('Error fetching player profile:', error);
        }
      },

      savePlayerProfile: async () => {
        const { player, firebaseUser } = get();
        if (!player || !firebaseUser) return;
        try {
          const docRef = doc(db, 'players', firebaseUser.uid);
          await setDoc(docRef, player);
        } catch (error) {
          console.error('Error saving player profile:', error);
        }
      },

      addXP: (amount) => {
        const p = get().player;
        if (!p) return;
        const newXP = p.xp + amount;
        const newLevel = Math.floor(newXP / 1000) + 1;
        get().updatePlayer({ xp: newXP, level: newLevel });
      },

      updateKPIs: (impact) => {
        const p = get().player;
        if (!p) return;
        const current = p.stats.performanceKPIs;
        get().updatePlayer({
          stats: {
            ...p.stats,
            performanceKPIs: {
              roas: Math.max(0, current.roas + (impact.roas || 0)),
              cac: Math.max(0, Math.round(current.cac + (impact.cac || 0))),
              conversionRate: Math.min(100, Math.max(0, current.conversionRate + (impact.conversionRate || 0))),
              leads: Math.max(0, Math.round(current.leads + (impact.leads || 0))),
              budgetSpent: current.budgetSpent + (impact.budgetSpent || 0),
              revenue: Math.max(0, Math.round(current.revenue + (impact.revenue || 0))),
              stipend: Math.max(0, current.stipend + (impact.stipend || 0))
            }
          }
        });
      },

      updateTrust: (npc, amount) => {
        const p = get().player;
        if (!p) return;
        get().updatePlayer({
          stats: {
            ...p.stats,
            trust: { ...p.stats.trust, [npc]: Math.min(100, Math.max(0, p.stats.trust[npc] + amount)) }
          }
        });
      },

      advanceDay: () => {
        const p = get().player;
        if (!p) return;
        const nextDay = p.worldState.currentDay + 1;
        const dailyTokens = p.isPremium ? 5 : 2;
        get().updatePlayer({
          stamina: MAX_STAMINA,
          tokens: p.tokens + dailyTokens,
          stats: {
            ...p.stats,
            energy: 100
          },
          lives: MAX_LIVES,
          worldState: { ...p.worldState, currentDay: nextDay, dayProgress: 0 }
        });
        set({ gameTime: "09:00 AM", isClockedIn: false, isResting: false });
      },

      clockIn: () => set({ isClockedIn: true, isResting: false }),
      clockOut: () => {
        const state = get();
        const currentMins = parseTimeToMinutes(state.gameTime);
        const sixPMMinutes = 18 * 60;

        if (state.isClockedIn && currentMins < sixPMMinutes) {
          get().updateKPIs({ stipend: -STIPEND_PENALTY_EARLY_CLOCK_OUT });
          toast.error(`Early Departure Penalty: -₹${STIPEND_PENALTY_EARLY_CLOCK_OUT} deducted from stipend.`);
        }

        set({ isClockedIn: false });
        toast.success("Clocked out for the day!");
      },

      sleep: () => {
        get().advanceDay();
        toast.success("Good morning! Ready for a new day?");
      },

      tick: () => {
        const state = get();
        const p = state.player;
        if (!p) return;

        // Game Time progression
        const currentMins = parseTimeToMinutes(state.gameTime);
        const nextMins = currentMins + 1;
        const newTimeStr = formatTime(nextMins);
        const isResting = nextMins >= 22 * 60 || nextMins < 9 * 60; // 10 PM to 9 AM

        set({ gameTime: newTimeStr, isResting });

        // Auto clock out at 10 PM
        if (nextMins === 22 * 60 && state.isClockedIn) {
          state.clockOut();
          toast.info("It's 10 PM! Time to head home.");
        }

        // Passive Growth Simulation (Marketing Pulse)
        if (state.isClockedIn && !state.isResting) {
          const rep = p.stats.reputation || 10;
          if (Math.random() > 0.98) {
            const passiveLeads = Math.random() < (rep / 100) ? 1 : 0;
            const passiveRevenue = passiveLeads > 0 ? Math.floor(Math.random() * 50) : 0;
            if (passiveLeads > 0 || passiveRevenue > 0) {
              get().updateKPIs({ leads: passiveLeads, revenue: passiveRevenue });
              const updatedKPIs = get().player?.stats.performanceKPIs;
              if (updatedKPIs) {
                set({
                  growthData: [...state.growthData, {
                    day: p.worldState.currentDay,
                    timestamp: Date.now(),
                    revenue: updatedKPIs.revenue,
                    leads: updatedKPIs.leads,
                    type: 'passive'
                  }].slice(-100)
                });
              }
            }
          }
        }

        // Consolidated Regeneration Logic - MANDATORY EVERY TICK
        state.checkStaminaRegen();

        // Screen Lock Check: Redirect if energy <= 10 or lives <= 0, and not already on lock screens
        const isCritical = (p.stats.energy <= 10 || p.lives <= 0) && !p.isPremium;
        const protectedScreens = ['splash', 'auth', 'character-creation', 'no-lives', 'premium', 'portfolio'];

        if (isCritical && !protectedScreens.includes(state.currentScreen)) {
          set({ currentScreen: 'no-lives' });
        }
      },

      addStipend: (amount) => {
        const p = get().player;
        if (!p) return;
        get().updateKPIs({ stipend: amount });
      },

      completePhase: (levelId, phaseId, result) => {
        const p = get().player;
        if (!p) return;
        const level = GAME_LEVELS.find(l => l.id === levelId);
        const phase = level?.phases?.find(ph => ph.id === phaseId);

        if (result.passed) {
          // Calculate all changes based on the most current state values
          const currentP = get().player;
          if (!currentP) return;

          const updatedKPIs = {
            ...currentP.stats.performanceKPIs,
            ...(result.kpiImpact || {})
          };

          const stipendBonus = phase?.stipendReward || 0;
          if (stipendBonus > 0) updatedKPIs.stipend += stipendBonus;

          const newGrowthData = [...get().growthData, {
            day: currentP.worldState.currentDay,
            timestamp: Date.now(),
            revenue: updatedKPIs.revenue,
            leads: updatedKPIs.leads,
            type: 'phase'
          }].slice(-100);

          const currentCompleted = currentP.completedPhases?.[levelId] || [];
          const updatedPhases = !currentCompleted.includes(phaseId) ? {
            ...(currentP.completedPhases || {}),
            [levelId]: [...currentCompleted, phaseId]
          } : currentP.completedPhases;

          set({
            growthData: newGrowthData,
            player: {
              ...currentP,
              tokens: currentP.tokens + 1,
              completedPhases: updatedPhases,
              stats: {
                ...currentP.stats,
                performanceKPIs: updatedKPIs,
                energy: Math.max(0, currentP.stats.energy - ENERGY_COST_PER_TASK),
                reputation: Math.min(100, currentP.stats.reputation + 1)
              },
              lastStaminaRegenAt: new Date()
            }
          });

          toast.success("Mission Intel synced. +1 Credit earned.");
        } else {
          // Handle Failure
          get().loseLife();
        }
      },

      consumeStamina: (amount) => {
        const p = get().player;
        if (!p || p.stamina < amount) return false;
        get().updatePlayer({ stamina: p.stamina - amount, lastStaminaRegenAt: new Date() });
        return true;
      },

      checkStaminaRegen: () => {
        const p = get().player;
        if (!p) return;
        const now = new Date().getTime();
        let updates: Partial<Player> = {};

        // Energy Regen (10% every 15s)
        if (p.stats.energy < MAX_STAMINA) {
          if (!p.lastStaminaRegenAt) {
            updates.lastStaminaRegenAt = new Date();
          } else {
            const last = new Date(p.lastStaminaRegenAt).getTime();
            const cycles = Math.floor((now - last) / STAMINA_REGEN_TIME);
            if (cycles > 0) {
              const newEnergy = Math.min(MAX_STAMINA, p.stats.energy + (cycles * ENERGY_REGEN_AMOUNT));
              updates = {
                ...updates,
                stamina: newEnergy,
                stats: { ...p.stats, energy: newEnergy },
                lastStaminaRegenAt: newEnergy >= MAX_STAMINA ? null : new Date()
              };
            }
          }
        }

        // Life Regen (1 life every 2 min)
        if (p.lives < MAX_LIVES) {
          if (!p.lastLifeLostAt) {
            updates.lastLifeLostAt = new Date();
          } else {
            const lastLife = new Date(p.lastLifeLostAt).getTime();
            const lifeCycles = Math.floor((now - lastLife) / LIFE_REGEN_TIME);
            if (lifeCycles > 0) {
              const newLives = Math.min(MAX_LIVES, p.lives + lifeCycles);
              updates = {
                ...updates,
                lives: newLives,
                lastLifeLostAt: newLives >= MAX_LIVES ? null : new Date()
              };
            }
          }
        }

        if (Object.keys(updates).length > 0) {
          get().updatePlayer(updates);
        }
      },

      addTokens: (amount) => {
        const p = get().player;
        if (!p) return;
        get().updatePlayer({ tokens: p.tokens + amount });
      },

      useToken: (amount) => {
        const p = get().player;
        if (!p || p.tokens < amount) return false;
        get().updatePlayer({ tokens: p.tokens - amount });
        return true;
      },

      completeLevel: (levelId, portfolioItem, isFirstTry = false) => {
        const currentP = get().player;
        if (!currentP) return;
        const level = GAME_LEVELS.find(l => l.id === levelId);
        if (!level) return;

        const impact = portfolioItem.feedback.kpiImpact || level.simulationImpact || {};
        const weightedScore = portfolioItem.score / 100;
        const stipendEarned = weightedScore * (level.stipendReward || 0);

        const updatedKPIs = {
          ...currentP.stats.performanceKPIs,
          roas: Math.max(0, currentP.stats.performanceKPIs.roas + (impact.roas || 0)),
          cac: Math.max(0, currentP.stats.performanceKPIs.cac + (impact.cac || 0)),
          conversionRate: Math.min(100, Math.max(0, currentP.stats.performanceKPIs.conversionRate + (impact.conversionRate || 0))),
          leads: Math.max(0, currentP.stats.performanceKPIs.leads + (impact.leads || 0)),
          revenue: Math.max(0, currentP.stats.performanceKPIs.revenue + (impact.revenue || 0)),
          stipend: currentP.stats.performanceKPIs.stipend + stipendEarned
        };

        const newGrowthData = [...get().growthData, {
          day: currentP.worldState.currentDay,
          timestamp: Date.now(),
          revenue: updatedKPIs.revenue,
          leads: updatedKPIs.leads,
          type: 'level_complete'
        }].slice(-100);

        const bonusCredits = portfolioItem.score >= 80 ? 2 : 1;
        const passed = portfolioItem.score >= (level.rubric.passingScore || 60);

        set({
          growthData: newGrowthData,
          player: {
            ...currentP,
            completedLevels: passed ? (currentP.completedLevels.includes(levelId) ? currentP.completedLevels : [...currentP.completedLevels, levelId]) : currentP.completedLevels,
            portfolio: [...currentP.portfolio, portfolioItem],
            tokens: currentP.tokens + bonusCredits,
            lives: !passed ? Math.max(0, currentP.lives - 1) : currentP.lives,
            lastLifeLostAt: !passed ? new Date() : currentP.lastLifeLostAt,
            stats: {
              ...currentP.stats,
              performanceKPIs: updatedKPIs,
              energy: passed ? Math.max(0, currentP.stats.energy - ENERGY_COST_PER_TASK) : currentP.stats.energy,
              reputation: Math.min(100, currentP.stats.reputation + (portfolioItem.score >= 80 ? 5 : 2))
            },
            lastStaminaRegenAt: new Date()
          }
        });

        if (passed) {
          get().addXP(isFirstTry ? 500 : 200);
          get().checkAchievements(portfolioItem.score, isFirstTry);
        }
      },

      setScreen: (screen) => {
        set({ currentScreen: screen });
        get().saveSessionSnapshot();
      },
      setCurrentLevel: (levelId) => {
        const p = get().player;
        let startIndex = 0;

        if (p && levelId !== null) {
          const level = GAME_LEVELS.find(l => l.id === levelId);
          if (level?.phases) {
            const completed = p.completedPhases?.[levelId] || [];
            // Resume from the first incomplete phase
            const firstIncomplete = level.phases.findIndex(ph => !completed.includes(ph.id));
            if (firstIncomplete !== -1) {
              startIndex = firstIncomplete;
            } else {
              startIndex = level.phases.length - 1; // Show last phase/completed state
            }
          }
        }

        set({
          currentLevelId: levelId,
          currentAttempt: 1,
          activePhaseIndex: startIndex,
          lastEvaluation: null
        });
        get().saveSessionSnapshot();
      },
      setCurrentRoom: (roomId) => {
        set({ currentRoomId: roomId });
        get().saveSessionSnapshot();
      },
      setActivePhaseIndex: (index) => {
        set({ activePhaseIndex: index });
        get().saveSessionSnapshot();
      },
      nextPhase: () => {
        set((state) => ({ activePhaseIndex: state.activePhaseIndex + 1, lastEvaluation: null }));
        get().saveSessionSnapshot();
      },
      setEvaluation: (result) => set({ lastEvaluation: result }),
      incrementAttempt: () => set((state) => ({ currentAttempt: state.currentAttempt + 1 })),
      resetAttempt: () => set({ currentAttempt: 1 }),
      setAudio: (updates) => set((state) => ({ audio: { ...state.audio, ...updates } })),
      toggleMusic: () => set((state) => ({ audio: { ...state.audio, isMusicPlaying: !state.audio.isMusicPlaying } })),
      toggleSfx: () => set((state) => ({ audio: { ...state.audio, isSfxEnabled: !state.audio.isSfxEnabled } })),
      clearPendingAchievement: () => set({ pendingAchievement: null }),
      checkAchievements: () => { },
      isLevelUnlocked: (levelId) => {
        const p = get().player;
        if (!p) return false;
        if (levelId === 1) return true;
        // Level is unlocked if the previous one is completed
        return p.completedLevels.includes(levelId - 1);
      },
      retryLevel: () => {
        const { player: p, useToken, consumeStamina, resetAttempt, setScreen } = get();
        if (!p) return false;
        if (p.tokens >= 1) {
          useToken(1);
          resetAttempt();
          setScreen('level');
          return true;
        } else if (p.stamina >= 20) {
          consumeStamina(20);
          resetAttempt();
          setScreen('level');
          return true;
        }
        setScreen('no-lives');
        return false;
      },
      earnRetryToken: () => {
        get().addTokens(1);
        get().addXP(50);
        toast.success("Lesson Complete! +1 Retry Token Earned.");
      },
      canPlay: () => {
        const { player: p, currentRoomId, isLevelUnlocked } = get();
        if (!p) return false;

        // Energy Lock: If energy is 10% or lower
        if (p.stats.energy <= 10 && !p.isPremium) {
          toast.error("Energy depleted below critical levels (10%). Wait for recharge.");
          return false;
        }

        // Lives Lock: If lives are 0
        if (p.lives <= 0 && !p.isPremium) {
          toast.error("All lives lost. Cooling down for 2 minutes.");
          return false;
        }

        if (!currentRoomId) return true;

        // Find if any level in the current room is unlocked
        const levelsInRoom = GAME_LEVELS.filter(l => l.room === currentRoomId);
        return levelsInRoom.some(l => isLevelUnlocked(l.id));
      },
      useAIToken: (levelId) => {
        const p = get().player;
        if (!p) return;
        const currentFlags = p.worldState.narrativeFlags || [];
        const usedCount = currentFlags.filter(f => f.startsWith(`ai_token_${levelId}_`)).length;
        if (usedCount >= 4) return;
        get().updatePlayer({ worldState: { ...p.worldState, narrativeFlags: [...currentFlags, `ai_token_${levelId}_${usedCount + 1}`] } });
      },
      loseLife: () => {
        const p = get().player;
        if (!p) return;
        get().updatePlayer({
          lives: Math.max(0, p.lives - 1),
          lastLifeLostAt: new Date()
        });
      },
      getAITokensLeft: (levelId) => {
        const p = get().player;
        if (!p) return 0;
        const currentFlags = p.worldState.narrativeFlags || [];
        const usedCount = currentFlags.filter(f => f.startsWith(`ai_token_${levelId}_`)).length;
        return Math.max(0, 4 - usedCount);
      },
      addAISuggestion: () => { },
      resetGame: () => set({ player: null, currentScreen: 'splash', currentLevelId: null, currentRoomId: null })
    }),
    { name: 'marketcraft-v4-nuclear' }
  )
);
