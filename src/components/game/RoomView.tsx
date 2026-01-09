import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { OFFICE_ROOMS, GAME_LEVELS } from '@/data/levels';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Lock,
  CheckCircle2,
  Star,
  ChevronRight,
  Zap,
  Target,
  Trophy,
  Activity,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const RoomView: React.FC = () => {
  const { player, currentRoomId, setScreen, setCurrentLevel, isLevelUnlocked } = useGameStore();

  if (!player || !currentRoomId) return null;

  const room = OFFICE_ROOMS.find(r => r.id === currentRoomId);
  if (!room) return null;

  const roomLevels = GAME_LEVELS.filter(l => room.levels.includes(l.id));

  // Special handling for Executive Suite (manager room)
  if (room.id === 'manager') {
    return (
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 pb-20">
        {/* Background System */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.08)_0%,transparent_50%)] pointer-events-none" />

        {/* Header */}
        <header className="p-4 md:p-8 lg:px-12 flex items-center justify-between border-b border-border bg-background/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="flex items-center gap-4 md:gap-6">
            <Button
              variant="glass"
              size="icon"
              onClick={() => setScreen('office-hub')}
              className="rounded-2xl shrink-0 h-10 w-10 md:h-12 md:w-12"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex flex-col min-w-0">
              <h2 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-primary truncate">Executive Level</h2>
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-xl md:text-3xl">{room.icon}</span>
                <h1 className="text-lg md:text-2xl font-black italic tracking-tight uppercase truncate">{room.name}</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-8 md:p-12 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-[3rem] p-10 md:p-16 bg-gradient-to-br from-primary/5 to-transparent border-primary/20 relative overflow-hidden text-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.1)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative z-10 space-y-8">
              <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="w-12 h-12 text-primary" />
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tight">
                  Congratulations, {player.name}!
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground font-medium italic leading-relaxed max-w-2xl mx-auto">
                  You've completed all 10 strategic missions and proven your marketing mastery.
                  The executive team is impressed with your performance.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-border">
                <div className="space-y-2">
                  <div className="text-3xl font-black italic text-primary">{player.completedLevels.length}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Missions</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-black italic text-primary">{player.xp}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total XP</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-black italic text-primary">{player.stats.reputation}%</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reputation</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-black italic text-primary">₹{player.stats.performanceKPIs.revenue.toLocaleString()}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Revenue</div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <Button
                  variant="glow"
                  size="xl"
                  className="w-full max-w-md mx-auto rounded-[2rem] h-16 text-lg font-black italic group"
                  onClick={() => setScreen('certification')}
                >
                  CLAIM YOUR CERTIFICATION
                  <Star className="w-6 h-6 ml-4 group-hover:rotate-12 transition-transform" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full max-w-md mx-auto rounded-2xl"
                  onClick={() => setScreen('portfolio')}
                >
                  View Career Portfolio
                </Button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  const handleLevelClick = (levelId: number) => {
    if (!isLevelUnlocked(levelId)) return;
    setCurrentLevel(levelId);
    setScreen('level');
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 pb-20">
      {/* Background System */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(234,179,8,0.03)_0%,transparent_50%)] pointer-events-none" />

      {/* Header */}
      <header className="p-4 md:p-8 lg:px-12 flex items-center justify-between border-b border-border bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4 md:gap-6">
          <Button
            variant="glass"
            size="icon"
            onClick={() => setScreen('office-hub')}
            className="rounded-2xl shrink-0 h-10 w-10 md:h-12 md:w-12"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex flex-col min-w-0">
            <h2 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-primary truncate">Department Protocol</h2>
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-xl md:text-3xl">{room.icon}</span>
              <h1 className="text-lg md:text-2xl font-black italic tracking-tight uppercase truncate">{room.name}</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-muted-foreground hidden sm:block">Resources</span>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex items-center gap-1 md:gap-1.5">
                <Zap className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary" />
                <span className="text-[10px] md:text-xs font-bold">{player.stamina}%</span>
              </div>
              <div className="flex items-center gap-1 md:gap-1.5">
                <Trophy className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-500" />
                <span className="text-[10px] md:text-xs font-bold">{player.completedLevels.length}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-8 md:p-12 space-y-12">

        {/* ROOM DISPATCH BRIEF (MODULE 9) */}
        {roomLevels[0] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-[2.5rem] p-6 md:p-10 bg-gradient-to-br from-muted/30 to-transparent border-border/50 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <Activity className="w-16 h-16" />
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-[1.5rem] md:rounded-[2rem] bg-gradient-gold p-1 shadow-[0_0_30px_rgba(234,179,8,0.2)] shrink-0">
                <div className="w-full h-full rounded-[1.4rem] md:rounded-[1.8rem] bg-background flex items-center justify-center text-3xl md:text-4xl">
                  {room.icon}
                </div>
              </div>
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Department Briefing</h3>
                  <p className="text-base md:text-xl font-medium italic leading-relaxed text-foreground/80">
                    Welcome to the {room.name} Command Center. Our objective: {room.description}.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
                  <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-muted/30 border border-border/50 text-[8px] md:text-[10px] font-black uppercase tracking-wide">
                    Lead: {roomLevels[0].npcName}
                  </div>
                  <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-muted/30 border border-border/50 text-[8px] md:text-[10px] font-black uppercase tracking-wide">
                    Auth: {player.role}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* MISSION TIMELINE (MODULE 3/4) */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground ml-2">Mission Sequence</h3>
          <div className="grid gap-4">
            {roomLevels.map((level, index) => {
              const isCompleted = player.completedLevels.includes(level.id);
              const isUnlocked = isLevelUnlocked(level.id);
              const portfolioItem = player.portfolio.find(p => p.levelId === level.id);

              return (
                <motion.button
                  key={level.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  onClick={() => handleLevelClick(level.id)}
                  className={cn(
                    "w-full glass-card rounded-[2.5rem] p-8 text-left transition-all duration-500 relative overflow-hidden group flex items-center gap-8",
                    isUnlocked ? "bg-card/50 border-border/50 hover:border-primary/50" : "opacity-40 grayscale cursor-not-allowed border-border/30"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl font-black italic transition-all duration-500 shrink-0",
                    isCompleted ? "bg-primary text-primary-foreground" : (isUnlocked ? "bg-muted text-primary border border-primary/20" : "bg-muted/50 text-muted-foreground")
                  )}>
                    {isCompleted ? <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8" /> : `0${index + 1}`}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 overflow-hidden">
                      <h4 className="text-base md:text-lg font-black uppercase italic tracking-tight truncate">{level.title}</h4>
                      {isUnlocked && !isCompleted && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/20 text-[8px] font-black text-primary animate-pulse uppercase shrink-0">Active</span>
                      )}
                    </div>
                    <p className="text-[10px] md:text-sm text-muted-foreground font-medium mb-3 line-clamp-1 italic">{level.subtitle}</p>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1.5 grayscale opacity-60">
                        <Target className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase">{level.xpReward} XP</span>
                      </div>
                      <div className="flex items-center gap-1.5 grayscale opacity-60">
                        <Activity className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase">{level.difficulty}</span>
                      </div>
                      {portfolioItem && (
                        <div className="flex items-center gap-1.5 text-primary">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black uppercase">Result: {portfolioItem.score}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted/50 group-hover:bg-primary/20 transition-all">
                    {isUnlocked ? <ChevronRight className="w-6 h-6 text-primary group-hover:translate-x-1 transition-all" /> : <Lock className="w-5 h-5 opacity-20" />}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* SYSTEM ENCRYPTION INFO */}
        <div className="p-8 border border-border bg-muted/30 rounded-[2.5rem] flex items-center gap-8 opacity-60 italic">
          <div className="w-12 h-12 shrink-0 rounded-2xl bg-muted/50 flex items-center justify-center">
            <Lock className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase italic tracking-widest mb-1">Decryption Sequence Active</h4>
            <p className="text-xs font-medium text-muted-foreground">Complete current objectives to unlock advanced strategic assets. Each mission contributes to your global reputation index.</p>
          </div>
        </div>
      </main>
    </div>
  );
};
