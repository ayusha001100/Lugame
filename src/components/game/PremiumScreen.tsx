import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import { Crown, Check, ArrowLeft, Sparkles, Zap, Heart, Star } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';

export const PremiumScreen: React.FC = () => {
  const { setScreen, setPremium } = useGameStore();
  const { playSfx } = useAudio();

  const handleUpgrade = () => {
    // In a real app, this would trigger Stripe checkout
    playSfx('levelUp');
    setPremium(true, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // 30 days
    setScreen('office-hub');
  };

  const features = [
    { icon: Heart, text: 'Unlimited Lives', desc: 'Never wait to play again' },
    { icon: Zap, text: 'All 10 Levels', desc: 'Access premium challenges' },
    { icon: Star, text: 'Deeper AI Feedback', desc: 'More detailed evaluations' },
    { icon: Sparkles, text: 'Portfolio Polish', desc: 'Export-ready portfolio' },
  ];

  return (
    <div className="min-h-screen p-6 md:p-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/10 to-transparent rounded-full" />
      </div>

      {/* Back Button */}
      <Button
        variant="glass"
        size="icon"
        onClick={() => {
          playSfx('click');
          setScreen('office-hub');
        }}
        className="relative z-10"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>

      <div className="relative z-10 max-w-lg mx-auto mt-8 text-center animate-fade-up">
        {/* Premium Badge */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse-glow">
          <Crown className="w-10 h-10 text-primary-foreground" />
        </div>

        <h1 className="text-4xl font-bold mb-3">
          <span className="text-gradient-gold">MarketCraft</span> Premium
        </h1>
        <p className="text-muted-foreground mb-8">
          Unlock your full potential with unlimited access
        </p>

        {/* Pricing Card */}
        <div className="glass-card rounded-3xl p-8 mb-8 border-2 border-primary/30">
          <div className="flex items-baseline justify-center gap-1 mb-6">
            <span className="text-5xl font-bold text-gradient-gold">$19</span>
            <span className="text-muted-foreground">/month</span>
          </div>

          <div className="space-y-4 text-left mb-8">
            {features.map((feature) => (
              <div key={feature.text} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <feature.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{feature.text}</p>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="glow"
            size="xl"
            className="w-full"
            onClick={handleUpgrade}
          >
            <Crown className="w-5 h-5" />
            Upgrade Now
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            Cancel anytime. 7-day money-back guarantee.
          </p>
        </div>

        {/* Comparison */}
        <div className="glass-card rounded-2xl p-6 text-left">
          <h3 className="font-semibold mb-4 text-center">Free vs Premium</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-muted-foreground">Feature</div>
            <div className="text-center">Free</div>
            <div className="text-center text-primary font-medium">Premium</div>
            
            <div className="text-muted-foreground">Lives</div>
            <div className="text-center">3 per day</div>
            <div className="text-center text-primary">Unlimited</div>
            
            <div className="text-muted-foreground">Levels</div>
            <div className="text-center">3</div>
            <div className="text-center text-primary">All 10</div>
            
            <div className="text-muted-foreground">AI Feedback</div>
            <div className="text-center">Basic</div>
            <div className="text-center text-primary">Advanced</div>
            
            <div className="text-muted-foreground">Portfolio Export</div>
            <div className="text-center">—</div>
            <div className="text-center"><Check className="w-4 h-4 text-primary mx-auto" /></div>
          </div>
        </div>
      </div>
    </div>
  );
};
