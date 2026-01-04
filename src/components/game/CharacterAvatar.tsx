import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export type AvatarExpression = 'neutral' | 'happy' | 'thinking' | 'excited' | 'serious' | 'encouraging';
export type AvatarGesture = 'idle' | 'waving' | 'pointing' | 'nodding' | 'presenting' | 'typing';

interface CharacterAvatarProps {
  gender?: 'male' | 'female' | 'other';
  style?: 'professional' | 'creative' | 'executive' | 'casual';
  expression?: AvatarExpression;
  gesture?: AvatarGesture;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isNpc?: boolean;
  npcType?: 'manager' | 'designer' | 'analyst' | 'founder' | 'media';
  className?: string;
  showGlow?: boolean;
  enableMicroAnimations?: boolean;
}

const npcAvatars: Record<string, { emoji: string; color: string; name: string }> = {
  manager: { emoji: '👩‍💼', color: 'from-violet-500 to-purple-600', name: 'Sarah' },
  designer: { emoji: '👩‍🎨', color: 'from-pink-500 to-rose-600', name: 'Elena' },
  analyst: { emoji: '👨‍💻', color: 'from-blue-500 to-cyan-600', name: 'David' },
  founder: { emoji: '🧑‍💼', color: 'from-amber-500 to-orange-600', name: 'Alex' },
  media: { emoji: '👨‍📈', color: 'from-green-500 to-emerald-600', name: 'Marcus' },
};

const sizeClasses = {
  sm: 'w-12 h-12 text-xl',
  md: 'w-16 h-16 text-2xl',
  lg: 'w-20 h-20 text-3xl',
  xl: 'w-28 h-28 text-5xl',
};

const gestureAnimations: Record<AvatarGesture, any> = {
  idle: {
    y: [0, -3, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
  waving: {
    rotate: [0, 14, -8, 14, 0],
    transition: { duration: 0.8, repeat: Infinity, repeatDelay: 2 },
  },
  pointing: {
    x: [0, 5, 0],
    transition: { duration: 0.6, repeat: Infinity, repeatDelay: 1.5 },
  },
  nodding: {
    y: [0, 4, 0],
    transition: { duration: 0.4, repeat: Infinity, repeatDelay: 2 },
  },
  presenting: {
    scale: [1, 1.05, 1],
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
  },
  typing: {
    y: [0, -2, 0, -2, 0],
    transition: { duration: 0.3, repeat: Infinity },
  },
};

// Breathing animation - subtle scale
const breathingAnimation = {
  scale: [1, 1.02, 1],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

// Blinking animation - opacity change on eyes area
const blinkingAnimation = {
  scaleY: [1, 0.1, 1],
  transition: {
    duration: 0.15,
    repeat: Infinity,
    repeatDelay: 3 + Math.random() * 2, // Random blink interval
    ease: 'easeInOut',
  },
};

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  gender = 'other',
  style = 'professional',
  expression = 'neutral',
  gesture = 'idle',
  size = 'md',
  isNpc = false,
  npcType = 'manager',
  className,
  showGlow = false,
  enableMicroAnimations = true,
}) => {
  const getPlayerAvatar = () => {
    const styleEmojis: Record<string, Record<string, string>> = {
      professional: { male: '👨‍💼', female: '👩‍💼', other: '🧑‍💼' },
      creative: { male: '👨‍🎨', female: '👩‍🎨', other: '🧑‍🎨' },
      executive: { male: '🤵', female: '👰', other: '🧑‍💼' },
      casual: { male: '🧑', female: '👩', other: '🧑' },
    };
    return styleEmojis[style]?.[gender] || '🧑‍💼';
  };

  const npc = npcAvatars[npcType];
  const avatar = isNpc ? npc.emoji : getPlayerAvatar();
  const gradientClass = isNpc ? npc.color : 'from-primary/80 to-primary';

  return (
    <motion.div
      className={cn(
        'relative rounded-2xl flex items-center justify-center shadow-xl overflow-hidden',
        `bg-gradient-to-br ${gradientClass}`,
        sizeClasses[size],
        showGlow && 'ring-4 ring-primary/30 animate-pulse-glow',
        className
      )}
      animate={gestureAnimations[gesture]}
    >
      {/* Breathing container */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={enableMicroAnimations ? breathingAnimation : undefined}
      >
        {/* Background gradient overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/30 to-transparent" />
        
        {/* Inner glow effect */}
        <motion.div
          className="absolute inset-1 rounded-xl bg-white/5"
          animate={{
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Avatar with blinking effect */}
        <motion.div className="relative z-10 flex items-center justify-center">
          {/* Main avatar */}
          <motion.span 
            className="drop-shadow-lg relative"
            animate={{
              scale: expression === 'excited' ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.5, repeat: expression === 'excited' ? Infinity : 0 }}
          >
            {avatar}
          </motion.span>

          {/* Blink overlay - simulates eye closing */}
          {enableMicroAnimations && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 0.15,
                repeat: Infinity,
                repeatDelay: 3 + Math.random() * 2,
                times: [0, 0.5, 1],
              }}
            >
              <div 
                className="w-full h-[15%] bg-gradient-to-b from-transparent via-black/40 to-transparent"
                style={{ marginTop: '-10%' }}
              />
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Subtle shadow beneath avatar */}
      <motion.div
        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2/3 h-2 rounded-full bg-black/20 blur-sm"
        animate={enableMicroAnimations ? {
          scaleX: [1, 0.9, 1],
          opacity: [0.2, 0.15, 0.2],
        } : undefined}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Expression indicator badge */}
      {expression !== 'neutral' && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-card border-2 border-border flex items-center justify-center text-xs shadow-lg z-20"
        >
          {expression === 'happy' && '😊'}
          {expression === 'thinking' && '🤔'}
          {expression === 'excited' && '😄'}
          {expression === 'serious' && '😤'}
          {expression === 'encouraging' && '🙂'}
        </motion.div>
      )}

      {/* Gesture particle effects */}
      {gesture === 'presenting' && (
        <>
          <motion.div
            className="absolute w-1.5 h-1.5 rounded-full bg-primary z-20"
            animate={{ x: [-20, -30], y: [-10, -20], opacity: [1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-1.5 h-1.5 rounded-full bg-primary z-20"
            animate={{ x: [20, 30], y: [-10, -20], opacity: [1, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
          />
        </>
      )}

      {/* Ambient glow pulse */}
      {showGlow && (
        <motion.div
          className="absolute -inset-2 rounded-3xl bg-primary/20 -z-10"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </motion.div>
  );
};
