import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CharacterAvatar, AvatarExpression, AvatarGesture } from './CharacterAvatar';

interface NPCDialogueBoxProps {
  npcName: string;
  npcRole: string;
  npcType: 'manager' | 'designer' | 'analyst' | 'founder' | 'media';
  dialogue: string;
  dialogueIndex: number;
  totalDialogues: number;
  onContinue: () => void;
  isLastDialogue: boolean;
}

// Map dialogue patterns to expressions
const getExpressionFromDialogue = (text: string, index: number): AvatarExpression => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('welcome') || lowerText.includes('great') || lowerText.includes('excellent')) return 'happy';
  if (lowerText.includes('need') || lowerText.includes('task') || lowerText.includes('want')) return 'serious';
  if (lowerText.includes('think') || lowerText.includes('consider') || lowerText.includes('remember')) return 'thinking';
  if (lowerText.includes('!') || lowerText.includes('prove') || lowerText.includes('show')) return 'excited';
  if (index === 0) return 'encouraging';
  return 'neutral';
};

// Map dialogue patterns to gestures
const getGestureFromDialogue = (text: string, index: number, total: number): AvatarGesture => {
  const lowerText = text.toLowerCase();
  if (index === 0) return 'waving';
  if (lowerText.includes('your task') || lowerText.includes('i need')) return 'pointing';
  if (lowerText.includes('show') || lowerText.includes('design') || lowerText.includes('create')) return 'presenting';
  if (index === total - 1) return 'nodding';
  return 'idle';
};

export const NPCDialogueBox: React.FC<NPCDialogueBoxProps> = ({
  npcName,
  npcRole,
  npcType,
  dialogue,
  dialogueIndex,
  totalDialogues,
  onContinue,
  isLastDialogue,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const expression = getExpressionFromDialogue(dialogue, dialogueIndex);
  const gesture = getGestureFromDialogue(dialogue, dialogueIndex, totalDialogues);

  // Typewriter effect
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;
    const timer = setInterval(() => {
      if (index < dialogue.length) {
        setDisplayedText(dialogue.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 25);
    return () => clearInterval(timer);
  }, [dialogue]);

  const handleClick = () => {
    if (isTyping) {
      setDisplayedText(dialogue);
      setIsTyping(false);
    } else {
      onContinue();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 max-w-2xl mx-auto"
    >
      {/* NPC Header */}
      <div className="flex items-center gap-4 mb-6">
        <CharacterAvatar
          isNpc
          npcType={npcType}
          expression={expression}
          gesture={gesture}
          size="lg"
          showGlow={dialogueIndex === 0}
        />
        <div className="flex-1">
          <motion.h3 
            className="font-semibold text-lg"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            key={npcName}
          >
            {npcName}
          </motion.h3>
          <p className="text-sm text-muted-foreground">{npcRole}</p>
        </div>
        
        {/* Expression badge */}
        <motion.div
          key={expression}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium capitalize"
        >
          {expression}
        </motion.div>
      </div>

      {/* Dialogue Text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={dialogueIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="dialogue-bubble relative"
        >
          <p className="text-lg leading-relaxed min-h-[4rem]">
            {displayedText}
            {isTyping && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-0.5 h-5 bg-primary ml-0.5 align-middle"
              />
            )}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Progress and Continue */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex gap-1.5">
          {Array.from({ length: totalDialogues }).map((_, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                scale: i === dialogueIndex ? 1.2 : 1,
                backgroundColor: i <= dialogueIndex ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
              }}
              className="w-2.5 h-2.5 rounded-full"
            />
          ))}
        </div>

        <motion.button
          onClick={handleClick}
          className={cn(
            'px-6 py-2.5 rounded-xl font-semibold transition-all',
            'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground',
            'hover:shadow-lg hover:shadow-primary/25 hover:scale-105',
            'flex items-center gap-2'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isTyping ? (
            'Skip'
          ) : isLastDialogue ? (
            <>
              Start Task
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                →
              </motion.span>
            </>
          ) : (
            <>
              Continue
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                →
              </motion.span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};
