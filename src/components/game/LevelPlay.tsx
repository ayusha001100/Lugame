import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { GAME_LEVELS } from '@/data/levels';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Send,
  Lightbulb,
  Clock,
  Star,
  Heart,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudio } from '@/hooks/useAudio';
import { evaluateSubmission } from '@/lib/evaluation';
import { toast } from 'sonner';
import { NPCDialogueBox } from './NPCDialogueBox';

export const LevelPlay: React.FC = () => {
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
  const [submission, setSubmission] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const level = GAME_LEVELS.find(l => l.id === currentLevelId);

  useEffect(() => {
    if (!canPlay() && !player?.isPremium) {
      setScreen('no-lives');
    }
  }, [canPlay, player, setScreen]);

  if (!player || !level) return null;

  const getNpcType = (room: string): 'manager' | 'designer' | 'analyst' | 'founder' | 'media' => {
    const npcTypes: Record<string, 'manager' | 'designer' | 'analyst' | 'founder' | 'media'> = {
      marketing: 'manager',
      content: 'designer',
      ads: 'media',
      analytics: 'analyst',
      manager: 'founder',
    };
    return npcTypes[room] || 'manager';
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

  const handleSubmit = async () => {
    if (!submission.trim()) return;

    setIsEvaluating(true);
    playSfx('click');

    try {
      const data = await evaluateSubmission(submission.trim(), {
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
          content: submission,
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
      toast.error('Failed to evaluate submission. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
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

        <div className="flex items-center gap-4">
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
      <div className="mb-6 animate-fade-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="xp-badge">Level {level.id}</div>
          <h1 className="text-2xl font-bold">{level.title}</h1>
        </div>
        <p className="text-muted-foreground">{level.subtitle}</p>
      </div>

      {/* NPC Dialogue or Task */}
      {!showTask ? (
        <div className="animate-fade-up">
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
        </div>
      ) : (
        <div className="max-w-3xl mx-auto animate-fade-up">
          {/* Task Card */}
          <div className="glass-card rounded-2xl p-6 mb-6 border-l-4 border-primary">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">📝</span>
              Your Task
            </h3>
            <p className="text-muted-foreground leading-relaxed">{level.taskPrompt}</p>
          </div>

          {/* Hints Toggle */}
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 group"
          >
            <Lightbulb className={cn(
              'w-4 h-4 transition-colors',
              showHints && 'text-primary'
            )} />
            {showHints ? 'Hide Hints' : 'Show Hints'}
          </button>

          {showHints && (
            <div className="glass-card rounded-xl p-4 mb-6 animate-fade-up border-l-4 border-primary/50">
              <ul className="space-y-2">
                {level.taskHints.map((hint, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">💡</span>
                    {hint}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Submission Area */}
          <div className="mb-6">
            <Textarea
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
              placeholder="Type your submission here..."
              className="min-h-[240px] bg-card border-border focus:border-primary resize-none task-input text-base leading-relaxed"
            />
            <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
              <span>{submission.length} characters</span>
              <span className="hidden md:block">Press ⌘+Enter to submit</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              variant="glow"
              size="xl"
              onClick={handleSubmit}
              disabled={!submission.trim() || isEvaluating}
              className="min-w-[200px]"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Evaluating...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit for Review
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
