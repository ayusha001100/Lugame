import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import { Heart, Clock, Crown, Sparkles } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';

export const NoLivesScreen: React.FC = () => {
  const { player, setScreen, getTimeUntilNextLife, checkLivesRegen } = useGameStore();
  const { playSfx } = useAudio();
  const [timeLeft, setTimeLeft] = useState(getTimeUntilNextLife());

  useEffect(() => {
    const interval = setInterval(() => {
      checkLivesRegen();
      const newTime = getTimeUntilNextLife();
      setTimeLeft(newTime);
      
      if (player && player.lives > 0) {
        playSfx('success');
        setScreen('office-hub');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [checkLivesRegen, getTimeUntilNextLife, player, setScreen, playSfx]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-red-500/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 text-center max-w-md animate-fade-up">
        {/* Hearts Display */}
        <div className="flex justify-center gap-3 mb-8">
          {[...Array(3)].map((_, i) => (
            <Heart
              key={i}
              className="w-12 h-12 text-muted-foreground/20"
            />
          ))}
        </div>

        <h1 className="text-4xl font-bold mb-4">Out of Lives!</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          You've used all your attempts for today. Lives regenerate over time, or you can unlock unlimited attempts with Premium.
        </p>

        {/* Timer */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Next life in</span>
          </div>
          <div className="text-4xl font-mono font-bold text-gradient-gold">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Button
            variant="glow"
            size="xl"
            className="w-full"
            onClick={() => {
              playSfx('click');
              setScreen('premium');
            }}
          >
            <Crown className="w-5 h-5" />
            Unlock Premium
          </Button>

          <Button
            variant="glass"
            size="lg"
            className="w-full"
            onClick={() => {
              playSfx('click');
              setScreen('portfolio');
            }}
          >
            View Your Portfolio
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              playSfx('click');
              setScreen('splash');
            }}
          >
            Back to Menu
          </Button>
        </div>

        {/* Premium Benefits */}
        <div className="mt-12 text-left">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 text-center">
            Premium Benefits
          </h3>
          <div className="space-y-3">
            {[
              { icon: '♾️', text: 'Unlimited Lives' },
              { icon: '🧠', text: 'Deeper AI Feedback' },
              { icon: '📊', text: 'Portfolio Insights' },
              { icon: '🎯', text: 'All 10 Levels Unlocked' },
            ].map((benefit) => (
              <div key={benefit.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="text-lg">{benefit.icon}</span>
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
