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
      <header className="p-8 md:px-12 flex items-center justify-between border-b border-border bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Button
            variant="glass"
            size="icon"
            onClick={() => setScreen('office-hub')}
            className="rounded-2xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex flex-col">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Department Protocol</h2>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{room.icon}</span>
              <h1 className="text-2xl font-black italic tracking-tight uppercase">{room.name}</h1>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Resources</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold">{player.stamina}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-bold">{player.completedLevels.length}</span>
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
            className="glass-card rounded-[2.5rem] p-10 bg-gradient-to-br from-muted/30 to-transparent border-border/50 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <Activity className="w-16 h-16" />
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-gold p-1 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                <div className="w-full h-full rounded-[1.8rem] bg-background flex items-center justify-center text-4xl">
                  {room.icon}
                </div>
              </div>
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2">Department Briefing</h3>
                  <p className="text-xl font-medium italic leading-relaxed text-foreground/80">
                    Welcome to the {room.name} Command Center. Our objective: {room.description}.
                    Follow the mission sequence below for optimal system calibration.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="px-4 py-2 rounded-xl bg-muted/30 border border-border/50 text-[10px] font-black uppercase tracking-wide">
                    Lead: {roomLevels[0].npcName}
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-muted/30 border border-border/50 text-[10px] font-black uppercase tracking-wide">
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
                    "w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black italic transition-all duration-500",
                    isCompleted ? "bg-primary text-primary-foreground" : (isUnlocked ? "bg-muted text-primary border border-primary/20" : "bg-muted/50 text-muted-foreground")
                  )}>
                    {isCompleted ? <CheckCircle2 className="w-8 h-8" /> : `0${index + 1}`}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-lg font-black uppercase italic tracking-tight">{level.title}</h4>
                      {isUnlocked && !isCompleted && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/20 text-[8px] font-black text-primary animate-pulse uppercase">Active</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground font-medium mb-3 line-clamp-1 italic">{level.subtitle}</p>

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
