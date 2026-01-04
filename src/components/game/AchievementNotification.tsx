import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '@/types/achievements';
import { Trophy, Star, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onComplete: () => void;
}

const rarityColors = {
  common: 'from-zinc-500 to-zinc-600',
  rare: 'from-blue-500 to-cyan-500',
  epic: 'from-purple-500 to-pink-500',
  legendary: 'from-amber-400 to-orange-500',
};

const rarityGlow = {
  common: 'shadow-zinc-500/30',
  rare: 'shadow-blue-500/40',
  epic: 'shadow-purple-500/50',
  legendary: 'shadow-amber-400/60',
};

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onComplete,
}) => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);

  useEffect(() => {
    if (achievement) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        delay: Math.random() * 0.3,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        onComplete();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onComplete]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
          />

          {/* Particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 rounded-full bg-primary"
              initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
              animate={{
                x: particle.x,
                y: particle.y,
                opacity: [1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: particle.delay,
                ease: 'easeOut',
              }}
            />
          ))}

          {/* Achievement Card */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            className={cn(
              'relative glass-card rounded-3xl p-8 border-2 shadow-2xl',
              rarityGlow[achievement.rarity],
              'border-primary/30'
            )}
          >
            {/* Glow effect */}
            <motion.div
              className={cn(
                'absolute -inset-4 rounded-[2rem] bg-gradient-to-r opacity-20 blur-2xl -z-10',
                rarityColors[achievement.rarity]
              )}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <div className="flex flex-col items-center text-center">
              {/* Trophy icon */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-4"
              >
                <Trophy className="w-8 h-8 text-primary" />
              </motion.div>

              {/* Achievement unlocked text */}
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-muted-foreground uppercase tracking-wider mb-4"
              >
                Achievement Unlocked!
              </motion.div>

              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', damping: 10 }}
                className={cn(
                  'w-24 h-24 rounded-2xl flex items-center justify-center text-5xl mb-4 bg-gradient-to-br',
                  rarityColors[achievement.rarity]
                )}
              >
                <motion.span
                  animate={{
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  {achievement.icon}
                </motion.span>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-bold mb-2"
              >
                {achievement.title}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-muted-foreground mb-4"
              >
                {achievement.description}
              </motion.p>

              {/* XP Reward */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: 'spring' }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20"
              >
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="font-bold text-primary">+{achievement.xpReward} XP</span>
              </motion.div>

              {/* Rarity badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className={cn(
                  'mt-4 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider',
                  achievement.rarity === 'legendary' && 'bg-amber-500/20 text-amber-400',
                  achievement.rarity === 'epic' && 'bg-purple-500/20 text-purple-400',
                  achievement.rarity === 'rare' && 'bg-blue-500/20 text-blue-400',
                  achievement.rarity === 'common' && 'bg-zinc-500/20 text-zinc-400'
                )}
              >
                {achievement.rarity}
              </motion.div>
            </div>

            {/* Sparkle decorations */}
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-6 h-6 text-primary" />
            </motion.div>
            <motion.div
              className="absolute -bottom-2 -left-2"
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-6 h-6 text-primary" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
