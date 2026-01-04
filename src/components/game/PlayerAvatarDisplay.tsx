import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { CharacterAvatar, AvatarExpression, AvatarGesture } from './CharacterAvatar';
import { Crown } from 'lucide-react';

const getAvatarStyleName = (styleNum: number): 'professional' | 'creative' | 'executive' | 'casual' => {
  const styles: Record<number, 'professional' | 'creative' | 'executive' | 'casual'> = {
    0: 'professional',
    1: 'creative',
    2: 'executive',
    3: 'casual',
  };
  return styles[styleNum] || 'professional';
};

interface PlayerAvatarDisplayProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  expression?: AvatarExpression;
  gesture?: AvatarGesture;
  showStats?: boolean;
  showName?: boolean;
  className?: string;
}

export const PlayerAvatarDisplay: React.FC<PlayerAvatarDisplayProps> = ({
  size = 'md',
  expression = 'neutral',
  gesture = 'idle',
  showStats = false,
  showName = true,
  className,
}) => {
  const { player } = useGameStore();

  if (!player) return null;

  return (
    <motion.div
      className={`flex items-center gap-4 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="relative">
        <CharacterAvatar
          gender={player.gender === 'neutral' ? 'other' : player.gender}
          style={getAvatarStyleName(player.avatarStyle)}
          expression={expression}
          gesture={gesture}
          size={size}
          showGlow={player.isPremium}
        />
        
        {/* Level badge */}
        {showStats && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-gold flex items-center justify-center text-xs font-bold shadow-lg border-2 border-card"
          >
            {player.level}
          </motion.div>
        )}
      </div>

      {showName && (
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{player.name}</h3>
            {player.isPremium && (
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="w-4 h-4 text-primary" />
              </motion.div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">Marketing Intern at NovaTech</p>
          
          {showStats && (
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-primary font-medium">{player.xp.toLocaleString()} XP</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{player.completedLevels.length} completed</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
