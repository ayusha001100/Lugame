import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { ACHIEVEMENTS, Achievement } from '@/types/achievements';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, Star, Trophy, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const rarityColors = {
  common: 'from-zinc-500 to-zinc-600',
  rare: 'from-blue-500 to-cyan-500',
  epic: 'from-purple-500 to-pink-500',
  legendary: 'from-amber-400 to-orange-500',
};

const rarityBorders = {
  common: 'border-zinc-500/30',
  rare: 'border-blue-500/30',
  epic: 'border-purple-500/30',
  legendary: 'border-amber-400/30',
};

export const AchievementsView: React.FC = () => {
  const { player, setScreen } = useGameStore();

  if (!player) return null;

  const unlockedIds = player.achievements?.map(a => a.achievementId) || [];
  const unlockedCount = unlockedIds.length;
  const totalCount = ACHIEVEMENTS.length;

  const categories = ['progress', 'mastery', 'special'] as const;

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <Button
          variant="glass"
          size="icon"
          onClick={() => setScreen('office-hub')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Achievements</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            {unlockedCount} of {totalCount} unlocked
          </p>
        </div>
      </header>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Collection Progress</span>
          <span className="text-sm font-medium">{Math.round((unlockedCount / totalCount) * 100)}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-amber-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Achievement categories */}
      {categories.map((category, catIndex) => {
        const categoryAchievements = ACHIEVEMENTS.filter(a => a.category === category);
        if (categoryAchievements.length === 0) return null;

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.1 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold mb-4 capitalize flex items-center gap-2">
              {category === 'progress' && <Star className="w-5 h-5 text-primary" />}
              {category === 'mastery' && <Sparkles className="w-5 h-5 text-purple-400" />}
              {category === 'special' && <Trophy className="w-5 h-5 text-amber-400" />}
              {category}
            </h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryAchievements.map((achievement, index) => {
                const isUnlocked = unlockedIds.includes(achievement.id);
                const unlockedData = player.achievements?.find(a => a.achievementId === achievement.id);

                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'glass-card rounded-2xl p-5 border-2 transition-all relative overflow-hidden',
                      isUnlocked
                        ? rarityBorders[achievement.rarity]
                        : 'border-transparent opacity-60'
                    )}
                  >
                    {/* Locked overlay */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex items-center justify-center z-10">
                        <Lock className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                    )}

                    {/* Glow for unlocked */}
                    {isUnlocked && (
                      <motion.div
                        className={cn(
                          'absolute -inset-1 rounded-2xl bg-gradient-to-r opacity-10 blur-xl -z-10',
                          rarityColors[achievement.rarity]
                        )}
                        animate={{
                          opacity: [0.1, 0.2, 0.1],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    )}

                    <div className="flex gap-4">
                      {/* Icon */}
                      <div
                        className={cn(
                          'w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0',
                          isUnlocked
                            ? `bg-gradient-to-br ${rarityColors[achievement.rarity]}`
                            : 'bg-muted'
                        )}
                      >
                        {isUnlocked ? (
                          <motion.span
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {achievement.icon}
                          </motion.span>
                        ) : (
                          '?'
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {achievement.description}
                        </p>

                        <div className="flex items-center gap-3 mt-2">
                          <span
                            className={cn(
                              'text-xs px-2 py-0.5 rounded-full capitalize',
                              achievement.rarity === 'legendary' && 'bg-amber-500/20 text-amber-400',
                              achievement.rarity === 'epic' && 'bg-purple-500/20 text-purple-400',
                              achievement.rarity === 'rare' && 'bg-blue-500/20 text-blue-400',
                              achievement.rarity === 'common' && 'bg-zinc-500/20 text-zinc-400'
                            )}
                          >
                            {achievement.rarity}
                          </span>
                          <span className="text-xs text-primary flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            +{achievement.xpReward} XP
                          </span>
                        </div>

                        {isUnlocked && unlockedData && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Unlocked {new Date(unlockedData.unlockedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
