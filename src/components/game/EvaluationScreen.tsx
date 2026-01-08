import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { GAME_LEVELS } from '@/data/levels';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Trophy,
  Star,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Sparkles,
  Zap,
  ChevronRight,
  ShieldAlert,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudio } from '@/hooks/useAudio';
import { CelebrationEffects, XPBurstEffect } from './CelebrationEffects';
import { motion, AnimatePresence } from 'framer-motion';

export const EvaluationScreen: React.FC = () => {
  const {
    player,
    currentLevelId,
    lastEvaluation,
    setScreen,
    setCurrentLevel,
    resetAttempt,
    retryLevel,
    currentAttempt,
    nextPhase,
    activePhaseIndex
  } = useGameStore();

  const { playSfx } = useAudio();
  const level = GAME_LEVELS.find(l => l.id === currentLevelId);

  const [showCelebration, setShowCelebration] = useState(false);
  const [showXPBurst, setShowXPBurst] = useState(false);

  useEffect(() => {
    if (lastEvaluation?.passed) {
      setShowCelebration(true);
      setTimeout(() => setShowXPBurst(true), 800);
    }
  }, [lastEvaluation?.passed]);

  if (!lastEvaluation || !level || !player) return null;

  const handleRetry = () => {
    playSfx('click');
    retryLevel();
  };

  const handleContinue = () => {
    playSfx('click');
    resetAttempt();
    setCurrentLevel(null);
    setScreen('room');
  };

  const handleNextAction = () => {
    playSfx('transition');

    // Check if we are in a multi-phase level and need to go to the next phase
    if (lastEvaluation?.passed && level.phases && activePhaseIndex < level.phases.length - 1) {
      nextPhase();
      setScreen('level');
      return;
    }

    const nextLevel = GAME_LEVELS.find(l => l.id > level.id);
    if (nextLevel) {
      resetAttempt();
      setCurrentLevel(nextLevel.id);
      setScreen('level');
    } else {
      handleContinue();
    }
  };

  const getManagerMoodIcon = (mood?: string) => {
    switch (mood) {
      case 'happy': return '😎';
      case 'angry': return '🤬';
      case 'disappointed': return '😤';
      case 'surprised': return '😲';
      default: return '🤨';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 py-8 md:py-12 px-4 md:px-12 flex items-center justify-center overflow-x-hidden">
      {/* Celebration Effects */}
      <CelebrationEffects isActive={showCelebration} intensity="high" />

      <div className="w-full max-w-6xl grid lg:grid-cols-12 gap-8 items-start relative z-10">

        {/* MANAGER REVIEW SECTION (NEW FEATURE) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 space-y-6"
        >
          <div className={cn(
            "glass-card rounded-[3rem] p-8 border-2 relative overflow-hidden",
            lastEvaluation.managerMood === 'angry' ? "border-destructive/50 bg-destructive/10" : (lastEvaluation.passed ? "border-primary/30 bg-primary/5" : "border-amber-500/30 bg-amber-500/5")
          )}>
            <div className="text-center space-y-4 md:space-y-6 relative z-10">
              <div className="relative inline-block">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted flex items-center justify-center text-4xl md:text-6xl shadow-2xl border-4 border-background">
                  {getManagerMoodIcon(lastEvaluation.managerMood)}
                </div>
                <div className={cn(
                  "absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 px-2 md:px-4 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-lg",
                  lastEvaluation.managerMood === 'angry' ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
                )}>
                  {lastEvaluation.managerMood || 'Reviewing'}
                </div>
              </div>

              <div>
                <h3 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Director's Verdict</h3>
                <h2 className="text-lg md:text-xl font-black italic uppercase tracking-tight">{level.npcName}</h2>
              </div>

              <div className="relative">
                <MessageSquare className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-6 h-6 md:w-8 md:h-8 opacity-10 rotate-12" />
                <p className={cn(
                  "text-base md:text-lg font-bold italic leading-tight",
                  lastEvaluation.managerMood === 'angry' ? "text-destructive" : "text-foreground"
                )}>
                  "{lastEvaluation.managerMessage || lastEvaluation.feedback}"
                </p>
              </div>

              {!lastEvaluation.passed && (
                <div className="pt-6 border-t border-border/50">
                  <div className="flex items-center gap-2 text-amber-500 mb-3 justify-center">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Crucial Hints</span>
                  </div>
                  <div className="space-y-2">
                    {lastEvaluation.suggestedKeywords?.map(kw => (
                      <span key={kw} className="inline-block px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-500 mr-2 mb-2">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* MAIN STATUS & FEEDBACK */}
        <div className="lg:col-span-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "glass-card rounded-[3rem] p-10 relative overflow-hidden",
              lastEvaluation.passed ? "border-primary/20 bg-primary/5" : "border-destructive/20 bg-destructive/5"
            )}
          >
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10">
              <div className="relative">
                <div className={cn(
                  "w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center border-4 border-border/50 shadow-2xl",
                  lastEvaluation.passed ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"
                )}>
                  <span className="text-4xl md:text-5xl font-black italic">{lastEvaluation.score}</span>
                </div>
              </div>

              <div className="flex-1 space-y-2 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  {lastEvaluation.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-destructive" />
                  )}
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Technical Assessment</span>
                </div>
                <h1 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase leading-none">
                  {lastEvaluation.passed ? "Standard Met" : "Standard Not Met"}
                </h1>
                <p className="text-sm font-medium text-muted-foreground italic leading-relaxed">
                  {lastEvaluation.feedback}
                </p>
              </div>
            </div>
          </motion.div>

          {/* FEEDBACK CLOUD */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-[2.5rem] p-8 bg-muted/30 border-border/50"
            >
              <div className="flex items-center gap-2 mb-6 text-primary">
                <Star className="w-4 h-4" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Strengths Identified</h3>
              </div>
              <ul className="space-y-4">
                {(lastEvaluation.strengths || []).map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm font-bold text-foreground/80 italic">
                    <span className="text-primary tracking-tighter">0{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-[2.5rem] p-8 bg-muted/30 border-border/50"
            >
              <div className="flex items-center gap-2 mb-6 text-destructive">
                <Activity className="w-4 h-4" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Required Adjustments</h3>
              </div>
              <ul className="space-y-4">
                {(lastEvaluation.fixes || []).map((f, i) => (
                  <li key={i} className="flex gap-3 text-sm font-bold text-muted-foreground italic">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive/40 mt-1.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* ACTIONS */}
          <div className="grid md:grid-cols-2 gap-4">
            {lastEvaluation.passed ? (
              <>
                <Button
                  variant="glow"
                  size="xl"
                  onClick={handleNextAction}
                  className="w-full h-16 md:h-20 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl group text-lg md:text-xl font-black italic"
                >
                  {level.phases ? "NEXT PHASE" : "NEXT MISSION"}
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-3 md:ml-4 group-hover:translate-x-2 transition-transform" />
                </Button>
                <Button variant="glass" onClick={handleContinue} className="w-full rounded-2xl h-16 md:h-20 font-black uppercase tracking-widest text-[9px] md:text-[10px]">
                  Return to HQ
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="glow"
                  size="xl"
                  onClick={handleRetry}
                  className="w-full h-20 rounded-[2rem] shadow-2xl group text-xl font-black italic bg-destructive hover:bg-destructive/90 shadow-destructive/20"
                >
                  RETRY SYNC
                  <RotateCcw className="w-6 h-6 ml-4 group-hover:rotate-180 transition-transform duration-500" />
                </Button>
                <div className="p-6 glass-card rounded-2xl border-border/50 bg-muted/30 space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Sparkles className="w-3.5 h-3.5" />
                    <p className="text-[9px] font-black uppercase tracking-[0.2em]">Strategic Intel</p>
                  </div>
                  <p className="text-[11px] font-bold italic text-foreground/80 leading-tight">
                    {lastEvaluation.improvement}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};