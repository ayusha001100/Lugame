import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CharacterAvatar, AvatarExpression, AvatarGesture } from './CharacterAvatar';
import { DialogueNode, DialogueOption } from '@/types/game';
import { useGameStore } from '@/store/gameStore';
import { useAudio } from '@/hooks/useAudio';

interface NPCDialogueBoxProps {
  npcName: string;
  npcRole: string;
  npcType: 'manager' | 'designer' | 'analyst' | 'founder' | 'media';
  node: DialogueNode;
  onChoice: (option: DialogueOption) => void;
  onContinue: () => void;
  isLast: boolean;
}

const getExpressionFromNode = (node: DialogueNode): AvatarExpression => {
  if (node.emotion) return node.emotion as AvatarExpression;
  const lowerText = node.text.toLowerCase();
  if (lowerText.includes('welcome') || lowerText.includes('great')) return 'happy';
  if (lowerText.includes('need') || lowerText.includes('task')) return 'serious';
  if (lowerText.includes('think')) return 'thinking';
  return 'neutral';
};

export const NPCDialogueBox: React.FC<NPCDialogueBoxProps> = ({
  npcName,
  npcRole,
  npcType,
  node,
  onChoice,
  onContinue,
  isLast,
}) => {
  const { updateTrust, updatePlayer, player } = useGameStore();
  const { playSfx } = useAudio();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const expression = getExpressionFromNode(node);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;
    const timer = setInterval(() => {
      if (index < node.text.length) {
        setDisplayedText(node.text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [node]);

  const handleOptionClick = (option: DialogueOption) => {
    playSfx('click');
    if (option.impact) {
      if (option.impact.trust) {
        const affectedNpc = npcType === 'founder' ? 'founder' : (npcType === 'designer' ? 'designer' : 'manager');
        updateTrust(affectedNpc, option.impact.trust);
      }
      if (option.impact.flag && player) {
        updatePlayer({
          worldState: {
            ...player.worldState,
            narrativeFlags: [...player.worldState.narrativeFlags, option.impact.flag]
          }
        });
      }
    }
    onChoice(option);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-[2rem] p-8 max-w-2xl mx-auto border-border shadow-2xl relative overflow-hidden"
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30" />

      {/* NPC Header */}
      <div className="flex items-center gap-6 mb-8">
        <CharacterAvatar
          isNpc
          npcType={npcType}
          expression={expression}
          gesture="idle"
          size="lg"
          showGlow
        />
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-1"
          >
            <h3 className="font-black italic uppercase tracking-tight text-xl">{npcName}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-primary/80">{npcRole}</p>
          </motion.div>
        </div>
      </div>

      {/* Dialogue Text Area */}
      <div className="min-h-[120px] mb-8 relative">
        <motion.div
          key={node.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-medium leading-relaxed text-foreground/90 italic"
        >
          “{displayedText}”
          {isTyping && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-1.5 h-6 bg-primary ml-1 align-middle"
            />
          )}
        </motion.div>
      </div>

      {/* Options or Continue (MODULE 9) */}
      <div className="space-y-3">
        {node.options && !isTyping ? (
          <div className="grid gap-3 animate-fade-up">
            {node.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(option)}
                className="w-full p-4 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/50 hover:bg-primary/5 text-left text-sm font-bold uppercase tracking-wide transition-all group flex items-center justify-between"
              >
                <span>{option.text}</span>
                <div className="w-6 h-6 rounded-full bg-muted/50 group-hover:bg-primary flex items-center justify-center transition-all">
                  <span className="text-[10px] text-white">→</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex justify-end">
            <button
              onClick={() => isTyping ? setDisplayedText(node.text) : onContinue()}
              className={cn(
                "px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-3",
                isTyping
                  ? "bg-muted text-muted-foreground border border-border/50"
                  : "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:scale-105 active:scale-95"
              )}
            >
              {isTyping ? 'Skip' : (isLast ? 'Begin Task' : 'Continue')}
              {!isTyping && <span className="text-lg">→</span>}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
