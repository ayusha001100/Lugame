import React, { useMemo, useState } from 'react';
import { GameLevel } from '@/types/game';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2 } from 'lucide-react';

/**
 * High-APM Diagnose primitive:
 * - taskData: { text: string, highlights: Array<{ id: string, label: string, correct: boolean }> }
 * Player taps to mark weak phrases quickly.
 */
export const HighlightTask: React.FC<{
  level: GameLevel;
  onComplete: (submission: any) => void;
  isEvaluating: boolean;
}> = ({ level, onComplete, isEvaluating }) => {
  const items = useMemo(() => (level.taskData?.highlights || []) as Array<{ id: string; label: string; correct?: boolean }>, [level]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }));

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-[2rem] p-8 bg-gradient-to-br from-primary/5 to-transparent border-border relative overflow-hidden shadow-xl"
      >
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Sparkles className="w-16 h-16 text-primary" />
        </div>
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary/80 mb-4 tracking-widest">Diagnose</h3>
        <p className="text-lg font-black italic tracking-tight leading-relaxed text-foreground">
          {level.taskPrompt}
        </p>
      </motion.div>

      <div className="glass-card rounded-[2rem] p-8 border border-border bg-muted/30 shadow-inner">
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-6">Analyze and tap to mark weak phrases</p>
        <div className="flex flex-wrap gap-3">
          {items.map((h) => {
            const isOn = !!selected[h.id];
            return (
              <button
                key={h.id}
                onClick={() => toggle(h.id)}
                className={cn(
                  "px-5 py-2.5 rounded-2xl border-2 text-sm font-black italic transition-all duration-300 shadow-sm",
                  isOn 
                    ? "bg-destructive/10 border-destructive text-destructive shadow-destructive/10 scale-105" 
                    : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                )}
              >
                {h.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <Button
          variant="glow"
          size="xl"
          disabled={isEvaluating}
          onClick={() => onComplete({ selected: Object.keys(selected).filter((k) => selected[k]) })}
          className="min-w-[280px] h-16 rounded-[2rem] shadow-2xl"
        >
          <CheckCircle2 className="w-5 h-5 mr-3" />
          Lock Diagnosis
        </Button>
      </div>
    </div>
  );
};


