import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AVATAR_STYLES } from '@/data/levels';
import { Player, PlayerStats, WorldState } from '@/types/game';
import { ArrowLeft, ArrowRight, User, Sparkles, Briefcase, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type Gender = 'male' | 'female' | 'neutral';
type Role = 'intern' | 'specialist' | 'manager';

const genderOptions: { value: Gender; label: string; icon: string }[] = [
  { value: 'male', label: 'He/Him', icon: '👨‍💼' },
  { value: 'female', label: 'She/Her', icon: '👩‍💼' },
  { value: 'neutral', label: 'They/Them', icon: '🧑‍💼' },
];

const roleOptions: { value: Role; label: string; description: string; icon: any }[] = [
  { value: 'intern', label: 'Growth Intern', description: 'Focus on learning and high-volume tasks', icon: Zap },
  { value: 'specialist', label: 'Domain Expert', description: 'Deep dive into SEO, Ads, or Content', icon: Target },
  { value: 'manager', label: 'Strategy Lead', description: 'Focus on KPIs, budget, and trust', icon: Briefcase },
];

export const CharacterCreation: React.FC = () => {
  const { setPlayer, setScreen } = useGameStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('neutral');
  const [avatarStyle, setAvatarStyle] = useState(1);
  const [role, setRole] = useState<Role>('intern');

  const handleComplete = () => {
    const initialStats: PlayerStats = {
      skillTree: { SEO: 0, Ads: 0, Copy: 0, Analytics: 0 },
      reputation: role === 'manager' ? 20 : 10,
      trust: {
        manager: role === 'intern' ? 60 : 40,
        designer: 50,
        founder: 10
      },
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
    };

    const initialWorldState: WorldState = {
      currentDay: 1,
      dayProgress: 0,
      unlockedRooms: ['marketing'],
      narrativeFlags: [],
      npcMoods: { manager: 5, designer: 5, founder: 3 },
      activeCampaigns: []
    };

    const player: Player = {
      id: crypto.randomUUID(),
      name,
      gender,
      avatarStyle,
      xp: 0,
      level: 1,
      completedLevels: [],
      portfolio: [],
      createdAt: new Date(),

      // Module 1 Stats
      role: role === 'manager' ? 'manager' : (role === 'specialist' ? 'specialist' : 'intern'),
      cohort: 'Genesis-01',
      preferences: {
        communicationTone: role === 'manager' ? 'professional' : 'casual',
        preferredDifficulty: role === 'intern' ? 'standard' : 'elite',
        personaChoices: {
          startingMotive: role === 'manager' ? 'efficiency' : 'innovation',
          growthMindset: 'active'
        }
      },

      // Module 7 Economy
      stamina: 100,
      maxStamina: 100,
      tokens: 5,
      lastStaminaRegenAt: null,

      // Module 2 World Engine
      stats: initialStats,
      worldState: initialWorldState,

      // Legacy compatibility
      lives: 3,
      maxLives: 3,
      lastLifeLostAt: null,
      isPremium: false,
      premiumExpiresAt: null,
      achievements: [],
      hasSeenTutorial: false,
      dailyData: null,
      streakData: {
        currentStreak: 0,
        longestStreak: 0,
        lastLoginDate: null,
        streakXpClaimed: false,
      },
    };

    setPlayer(player);
    setScreen('office-hub');
  };

  const canProceed = step === 1 ? name.trim().length >= 2 : true;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.05)_0%,transparent_100%)] pointer-events-none" />

      {/* Back Button */}
      <button
        onClick={() => step > 1 ? setStep(step - 1) : setScreen('splash')}
        className="absolute top-6 left-6 md:top-8 md:left-8 text-muted-foreground hover:text-foreground transition-all flex items-center gap-2 px-3 md:px-4 py-2 rounded-full hover:bg-accent/50 border border-transparent hover:border-border z-50 shrink-0"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs md:text-sm font-bold uppercase tracking-widest hidden sm:inline">Back</span>
      </button>

      {/* Progress Indicator */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8 flex gap-2 md:gap-3 z-50">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={cn(
              'w-6 md:w-12 h-1.5 rounded-full transition-all duration-500',
              s <= step ? 'bg-primary shadow-[0_0_10px_rgba(234,179,8,0.4)]' : 'bg-muted'
            )}
          />
        ))}
      </div>

      {/* Content */}
      <div className="w-full max-w-xl animate-fade-up">
        {step === 1 && (
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 rounded-3xl bg-gradient-gold flex items-center justify-center mx-auto shadow-2xl shadow-primary/20"
            >
              <User className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-black italic tracking-tight uppercase">Identify Yourself</h2>
              <p className="text-muted-foreground text-sm md:text-lg font-bold uppercase tracking-wider">Your identity will be inscribed in the MarketCraft archives</p>
            </div>

            <div className="relative max-w-sm mx-auto">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Agent Name"
                className="text-center text-xl h-16 bg-muted/30 border-border focus:border-primary focus:ring-primary/20 rounded-2xl"
                maxLength={30}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center space-y-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight">NPC Recognition</h2>
              <p className="text-muted-foreground text-lg">How should our engine address your persona?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              {genderOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setGender(option.value)}
                  className={cn(
                    'glass-card rounded-3xl p-6 md:p-8 transition-all duration-500 group relative overflow-hidden',
                    gender === option.value
                      ? 'ring-2 ring-primary bg-primary/10 shadow-lg shadow-primary/10'
                      : 'hover:bg-accent/50 border-border/50'
                  )}
                >
                  <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform">{option.icon}</div>
                  <div className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] opacity-80">{option.label}</div>
                  {gender === option.value && (
                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight">Visual Manifestation</h2>
              <p className="text-muted-foreground text-lg">Select a resonance that fits your ambition</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {AVATAR_STYLES[gender].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setAvatarStyle(style.id)}
                  className={cn(
                    'glass-card rounded-3xl p-6 md:p-8 transition-all duration-500 group relative flex items-center sm:block gap-6',
                    avatarStyle === style.id
                      ? 'ring-2 ring-primary bg-primary/10 shadow-lg shadow-primary/10'
                      : 'hover:bg-accent/50 border-border/50'
                  )}
                >
                  <div
                    className="w-16 h-16 md:w-24 md:h-24 rounded-full sm:mx-auto mb-0 sm:mb-4 flex items-center justify-center text-2xl md:text-4xl shadow-inner group-hover:scale-105 transition-transform shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${style.colors[0]}, ${style.colors[1]})`,
                      boxShadow: avatarStyle === style.id ? `0 0 20px ${style.colors[0]}40` : 'none'
                    }}
                  >
                    {genderOptions.find(g => g.value === gender)?.icon}
                  </div>
                  <div className="text-left sm:text-center">
                    <div className="font-black italic text-lg md:text-xl uppercase tracking-tight">{style.label}</div>
                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-1">Profile {style.id}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center space-y-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight">Choose Your Directive</h2>
              <p className="text-muted-foreground text-lg">Your role defines your starting KPIs and trust levels</p>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
              {roleOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setRole(option.value)}
                    className={cn(
                      'w-full flex items-center gap-6 p-6 rounded-3xl transition-all duration-500 text-left relative overflow-hidden border',
                      role === option.value
                        ? 'bg-primary/10 border-primary ring-1 ring-primary shadow-lg shadow-primary/5'
                        : 'bg-muted/30 border-border hover:border-primary/50 hover:bg-muted/50'
                    )}
                  >
                    <div className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center transition-all',
                      role === option.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    )}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-xl">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </div>
                    {role === option.value && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <ArrowRight className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-12 flex justify-center">
          {step < 4 ? (
            <Button
              variant="premium"
              size="xl"
              onClick={() => setStep(step + 1)}
              disabled={!canProceed}
              className="min-w-[240px] h-16 rounded-2xl text-lg font-bold group"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          ) : (
            <Button
              variant="glow"
              size="xl"
              onClick={handleComplete}
              className="min-w-[280px] h-16 rounded-2xl text-lg font-bold"
            >
              <Sparkles className="w-5 h-5 mr-3" />
              Initialize Engine
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
