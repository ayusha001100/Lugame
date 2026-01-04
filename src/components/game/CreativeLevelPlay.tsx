import React, { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { GAME_LEVELS } from '@/data/levels';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Clock,
  Star,
  Heart,
  Loader2,
  AlertTriangle,
  Timer
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudio } from '@/hooks/useAudio';
import { evaluateCreativeSubmission } from '@/lib/evaluation';
import { toast } from 'sonner';
import { NPCDialogueBox } from './NPCDialogueBox';
import { BannerCanvas } from './BannerCanvas';
import { motion, AnimatePresence } from 'framer-motion';

interface CanvasElementData {
  type: string;
  properties: Record<string, unknown>;
}

// Timer durations based on difficulty (in seconds)
const TIMER_DURATIONS = {
  easy: 10 * 60, // 10 minutes
  medium: 7 * 60, // 7 minutes  
  hard: 5 * 60, // 5 minutes
};

export const CreativeLevelPlay: React.FC = () => {
  const {
    player,
    currentLevelId,
    currentAttempt,
    setScreen,
    setEvaluation,
    incrementAttempt,
    addXP,
    completeLevel,
    loseLife,
    canPlay
  } = useGameStore();

  const { playSfx } = useAudio();
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showTask, setShowTask] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const [submittedDesign, setSubmittedDesign] = useState<{
    imageData: string;
    elements: CanvasElementData[];
  } | null>(null);

  const level = GAME_LEVELS.find(l => l.id === currentLevelId);

  useEffect(() => {
    if (!canPlay() && !player?.isPremium) {
      setScreen('no-lives');
    }
  }, [canPlay, player, setScreen]);

  // Get difficulty from level
  const getDifficulty = (): 'easy' | 'medium' | 'hard' => {
    if (!level) return 'medium';
    // Creative levels 11, 12, 13 map to easy, medium, hard
    if (level.id === 11) return 'easy';
    if (level.id === 12) return 'medium';
    if (level.id === 13) return 'hard';
    return 'medium';
  };

  const difficulty = getDifficulty();

  // Initialize timer when task is shown
  useEffect(() => {
    if (showTask && !timerStarted) {
      setTimeLeft(TIMER_DURATIONS[difficulty]);
      setTimerStarted(true);
    }
  }, [showTask, timerStarted, difficulty]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          // Time's up - auto fail
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleTimeUp = () => {
    playSfx('failure');
    toast.error("Time's up! You ran out of time.");

    if (!player?.isPremium) {
      loseLife();
    }

    setEvaluation({
      score: 0,
      passed: false,
      feedback: "Unfortunately, you ran out of time. Time management is crucial in creative work. Try again and plan your design before executing!",
      criteriaScores: [],
      improvement: "Start with a clear mental picture of what you want to create, then execute quickly.",
      canRetry: currentAttempt < (level?.rubric.maxAttempts || 3),
      attemptsLeft: (level?.rubric.maxAttempts || 3) - currentAttempt
    });

    incrementAttempt();
    setScreen('evaluation');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (): string => {
    if (!timeLeft) return 'text-muted-foreground';
    if (timeLeft <= 30) return 'text-red-500 animate-pulse';
    if (timeLeft <= 60) return 'text-orange-500';
    if (timeLeft <= 120) return 'text-yellow-500';
    return 'text-green-500';
  };

  if (!player || !level) return null;

  const getNpcType = (room: string): 'manager' | 'designer' | 'analyst' | 'founder' | 'media' => {
    const npcTypes: Record<string, 'manager' | 'designer' | 'analyst' | 'founder' | 'media'> = {
      marketing: 'manager',
      content: 'designer',
      ads: 'media',
      analytics: 'analyst',
      manager: 'founder',
      creative: 'designer',
    };
    return npcTypes[room] || 'designer';
  };

  const handleDialogueContinue = () => {
    playSfx('click');
    if (dialogueIndex < level.npcDialogue.length - 1) {
      setDialogueIndex(prev => prev + 1);
    } else {
      playSfx('transition');
      setShowTask(true);
    }
  };

  const handleCanvasExport = (imageData: string, elements: CanvasElementData[]) => {
    setSubmittedDesign({ imageData, elements });
    handleSubmit(imageData, elements);
  };

  const handleSubmit = async (imageData: string, elements: CanvasElementData[]) => {
    if (!level) return;

    setIsEvaluating(true);
    playSfx('click');

    try {
      const data = await evaluateCreativeSubmission(elements, {
        criteria: level.rubric.criteria.map(c => ({
          name: c.name,
          description: c.description,
          weight: c.weight
        })),
        passingScore: level.rubric.passingScore
      });

      const evaluation = {
        score: data.overallScore,
        passed: data.passed,
        feedback: data.feedback,
        criteriaScores: data.criteriaScores,
        improvement: data.improvement,
        canRetry: currentAttempt < level.rubric.maxAttempts,
        attemptsLeft: level.rubric.maxAttempts - currentAttempt
      };

      setEvaluation(evaluation);

      if (data.passed) {
        playSfx('success');
        addXP(level.xpReward);
        const isFirstTry = currentAttempt === 1;
        completeLevel(level.id, {
          levelId: level.id,
          title: level.title,
          content: `[Creative Banner Design]\nElements: ${elements.length}\nTime: ${formatTime(TIMER_DURATIONS[difficulty] - (timeLeft || 0))}`,
          score: data.overallScore,
          feedback: data.feedback,
          completedAt: new Date()
        }, isFirstTry);
      } else {
        playSfx('failure');
        if (!player.isPremium) {
          loseLife();
        }
        if (evaluation.canRetry) {
          incrementAttempt();
        }
      }

      setScreen('evaluation');

    } catch (error) {
      console.error('Evaluation error:', error);
      toast.error('Failed to evaluate design. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const difficultyBadge = {
    easy: { label: 'Easy', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    medium: { label: 'Medium', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    hard: { label: 'Hard', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <Button
          variant="glass"
          size="icon"
          onClick={() => {
            playSfx('click');
            setScreen('room');
          }}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-3">
          {/* Difficulty Badge */}
          <span className={cn(
            'px-3 py-1 rounded-full text-xs font-semibold border',
            difficultyBadge[difficulty].color
          )}>
            {difficultyBadge[difficulty].label}
          </span>

          {/* Timer */}
          {showTask && timeLeft !== null && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={cn(
                'flex items-center gap-2 glass-card rounded-lg px-4 py-2 font-mono text-lg font-bold',
                getTimerColor()
              )}
            >
              <Timer className="w-5 h-5" />
              {formatTime(timeLeft)}
            </motion.div>
          )}

          {/* Lives */}
          <div className="flex items-center gap-1 glass-card rounded-lg px-3 py-1.5">
            {[...Array(player.maxLives)].map((_, i) => (
              <Heart
                key={i}
                className={cn(
                  'w-3.5 h-3.5 transition-all',
                  i < player.lives
                    ? 'text-red-500 fill-red-500'
                    : 'text-muted-foreground/30'
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Attempt {currentAttempt}/{level.rubric.maxAttempts}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-primary font-semibold">{level.xpReward} XP</span>
          </div>
        </div>
      </header>

      {/* Level Info */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="xp-badge">Level {level.id}</div>
          <h1 className="text-xl font-bold">{level.title}</h1>
        </div>
        <p className="text-muted-foreground text-sm">{level.subtitle}</p>
      </motion.div>

      {/* NPC Dialogue or Canvas */}
      <AnimatePresence mode="wait">
        {!showTask ? (
          <motion.div
            key="dialogue"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <NPCDialogueBox
              npcName={level.npcName}
              npcRole={level.npcRole}
              npcType={getNpcType(level.room)}
              dialogue={level.npcDialogue[dialogueIndex]}
              dialogueIndex={dialogueIndex}
              totalDialogues={level.npcDialogue.length}
              onContinue={handleDialogueContinue}
              isLastDialogue={dialogueIndex >= level.npcDialogue.length - 1}
            />
          </motion.div>
        ) : (
          <motion.div
            key="canvas"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-5xl mx-auto"
          >
            {/* Warning Banner for Low Time */}
            <AnimatePresence>
              {timeLeft !== null && timeLeft <= 60 && timeLeft > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3"
                >
                  <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                  <span className="text-red-400 font-medium">
                    Less than 1 minute remaining! Submit your design soon!
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading Overlay */}
            <AnimatePresence>
              {isEvaluating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="glass-card rounded-2xl p-8 text-center"
                  >
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Evaluating Your Design</h3>
                    <p className="text-muted-foreground">Our AI creative director is reviewing your work...</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <BannerCanvas
              width={800}
              height={450}
              onExport={handleCanvasExport}
              problemStatement={level.taskPrompt}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
