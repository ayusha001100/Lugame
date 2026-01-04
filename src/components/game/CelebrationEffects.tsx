import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
  type: 'confetti' | 'star' | 'circle';
}

interface CelebrationEffectsProps {
  isActive: boolean;
  intensity?: 'low' | 'medium' | 'high';
  duration?: number;
}

const colors = [
  '#F59E0B', // amber
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#10B981', // emerald
  '#3B82F6', // blue
  '#F97316', // orange
  '#FFD700', // gold
];

const shapes = ['confetti', 'star', 'circle'] as const;

export const CelebrationEffects: React.FC<CelebrationEffectsProps> = ({
  isActive,
  intensity = 'high',
  duration = 4000,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showEffects, setShowEffects] = useState(false);

  const particleCount = intensity === 'high' ? 60 : intensity === 'medium' ? 40 : 20;

  useEffect(() => {
    if (isActive) {
      setShowEffects(true);
      
      // Generate particles
      const newParticles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: -10 - Math.random() * 20,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 8 + Math.random() * 12,
          rotation: Math.random() * 360,
          velocityX: (Math.random() - 0.5) * 4,
          velocityY: 2 + Math.random() * 3,
          type: shapes[Math.floor(Math.random() * shapes.length)],
        });
      }
      setParticles(newParticles);

      // Clear after duration
      const timer = setTimeout(() => {
        setShowEffects(false);
        setParticles([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isActive, particleCount, duration]);

  const renderParticleShape = (particle: Particle) => {
    switch (particle.type) {
      case 'star':
        return (
          <svg viewBox="0 0 24 24" fill={particle.color} width={particle.size} height={particle.size}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      case 'circle':
        return (
          <div
            style={{
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              backgroundColor: particle.color,
            }}
          />
        );
      default: // confetti
        return (
          <div
            style={{
              width: particle.size,
              height: particle.size * 0.6,
              backgroundColor: particle.color,
              borderRadius: 2,
            }}
          />
        );
    }
  };

  return (
    <AnimatePresence>
      {showEffects && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute"
              initial={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                rotate: particle.rotation,
                opacity: 1,
              }}
              animate={{
                top: '110%',
                left: `${particle.x + particle.velocityX * 30}%`,
                rotate: particle.rotation + 720,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 2.5 + Math.random() * 1.5,
                ease: 'easeOut',
              }}
              exit={{ opacity: 0 }}
            >
              {renderParticleShape(particle)}
            </motion.div>
          ))}

          {/* Central burst effect */}
          <motion.div
            className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 2], opacity: [1, 0.5, 0] }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="w-40 h-40 rounded-full bg-gradient-radial from-primary/40 to-transparent" />
          </motion.div>

          {/* Sparkle bursts */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute left-1/2 top-1/3"
              initial={{ 
                x: 0, 
                y: 0, 
                scale: 0, 
                opacity: 1 
              }}
              animate={{ 
                x: Math.cos((i * Math.PI * 2) / 8) * 150,
                y: Math.sin((i * Math.PI * 2) / 8) * 150,
                scale: [0, 1.5, 0],
                opacity: [1, 1, 0],
              }}
              transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            >
              <div className="w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/50" />
            </motion.div>
          ))}

          {/* Success text animation */}
          <motion.div
            className="absolute left-1/2 top-1/4 -translate-x-1/2 text-center"
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: [0, 1.2, 1], opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-6xl">🎉</span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Smaller inline celebration for XP gains
export const XPBurstEffect: React.FC<{ xp: number; isActive: boolean }> = ({ xp, isActive }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* XP particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 text-primary font-bold text-sm"
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((i * Math.PI * 2) / 12) * 80,
                y: Math.sin((i * Math.PI * 2) / 12) * 80,
                opacity: 0,
                scale: 0.5,
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              +{Math.floor(xp / 12)}
            </motion.div>
          ))}
          
          {/* Central XP display */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ duration: 0.4 }}
          >
            <div className="px-6 py-3 rounded-full bg-gradient-gold text-primary-foreground font-bold text-2xl shadow-xl">
              +{xp} XP
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
