import React from 'react';
import { motion } from 'framer-motion';
import { CharacterAvatar, AvatarGesture } from './CharacterAvatar';

interface OfficeCharacter {
  id: string;
  npcType: 'manager' | 'designer' | 'analyst' | 'founder' | 'media';
  name: string;
  position: { x: string; y: string };
  gesture: AvatarGesture;
}

const officeCharacters: OfficeCharacter[] = [
  { id: 'sarah', npcType: 'manager', name: 'Sarah', position: { x: '15%', y: '30%' }, gesture: 'presenting' },
  { id: 'marcus', npcType: 'media', name: 'Marcus', position: { x: '75%', y: '25%' }, gesture: 'typing' },
  { id: 'elena', npcType: 'designer', name: 'Elena', position: { x: '25%', y: '65%' }, gesture: 'idle' },
  { id: 'david', npcType: 'analyst', name: 'David', position: { x: '65%', y: '60%' }, gesture: 'nodding' },
];

interface OfficeCharactersProps {
  onCharacterClick?: (id: string) => void;
  activeCharacter?: string;
}

export const OfficeCharacters: React.FC<OfficeCharactersProps> = ({
  onCharacterClick,
  activeCharacter,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {officeCharacters.map((char, index) => (
        <motion.div
          key={char.id}
          className="absolute pointer-events-auto cursor-pointer group"
          style={{ left: char.position.x, top: char.position.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.15, type: 'spring' }}
          whileHover={{ scale: 1.1, zIndex: 10 }}
          onClick={() => onCharacterClick?.(char.id)}
        >
          <CharacterAvatar
            isNpc
            npcType={char.npcType}
            gesture={char.gesture}
            size="md"
            showGlow={activeCharacter === char.id}
          />
          
          {/* Name tooltip */}
          <motion.div
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="glass-card px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap">
              {char.name}
            </div>
          </motion.div>

          {/* Subtle ambient animation */}
          <motion.div
            className="absolute -inset-2 rounded-full bg-primary/5"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
          />
        </motion.div>
      ))}
    </div>
  );
};
