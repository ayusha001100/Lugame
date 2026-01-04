import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { OFFICE_ROOMS, GAME_LEVELS, OFFICE_HUB_IMAGE } from '@/data/levels';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, 
  FileText, 
  Settings, 
  Trophy,
  ChevronRight,
  Lock,
  Star,
  Zap,
  Heart,
  Crown,
  Volume2,
  VolumeX,
  Award,
  Flame,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudio } from '@/hooks/useAudio';
import { OfficeCharacters } from './OfficeCharacters';
import { PlayerAvatarDisplay } from './PlayerAvatarDisplay';
import { ThemeToggle } from './ThemeToggle';

export const OfficeHub: React.FC = () => {
  const { 
    player, 
    setScreen, 
    setCurrentRoom, 
    checkLivesRegen, 
    canPlay, 
    isLevelUnlocked,
    setShowDailyChallenges,
    setShowTutorial
  } = useGameStore();
  const { isMusicPlaying, toggleMusic, playSfx } = useAudio();
  const [activeCharacter, setActiveCharacter] = useState<string | undefined>();

  useEffect(() => {
    checkLivesRegen();
  }, [checkLivesRegen]);

  useEffect(() => {
    checkLivesRegen();
  }, [checkLivesRegen]);

  if (!player) return null;

  const completedCount = player.completedLevels.length;
  const totalLevels = GAME_LEVELS.length;
  const progressPercent = (completedCount / totalLevels) * 100;

  const xpToNextLevel = ((player.level) * 500) - player.xp;
  const currentLevelXp = player.xp - ((player.level - 1) * 500);
  const levelProgress = (currentLevelXp / 500) * 100;

  const handleRoomClick = (roomId: string) => {
    if (!canPlay()) {
      playSfx('failure');
      setScreen('no-lives');
      return;
    }
    playSfx('transition');
    setCurrentRoom(roomId);
    setScreen('room');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url(${OFFICE_HUB_IMAGE})` }}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1.5 }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />

      {/* Animated Office Characters in background */}
      <OfficeCharacters 
        activeCharacter={activeCharacter}
        onCharacterClick={(id) => {
          setActiveCharacter(id);
          playSfx('click');
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <PlayerAvatarDisplay 
            size="md" 
            expression="happy" 
            gesture="idle"
            showStats={false}
            showName={true}
          />

          <div className="flex items-center gap-3">
            {/* Lives */}
            <motion.div 
              className="flex items-center gap-1 glass-card rounded-xl px-3 py-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {[...Array(player.maxLives)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={i < player.lives ? {
                    scale: [1, 1.2, 1],
                  } : {}}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                >
                  <Heart
                    className={cn(
                      'w-4 h-4 transition-all',
                      i < player.lives
                        ? 'text-red-500 fill-red-500'
                        : 'text-muted-foreground/30'
                    )}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Streak indicator */}
            {player.streakData && player.streakData.currentStreak > 0 && (
              <motion.button
                onClick={() => {
                  playSfx('click');
                  setShowDailyChallenges(true);
                }}
                className="flex items-center gap-1.5 glass-card rounded-xl px-3 py-2 hover:bg-white/5 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <Flame className="w-4 h-4 text-orange-500" />
                </motion.div>
                <span className="text-sm font-bold">{player.streakData.currentStreak}</span>
              </motion.button>
            )}

            <ThemeToggle />

            {/* Daily Challenges */}
            <Button
              variant="glass"
              size="icon"
              onClick={() => {
                playSfx('click');
                setShowDailyChallenges(true);
              }}
              className="relative"
            >
              <Flame className="w-5 h-5" />
            </Button>

            {/* Tutorial help */}
            <Button
              variant="glass"
              size="icon"
              onClick={() => {
                playSfx('click');
                setShowTutorial(true);
              }}
            >
              <HelpCircle className="w-5 h-5" />
            </Button>

            <Button
              variant="glass"
              size="icon"
              onClick={() => {
                toggleMusic();
                playSfx('click');
              }}
            >
              {isMusicPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>

            <Button
              variant="glass"
              size="icon"
              onClick={() => {
                playSfx('click');
                setScreen('achievements');
              }}
              className="relative"
            >
              <Award className="w-5 h-5" />
              {player.achievements && player.achievements.length > 0 && (
                <motion.span 
                  className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  {player.achievements.length}
                </motion.span>
              )}
            </Button>

            <Button
              variant="glass"
              size="icon"
              onClick={() => {
                playSfx('click');
                setScreen('leaderboard');
              }}
            >
              <Trophy className="w-5 h-5" />
            </Button>

            <Button
              variant="glass"
              size="icon"
              onClick={() => {
                playSfx('click');
                setScreen('portfolio');
              }}
            >
              <FileText className="w-5 h-5" />
            </Button>

            <Button
              variant="glass"
              size="icon"
              onClick={() => {
                playSfx('click');
                setScreen('settings');
              }}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Stats Bar */}
        <motion.div 
          className="glass-card rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Level */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Zap className="w-4 h-4 text-primary" />
                </motion.div>
                <span className="text-sm text-muted-foreground">Level</span>
              </div>
              <motion.div 
                className="text-3xl font-bold"
                key={player.level}
                initial={{ scale: 1.5, color: 'hsl(var(--primary))' }}
                animate={{ scale: 1, color: 'hsl(var(--foreground))' }}
              >
                {player.level}
              </motion.div>
              <div className="mt-2">
                <Progress value={levelProgress} className="h-1.5" />
                <p className="text-xs text-muted-foreground mt-1">{xpToNextLevel} XP to next</p>
              </div>
            </motion.div>

            {/* XP */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Star className="w-4 h-4 text-primary" />
                </motion.div>
                <span className="text-sm text-muted-foreground">Total XP</span>
              </div>
              <motion.div 
                className="text-3xl font-bold text-gradient-gold"
                key={player.xp}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {player.xp.toLocaleString()}
              </motion.div>
            </motion.div>

            {/* Progress */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <div className="text-3xl font-bold">{completedCount}/{totalLevels}</div>
              <Progress value={progressPercent} className="h-1.5 mt-2" />
            </motion.div>

            {/* Portfolio */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Portfolio</span>
              </div>
              <div className="text-3xl font-bold">{player.portfolio.length}</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Premium CTA */}
        {!player.isPremium && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.01 }}
            onClick={() => {
              playSfx('click');
              setScreen('premium');
            }}
            className="w-full glass-card rounded-2xl p-4 mb-6 border-2 border-primary/30 hover:border-primary/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Crown className="w-6 h-6 text-primary-foreground" />
                </motion.div>
                <div className="text-left">
                  <h3 className="font-semibold">Unlock Premium</h3>
                  <p className="text-sm text-muted-foreground">Unlimited lives, all levels, and more</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </motion.button>
        )}

        {/* Office Title */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold mb-1">NovaTech Office</h2>
          <p className="text-muted-foreground">Select a department to explore available tasks</p>
        </motion.div>

        {/* Office Rooms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {OFFICE_ROOMS.map((room, index) => {
            const roomLevels = GAME_LEVELS.filter(l => room.levels.includes(l.id));
            const completedInRoom = roomLevels.filter(l => player.completedLevels.includes(l.id)).length;
            const nextUnlockedLevel = roomLevels.find(l => isLevelUnlocked(l.id) && !player.completedLevels.includes(l.id));

            return (
              <motion.button
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => handleRoomClick(room.id)}
                className="room-card text-left group relative overflow-hidden"
              >
                {/* Room Image Background */}
                {room.image && (
                  <motion.div 
                    className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"
                    style={{ backgroundImage: `url(${room.image})` }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-card/40" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <motion.div 
                      className="text-4xl"
                      animate={{ 
                        y: [0, -5, 0],
                        rotate: [0, -5, 5, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                    >
                      {room.icon}
                    </motion.div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-1">{room.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{room.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {completedInRoom}/{roomLevels.length} completed
                      </span>
                    </div>
                    {nextUnlockedLevel && (
                      <motion.div 
                        className="flex items-center gap-1 text-xs text-primary"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Zap className="w-3 h-3" />
                        Ready
                      </motion.div>
                    )}
                  </div>

                  <Progress 
                    value={(completedInRoom / roomLevels.length) * 100} 
                    className="h-1 mt-3" 
                  />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
