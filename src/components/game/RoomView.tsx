import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { OFFICE_ROOMS, GAME_LEVELS } from '@/data/levels';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Lock,
  CheckCircle2,
  Clock,
  Star,
  ChevronRight,
  Timer,
  Palette
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
        <div>
          <div className="flex items-center gap-3">
            <motion.span 
              className="text-3xl"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              {room.icon}
            </motion.span>
            <h1 className="text-2xl font-bold">{room.name}</h1>
          </div>
          <p className="text-muted-foreground mt-1">{room.description}</p>
        </div>
      </header>

      {/* NPC Welcome */}
      {roomLevels[0] && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <motion.div 
              className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center text-2xl shrink-0"
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0] 
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              👤
            </motion.div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{roomLevels[0].npcName}</span>
                <span className="text-xs text-muted-foreground">• {roomLevels[0].npcRole}</span>
              </div>
              <p className="text-muted-foreground">
                Welcome to {room.name}! Complete levels in order to unlock new challenges. 
                Each task builds on the skills from the previous one.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Level List */}
      <div className="space-y-4">
        {roomLevels.map((level, index) => {
          const isCompleted = player.completedLevels.includes(level.id);
          const isUnlocked = isLevelUnlocked(level.id);
          const portfolioItem = player.portfolio.find(p => p.levelId === level.id);

          return (
            <motion.button
              key={level.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleLevelClick(level.id)}
              disabled={!isUnlocked}
              className={cn(
                'w-full glass-card rounded-2xl p-6 text-left transition-all duration-300 group relative overflow-hidden',
                isUnlocked 
                  ? 'hover:bg-white/5 cursor-pointer hover:scale-[1.01]' 
                  : 'opacity-60 cursor-not-allowed',
                isCompleted && 'border-success/30'
              )}
            >
              {/* Animated background glow for next unlocked level */}
              {isUnlocked && !isCompleted && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent -z-10"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <motion.div 
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold',
                        isCompleted 
                          ? 'bg-success text-success-foreground' 
                          : isUnlocked 
                            ? 'bg-primary/20 text-primary'
                            : 'bg-muted text-muted-foreground'
                      )}
                      animate={isUnlocked && !isCompleted ? {
                        scale: [1, 1.1, 1],
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : level.id}
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-lg">{level.title}</h3>
                      <p className="text-sm text-muted-foreground">{level.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {level.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-primary" />
                      <span>{level.xpReward} XP</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{level.rubric.maxAttempts} attempts</span>
                    </div>
                    {/* Show difficulty badge for creative levels */}
                    {level.difficulty && (
                      <div className={cn(
                        'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border',
                        level.difficulty === 'easy' && 'bg-green-500/20 text-green-400 border-green-500/30',
                        level.difficulty === 'medium' && 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                        level.difficulty === 'hard' && 'bg-red-500/20 text-red-400 border-red-500/30'
                      )}>
                        <Timer className="w-3 h-3" />
                        {level.difficulty === 'easy' && '10 min'}
                        {level.difficulty === 'medium' && '7 min'}
                        {level.difficulty === 'hard' && '5 min'}
                      </div>
                    )}
                    {/* Show canvas indicator for creative levels */}
                    {level.taskType === 'canvas' && (
                      <div className="flex items-center gap-1 text-purple-400">
                        <Palette className="w-3.5 h-3.5" />
                        <span>Canvas Design</span>
                      </div>
                    )}
                    {!isUnlocked && (
                      <div className="flex items-center gap-1 text-amber-500">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Complete Level {level.id - 1} first</span>
                      </div>
                    )}
                    {portfolioItem && (
                      <div className="flex items-center gap-1 text-success">
                        <span>Score: {portfolioItem.score}/100</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  {isUnlocked ? (
                    <motion.div
                      animate={!isCompleted ? { x: [0, 5, 0] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all" />
                    </motion.div>
                  ) : (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Info card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-4">
          <motion.div 
            className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Star className="w-6 h-6 text-primary" />
          </motion.div>
          <div className="flex-1">
            <h4 className="font-semibold mb-1">Sequential Learning</h4>
            <p className="text-sm text-muted-foreground">
              Complete each level in order to unlock the next. This ensures you build skills progressively!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
