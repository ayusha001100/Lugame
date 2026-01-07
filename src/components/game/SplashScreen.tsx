import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import { Sparkles, Play, Heart, Volume2, VolumeX, Award, Zap } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import { ThemeToggle } from './ThemeToggle';

export const SplashScreen: React.FC = () => {
  const { setScreen, player, checkStaminaRegen } = useGameStore();
  const { isMusicPlaying, toggleMusic, playSfx } = useAudio();

  useEffect(() => {
    checkStaminaRegen();
  }, [checkStaminaRegen]);

  const handleStart = () => {
    playSfx('click');
    if (player) {
      if (player.lives > 0 || player.isPremium) {
        setScreen('office-hub');
      } else {
        setScreen('no-lives');
      }
    } else {
      setScreen('auth');
    }
  };

  const featureItems = [
    { icon: '🎮', text: '13 Real-World Levels' },
    { icon: '🤖', text: 'AI-Powered Feedback' },
    { icon: '📁', text: 'Portfolio Builder' },
    { icon: '🏆', text: 'Certificate' }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Top controls */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
        <ThemeToggle />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            toggleMusic();
            playSfx('click');
          }}
          className="p-3 glass-card rounded-xl text-muted-foreground hover:text-foreground transition-colors"
        >
          {isMusicPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Player Lives Display */}
      {player && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-6 left-6 flex items-center gap-2 glass-card rounded-xl px-4 py-2 z-20"
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
                className={`w-5 h-5 transition-all ${i < player.lives
                  ? 'text-red-500 fill-red-500'
                  : 'text-muted-foreground/30'
                  }`}
              />
            </motion.div>
          ))}
          {player.achievements && player.achievements.length > 0 && (
            <div className="ml-2 pl-2 border-l border-border flex items-center gap-1">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{player.achievements.length}</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Logo Mark */}
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-24 h-24 rounded-3xl bg-gradient-gold flex items-center justify-center shadow-lg relative"
            animate={{
              boxShadow: [
                '0 0 30px hsla(38, 92%, 50%, 0.3)',
                '0 0 60px hsla(38, 92%, 50%, 0.5)',
                '0 0 30px hsla(38, 92%, 50%, 0.3)'
              ],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-12 h-12 text-primary-foreground" />
            </motion.div>
            <motion.div
              className="absolute inset-0 rounded-3xl bg-gradient-gold blur-xl -z-10"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-5xl md:text-8xl font-black italic mb-4 tracking-tighter uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.span
            className="text-gradient-gold inline-block"
            animate={{
              textShadow: [
                '0 0 20px hsla(38, 92%, 50%, 0)',
                '0 0 30px hsla(38, 92%, 50%, 0.3)',
                '0 0 20px hsla(38, 92%, 50%, 0)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Market
          </motion.span>
          <span className="text-foreground">Craft</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-lg md:text-3xl text-muted-foreground mb-3 font-black uppercase italic tracking-widest opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Master Digital Marketing
        </motion.p>
        <motion.p
          className="text-sm text-muted-foreground/70 mb-12 max-w-lg mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Role-play as a marketing intern at a top tech company.<br />
          Complete real tasks. Get AI feedback. Build a real portfolio.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="glow"
              size="xl"
              onClick={handleStart}
              className="min-w-[240px] text-lg relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -z-10"
                animate={{ x: [-200, 200] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              <Play className="w-6 h-6" />
              {player ? 'Continue Journey' : 'Start Your Career'}
            </Button>
          </motion.div>

          {player && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                playSfx('click');
                setScreen('character-creation');
              }}
              className="text-muted-foreground"
            >
              Start New Game
            </Button>
          )}
        </motion.div>

        {/* Features Preview */}
        <motion.div
          className="mt-16 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {featureItems.map((feature, index) => (
            <motion.div
              key={feature.text}
              className="flex items-center gap-2 glass-card rounded-full px-4 py-2 text-sm text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{
                scale: 1.05,
                backgroundColor: 'rgba(255,255,255,0.08)',
                transition: { duration: 0.2 }
              }}
            >
              <motion.span
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
              >
                {feature.icon}
              </motion.span>
              <span>{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats for returning players */}
        {player && (
          <motion.div
            className="mt-8 flex justify-center gap-6 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">{player.xp}</span> XP
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-medium text-foreground">{player.completedLevels.length}</span> Levels
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Award className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">{player.achievements?.length || 0}</span> Badges
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};
