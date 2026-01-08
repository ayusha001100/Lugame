import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { GAME_LEVELS } from '@/data/levels';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Zap,
  Trophy,
  Clock,
  Target,
  Coins,
  ChevronRight,
  HelpCircle,
  Heart,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '@/hooks/useAudio';
import { evaluateSubmission } from '@/lib/evaluation';
import { toast } from 'sonner';
import { NPCDialogueBox } from './NPCDialogueBox';
import { TaskRenderer } from './tasks/TaskRenderer';
import { DialogueNode, DialogueOption, PortfolioItem } from '@/types/game';

export const LevelPlay: React.FC = () => {
  const {
    player,
    currentLevelId,
    currentAttempt,
    setScreen,
    addXP,
    completeLevel,
    consumeStamina,
    updateKPIs,
    updateTrust,
    useToken,
    completePhase,
    lastEvaluation,
    activePhaseIndex,
    nextPhase,
    isClockedIn,
    setEvaluation,
    incrementAttempt
  } = useGameStore();

  const { playSfx } = useAudio();
  const [currentNode, setCurrentNode] = useState<DialogueNode | null>(null);
  const [showTask, setShowTask] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [phaseSubmissions, setPhaseSubmissions] = useState<Record<string, any>>({});

  const level = GAME_LEVELS.find(l => l.id === currentLevelId);
  const currentPhase = level?.phases?.[activePhaseIndex];

  const getHints = () => {
    const baseHints = currentPhase?.taskHints || level?.taskHints || [];
    const defaultHints = [
      "Analyze the psychological drivers: Identify if the audience is motivated by 'fear of loss' or 'gain of status'.",
      "Calibrate terminology: Use industry-standard shorthand (CAC, LTV, ROAS) to demonstrate strategic maturity.",
      "Check NPC Alignment: The Director values efficiency; ensure your decision prioritizes speed and scalability.",
      "Data-Driven Logic: Look for the specific performance target mentioned in the initial briefing panel.",
      "Risk Mitigation: Evaluate the long-term impact of this decision on the overall acquisition funnel."
    ];

    // Combine and ensure exactly 5 detailed points
    const combined = [...baseHints];
    while (combined.length < 5) {
      combined.push(defaultHints[combined.length % defaultHints.length]);
    }
    return combined.slice(0, 5);
  };

  const hints = getHints();

  useEffect(() => {
    if (level && level.npcDialogue && level.npcDialogue.length > 0) {
      setCurrentNode(level.npcDialogue[0]);
    }
    // Reset local phase submissions but preserve global state
    setPhaseSubmissions({});

    // If resuming from a later phase, go straight to the task
    if (activePhaseIndex > 0) {
      setShowTask(true);
    } else {
      setShowTask(false);
    }
  }, [currentLevelId, level, activePhaseIndex]);

  if (!player || !level) return null;

  const getNpcType = (room: string): any => {
    const types: any = { marketing: 'manager', content: 'designer', ads: 'media', analytics: 'analyst', manager: 'founder' };
    return types[room] || 'manager';
  };

  const handleDialogueContinue = () => {
    if (!isClockedIn) {
      toast.error("Shift inactive. Clock in to proceed.");
      setScreen('office-hub');
      return;
    }
    playSfx('click');
    const currentIndex = level.npcDialogue.indexOf(currentNode!);
    if (currentIndex < level.npcDialogue.length - 1) {
      setCurrentNode(level.npcDialogue[currentIndex + 1]);
    } else {
      playSfx('transition');
      setShowTask(true);
    }
  };

  const handleChoice = (option: DialogueOption) => {
    if (!isClockedIn) {
      toast.error("Shift inactive. Clock in to proceed.");
      setScreen('office-hub');
      return;
    }
    const nextNode = level.npcDialogue.find(n => n.id === option.nextId);
    if (nextNode) {
      setCurrentNode(nextNode);
    } else {
      setShowTask(true);
    }
  };

  const onTaskComplete = async (submission: any) => {
    setIsEvaluating(true);
    playSfx('click');

    try {
      const currentPhase = level.phases ? level.phases[activePhaseIndex] : null;

      const evaluationData = await evaluateSubmission(submission, {
        levelId: level.id,
        criteria: level.rubric.criteria,
        passingScore: level.rubric.passingScore,
        taskType: currentPhase ? currentPhase.taskType : (level.taskType as any),
        taskData: currentPhase ? currentPhase.taskData : (level.taskData || {}),
        levelTitle: level.title,
        levelPrompt: currentPhase ? currentPhase.taskPrompt : (level.taskPrompt || ""),
        attempt: currentAttempt,
        rubric: level.rubric
      });

      const evaluation = {
        ...evaluationData,
        canRetry: currentAttempt < level.rubric.maxAttempts,
        attemptsLeft: level.rubric.maxAttempts - currentAttempt
      };

      setEvaluation(evaluation as any);

      if (level.phases && activePhaseIndex < level.phases.length - 1) {
        setPhaseSubmissions(prev => ({ ...prev, [level.phases![activePhaseIndex].id]: submission }));

        completePhase(level.id, level.phases[activePhaseIndex].id, {
          ...evaluation,
          managerMood: evaluation.managerMood as any,
          managerMessage: evaluation.managerMessage || ""
        });

        setScreen('evaluation');
        return;
      }

      const finalSubmission = level.phases
        ? { ...phaseSubmissions, [level.phases[activePhaseIndex].id]: submission }
        : submission;

      if (evaluation.passed) {
        playSfx('success');
        const impact = evaluation.kpiImpact || level.simulationImpact;
        if (impact) updateKPIs(impact);
        updateTrust(getNpcType(level.room), 5);

        const portfolioItem: PortfolioItem = {
          levelId: level.id,
          title: level.title,
          category: level.room.toUpperCase() as any,
          content: finalSubmission,
          score: evaluation.score,
          feedback: evaluation as any,
          isPublished: false,
          completedAt: new Date()
        };

        completeLevel(level.id, portfolioItem, currentAttempt === 1);
      } else {
        playSfx('failure');
        updateTrust(getNpcType(level.room), -10);
        useGameStore.getState().loseLife(); // Apply life loss rule
        if (evaluation.canRetry) incrementAttempt();
      }

      setScreen('evaluation');

    } catch (error) {
      console.error('Evaluation error:', error);
      toast.error('Evaluation system offline.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 relative">
      {/* Top Left Trust Matrix - HUD Style */}
      <div className="fixed top-[120px] left-8 z-40 hidden xl:block animate-fade-in">
        <div className="bg-black/40 backdrop-blur-xl rounded-[1.5rem] p-5 border border-white/10 shadow-2xl min-w-[240px]">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary/60">Relationship</span>
                <h3 className="text-sm font-black italic uppercase tracking-tighter text-white">Trust Matrix</h3>
              </div>
              <div className="text-2xl font-black italic text-primary leading-none">
                {player.stats.trust[getNpcType(level.room) as 'manager']}%
              </div>
            </div>

            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                initial={{ width: 0 }}
                animate={{ width: `${player.stats.trust[getNpcType(level.room) as 'manager']}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>

            <div className="flex items-center gap-2 opacity-60">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                {getNpcType(level.room) === 'manager' ? '👩‍💼' : (getNpcType(level.room) === 'designer' ? '🎨' : '🏢')}
              </div>
              <p className="text-[8px] font-black text-white uppercase tracking-widest leading-none">
                {level.npcName} • {getNpcType(level.room).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Hints Panel - HUD Style */}
      <div className="fixed top-[120px] right-8 z-40 hidden 2xl:block w-[280px] animate-fade-in">
        <div className="bg-black/40 backdrop-blur-xl rounded-[1.5rem] p-6 border border-white/10 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <HelpCircle className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-white">Mission Intel</h3>
              <p className="text-[7px] font-black uppercase text-amber-500 tracking-tighter">Strategist Guide</p>
            </div>
          </div>

          <div className="space-y-4">
            {hints.map((hint, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex gap-3 group"
              >
                <span className="text-sm font-black italic text-amber-500/20 group-hover:text-amber-500/40 transition-colors leading-none pt-0.5">0{i + 1}</span>
                <p className="text-[10px] font-bold text-white/60 leading-relaxed group-hover:text-white transition-colors italic">
                  {hint}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-primary opacity-30">
            <Sparkles className="w-2.5 h-2.5" />
            <span className="text-[7px] font-black uppercase tracking-widest">MarketCraft Protocol</span>
          </div>
        </div>
      </div>

      <header className="p-4 md:p-6 lg:p-8 flex items-center justify-between border-b border-border bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4 md:gap-6 min-w-0">
          <Button
            variant="glass"
            size="icon"
            onClick={() => setScreen('room')}
            className="rounded-2xl shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex flex-col min-w-0">
            <h2 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-primary truncate">Mission Protocol</h2>
            <h1 className="text-lg md:text-xl font-black italic tracking-tight truncate">{level.title}</h1>
            {level.phases && (
              <div className="flex gap-1 mt-1 overflow-hidden">
                {level.phases.map((_, i) => (
                  <div key={i} className={cn("h-1 w-4 md:w-8 rounded-full shrink-0", i <= activePhaseIndex ? "bg-primary" : "bg-muted")} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0 px-2 md:px-0">
          <div className="hidden sm:flex items-center gap-4 lg:gap-6 mr-2 lg:mr-6">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Resources</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3 md:w-3.5 h-3 md:h-3.5 text-primary" />
                  <span className="text-[10px] md:text-xs font-bold tabular-nums">{player.stats.energy}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Coins className="w-3 md:w-3.5 h-3 md:h-3.5 text-amber-500" />
                  <span className="text-[10px] md:text-xs font-bold tabular-nums">{player.tokens}</span>
                </div>
                <div className="hidden lg:flex items-center gap-1.5 ml-2">
                  {[...Array(3)].map((_, i) => (
                    <Heart
                      key={i}
                      className={cn("w-3 h-3", i < (player.lives || 3) ? "fill-destructive text-destructive" : "text-muted/30")}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="h-6 w-px bg-border" />

            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Attempts</span>
              <div className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-bold tabular-nums">{currentAttempt} / {level.rubric.maxAttempts}</span>
              </div>
            </div>
          </div>

          <Button
            variant="glass"
            size="sm"
            className="rounded-xl border-border h-9 md:h-10 px-2 md:px-4 shrink-0"
            onClick={() => {
              if (useToken(1)) {
                toast.success("Hint protocol activated!");
              } else {
                toast.error("Insufficient tokens.");
              }
            }}
          >
            <HelpCircle className="w-4 h-4 md:mr-2" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Query Intel</span>
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8 lg:p-12 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-3 mb-8 md:mb-12"
        >
          <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[8px] md:text-[10px] font-black text-primary uppercase tracking-widest">
            {level.room} :: {level.difficulty}
          </div>
          <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-muted" />
          <div className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate max-w-full">
            {level.competencies.join(' • ')}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showTask && currentNode ? (
            <motion.div
              key="dialogue"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <NPCDialogueBox
                npcName={level.npcName}
                npcRole={level.npcRole}
                npcType={getNpcType(level.room)}
                node={currentNode}
                onChoice={handleChoice}
                onContinue={handleDialogueContinue}
                isLast={level.npcDialogue.indexOf(currentNode) === level.npcDialogue.length - 1}
              />
            </motion.div>
          ) : (
            <motion.div
              key={`task-phase-${activePhaseIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <TaskRenderer
                level={level}
                onComplete={onTaskComplete}
                isEvaluating={isEvaluating}
                activePhaseIndex={activePhaseIndex}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
