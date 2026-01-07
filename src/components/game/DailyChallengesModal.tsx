import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { generateDailyChallenges, getStreakBonus, getStreakMessage, DailyChallenge } from '@/types/dailyChallenges';
import { Button } from '@/components/ui/button';
import { X, Flame, Star, CheckCircle2, Gift, Zap, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DailyChallengesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const difficultyColors = {
  easy: 'from-green-500 to-emerald-500',
  medium: 'from-amber-500 to-orange-500',
  hard: 'from-red-500 to-rose-500',
};

const difficultyBadges = {
  easy: 'bg-green-500/20 text-green-400',
  medium: 'bg-amber-500/20 text-amber-400',
  hard: 'bg-red-500/20 text-red-400',
};

export const DailyChallengesModal: React.FC<DailyChallengesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { player, claimStreakBonus, addXP } = useGameStore();
  const dailyData = player?.dailyData;
  const streakData = player?.streakData;
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [showStreakClaim, setShowStreakClaim] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      setChallenges(generateDailyChallenges(today));
    }
  }, [isOpen]);

  if (!isOpen || !player) return null;

  const completedIds = dailyData?.completedChallenges || [];
  const streak = streakData?.currentStreak || 0;
  const streakBonus = getStreakBonus(streak);
  const canClaimStreak = streak > 0 && streakBonus > 0 && !streakData?.streakXpClaimed;

  const checkChallengeComplete = (challenge: DailyChallenge): boolean => {
    if (completedIds.includes(challenge.id)) return true;

    switch (challenge.requirement.type) {
      case 'complete_level':
        return (dailyData?.levelsCompletedToday?.length || 0) >= challenge.requirement.value;
      case 'earn_xp':
        return (dailyData?.xpEarnedToday || 0) >= challenge.requirement.value;
      case 'perfect_score':
        return (dailyData?.perfectScoresToday || 0) >= 1;
      case 'first_try':
        return (dailyData?.firstTriesToday || 0) >= challenge.requirement.value;
      default:
        return false;
    }
  };

  const handleClaimStreak = () => {
    if (canClaimStreak) {
      claimStreakBonus();
      addXP(streakBonus);
      setShowStreakClaim(true);
      setTimeout(() => setShowStreakClaim(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md glass-card rounded-3xl overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-border">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Calendar className="w-7 h-7 text-primary-foreground" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold">Daily Challenges</h2>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {/* Streak Banner */}
          <div className="p-4 bg-gradient-to-r from-primary/10 to-amber-500/10 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Flame className={cn(
                    'w-8 h-8',
                    streak > 0 ? 'text-orange-500' : 'text-muted-foreground'
                  )} />
                </motion.div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{streak}</span>
                    <span className="text-sm text-muted-foreground">day streak</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{getStreakMessage(streak)}</p>
                </div>
              </div>

              {canClaimStreak && (
                <Button
                  variant="glow"
                  size="sm"
                  onClick={handleClaimStreak}
                  className="relative"
                >
                  <Gift className="w-4 h-4 mr-1" />
                  +{streakBonus} XP
                  <motion.div
                    className="absolute -inset-1 bg-primary/30 rounded-lg blur-md -z-10"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </Button>
              )}

              {showStreakClaim && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="text-primary font-bold"
                >
                  +{streakBonus} XP!
                </motion.div>
              )}
            </div>

            {/* Streak milestones */}
            <div className="flex gap-2 mt-3">
              {[3, 7, 14, 30].map(milestone => (
                <div
                  key={milestone}
                  className={cn(
                    'flex-1 text-center py-1 rounded-lg text-xs',
                    streak >= milestone
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {milestone}d
                </div>
              ))}
            </div>
          </div>

          {/* Challenges List */}
          <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
            {challenges.map((challenge, index) => {
              const isComplete = checkChallengeComplete(challenge);

              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'glass-card rounded-xl p-4 border transition-all',
                    isComplete
                      ? 'border-success/30 bg-success/5'
                      : 'border-transparent'
                  )}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
                        isComplete
                          ? 'bg-success/20'
                          : `bg-gradient-to-br ${difficultyColors[challenge.difficulty]}`
                      )}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="w-6 h-6 text-success" />
                      ) : (
                        <motion.span
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                        >
                          {challenge.icon}
                        </motion.span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={cn(
                          'font-semibold',
                          isComplete && 'line-through text-muted-foreground'
                        )}>
                          {challenge.title}
                        </h3>
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded-full capitalize',
                          difficultyBadges[challenge.difficulty]
                        )}>
                          {challenge.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </div>

                    {/* Reward */}
                    <div className="flex items-center gap-1 text-primary font-bold">
                      <Zap className="w-4 h-4" />
                      <span>+{challenge.xpReward}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-muted/30">
            <p className="text-xs text-center text-muted-foreground">
              Challenges reset daily at midnight. Complete them all for maximum XP!
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
