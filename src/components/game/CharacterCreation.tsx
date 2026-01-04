import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AVATAR_STYLES } from '@/data/levels';
import { Player } from '@/types/game';
import { ArrowLeft, ArrowRight, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type Gender = 'male' | 'female' | 'neutral';

const genderOptions: { value: Gender; label: string; icon: string }[] = [
  { value: 'male', label: 'He/Him', icon: '👨‍💼' },
  { value: 'female', label: 'She/Her', icon: '👩‍💼' },
  { value: 'neutral', label: 'They/Them', icon: '🧑‍💼' },
];

export const CharacterCreation: React.FC = () => {
  const { setPlayer, setScreen } = useGameStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('neutral');
  const [avatarStyle, setAvatarStyle] = useState(1);

  const handleComplete = () => {
    const player: Player = {
      id: crypto.randomUUID(),
      name,
      gender,
      avatarStyle,
      xp: 0,
      level: 1,
      completedLevels: [],
      portfolio: [],
      createdAt: new Date(),
      lives: 3,
      maxLives: 3,
      lastLifeLostAt: null,
      isPremium: false,
      premiumExpiresAt: null,
      achievements: [],
      hasSeenTutorial: false,
      dailyData: null,
      streakData: {
        currentStreak: 0,
        longestStreak: 0,
        lastLoginDate: null,
        streakXpClaimed: false,
      },
    };
    setPlayer(player);
    setScreen('office-hub');
  };

  const canProceed = step === 1 ? name.trim().length >= 2 : true;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      {/* Back Button */}
      <button
        onClick={() => step > 1 ? setStep(step - 1) : setScreen('splash')}
        className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Progress Indicator */}
      <div className="absolute top-6 right-6 flex gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={cn(
              'w-8 h-1 rounded-full transition-all duration-300',
              s <= step ? 'bg-primary' : 'bg-muted'
            )}
          />
        ))}
      </div>

      {/* Content */}
      <div className="w-full max-w-md animate-fade-up">
        {step === 1 && (
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-8 shadow-lg">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-2">What's your name?</h2>
            <p className="text-muted-foreground mb-8">This will appear on your certificate and portfolio</p>
            
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="text-center text-lg h-14 bg-card border-border focus:border-primary"
              maxLength={30}
            />
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Choose your pronouns</h2>
            <p className="text-muted-foreground mb-8">NPCs will refer to you accordingly</p>
            
            <div className="grid grid-cols-3 gap-4">
              {genderOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setGender(option.value)}
                  className={cn(
                    'glass-card rounded-2xl p-6 transition-all duration-300',
                    gender === option.value
                      ? 'ring-2 ring-primary bg-primary/10'
                      : 'hover:bg-white/5'
                  )}
                >
                  <div className="text-4xl mb-3">{option.icon}</div>
                  <div className="text-sm font-medium">{option.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Select your style</h2>
            <p className="text-muted-foreground mb-8">How would you like to present yourself?</p>
            
            <div className="grid grid-cols-2 gap-4">
              {AVATAR_STYLES[gender].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setAvatarStyle(style.id)}
                  className={cn(
                    'glass-card rounded-2xl p-6 transition-all duration-300',
                    avatarStyle === style.id
                      ? 'ring-2 ring-primary bg-primary/10'
                      : 'hover:bg-white/5'
                  )}
                >
                  <div 
                    className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl"
                    style={{ 
                      background: `linear-gradient(135deg, ${style.colors[0]}, ${style.colors[1]})` 
                    }}
                  >
                    {genderOptions.find(g => g.value === gender)?.icon}
                  </div>
                  <div className="text-sm font-medium">{style.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="mt-10 flex justify-center">
          {step < 3 ? (
            <Button
              variant="premium"
              size="lg"
              onClick={() => setStep(step + 1)}
              disabled={!canProceed}
              className="min-w-[160px]"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="glow"
              size="xl"
              onClick={handleComplete}
              className="min-w-[200px]"
            >
              <Sparkles className="w-5 h-5" />
              Begin Journey
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
