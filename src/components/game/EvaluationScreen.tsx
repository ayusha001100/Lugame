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
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudio } from '@/hooks/useAudio';
import { CelebrationEffects, XPBurstEffect } from './CelebrationEffects';

export const EvaluationScreen: React.FC = () => {
  const { 
    player,
    currentLevelId, 
    lastEvaluation, 
    setScreen, 
    setCurrentLevel,
    resetAttempt,
    canPlay,
    syncToLeaderboard
  } = useGameStore();

  const { playSfx } = useAudio();
  const level = GAME_LEVELS.find(l => l.id === currentLevelId);
  
  const [showCelebration, setShowCelebration] = useState(false);
  const [showXPBurst, setShowXPBurst] = useState(false);

  // Trigger celebration effects on mount if passed and sync to leaderboard
  useEffect(() => {
    if (lastEvaluation?.passed) {
      setShowCelebration(true);
      setTimeout(() => setShowXPBurst(true), 800);
      // Sync score to leaderboard
      syncToLeaderboard();
    }
  }, [lastEvaluation?.passed, syncToLeaderboard]);

  if (!lastEvaluation || !level || !player) return null;

  const handleRetry = () => {
    playSfx('click');
    if (!canPlay() && !player.isPremium) {
      setScreen('no-lives');
      return;
    }
    setScreen('level');
  };

  const handleContinue = () => {
    playSfx('click');
    resetAttempt();
    setCurrentLevel(null);
    setScreen('room');
  };

  const handleNextLevel = () => {
    playSfx('transition');
    const nextLevel = GAME_LEVELS.find(l => l.id > level.id);
    if (nextLevel) {
      resetAttempt();
      setCurrentLevel(nextLevel.id);
      setScreen('level');
    } else {
      handleContinue();
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8 flex items-center justify-center relative">
      {/* Celebration Effects */}
      <CelebrationEffects isActive={showCelebration} intensity="high" />
      
      <div className="w-full max-w-2xl animate-scale-in relative z-10">
        {/* Result Header */}
        <div className="text-center mb-8">
          <div className={cn(
            'w-28 h-28 rounded-full mx-auto mb-6 flex items-center justify-center relative',
            lastEvaluation.passed 
              ? 'bg-success/20' 
              : 'bg-destructive/20'
          )}>
            {lastEvaluation.passed ? (
              <CheckCircle2 className="w-14 h-14 text-success" />
            ) : (
              <XCircle className="w-14 h-14 text-destructive" />
            )}
            {lastEvaluation.passed && (
              <div className="absolute inset-0 rounded-full bg-success/20 animate-ping" style={{ animationDuration: '2s' }} />
            )}
          </div>

          <h1 className="text-4xl font-bold mb-2">
            {lastEvaluation.passed ? 'Excellent Work!' : 'Almost There!'}
          </h1>
          <p className="text-muted-foreground">
            {lastEvaluation.passed 
              ? "You've successfully completed this challenge." 
              : 'Review the feedback below and try again.'}
          </p>

          {/* Lives indicator for failed attempt */}
          {!lastEvaluation.passed && !player.isPremium && (
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
              <span>Lives remaining:</span>
              <div className="flex gap-1">
                {[...Array(player.maxLives)].map((_, i) => (
                  <Heart
                    key={i}
                    className={cn(
                      'w-4 h-4',
                      i < player.lives
                        ? 'text-red-500 fill-red-500'
                        : 'text-muted-foreground/30'
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Score Display */}
        <div className="glass-card rounded-2xl p-8 mb-6">
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="relative">
                <svg className="w-36 h-36 -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(lastEvaluation.score / 100) * 402} 402`}
                    strokeLinecap="round"
                    className={cn(
                      'transition-all duration-1000',
                      lastEvaluation.passed ? 'text-success' : 'text-primary'
                    )}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-bold">{lastEvaluation.score}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Overall Score</p>
            </div>

            {lastEvaluation.passed && (
              <div className="text-center animate-fade-up relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-gold flex items-center justify-center mb-2 shadow-lg animate-pulse-glow">
                  <Star className="w-12 h-12 text-primary-foreground" />
                </div>
                <p className="text-2xl font-bold text-gradient-gold">+{level.xpReward} XP</p>
                
                {/* XP Burst Effect */}
                <XPBurstEffect xp={level.xpReward} isActive={showXPBurst} />
              </div>
            )}
          </div>

          {/* Criteria Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Evaluation Breakdown
            </h3>
            {lastEvaluation.criteriaScores.map((criteria, index) => (
              <div key={index} className="space-y-2 animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{criteria.name}</span>
                  <span className={cn(
                    'font-bold',
                    criteria.score >= 70 ? 'text-success' : criteria.score >= 50 ? 'text-primary' : 'text-destructive'
                  )}>
                    {criteria.score}/100
                  </span>
                </div>
                <Progress value={criteria.score} className="h-2" />
                <p className="text-xs text-muted-foreground">{criteria.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span className="text-xl">💬</span>
            Mentor Feedback
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {lastEvaluation.feedback}
          </p>
          
          <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
            <h4 className="text-sm font-semibold text-primary mb-1 flex items-center gap-2">
              <span>💡</span>
              Pro Tip
            </h4>
            <p className="text-sm text-muted-foreground">{lastEvaluation.improvement}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          {!lastEvaluation.passed && lastEvaluation.canRetry && (
            <Button
              variant="glass"
              size="lg"
              onClick={handleRetry}
              className="flex-1 max-w-[200px]"
              disabled={!canPlay() && !player.isPremium}
            >
              <RotateCcw className="w-4 h-4" />
              Try Again ({lastEvaluation.attemptsLeft} left)
            </Button>
          )}
          
          {lastEvaluation.passed ? (
            <Button
              variant="glow"
              size="xl"
              onClick={handleNextLevel}
              className="flex-1 max-w-[280px]"
            >
              <Trophy className="w-5 h-5" />
              Next Challenge
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="lg"
              onClick={handleContinue}
              className="flex-1 max-w-[200px]"
            >
              Back to Room
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
