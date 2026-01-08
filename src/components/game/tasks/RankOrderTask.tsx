import React, { useState } from 'react';
import { GameLevel } from '@/types/game';
import { Button } from '@/components/ui/button';
import { motion, Reorder } from 'framer-motion';
import { GripVertical, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence } from 'framer-motion';

interface RankOrderTaskProps {
    level: GameLevel;
    onComplete: (submission: any) => void;
    isEvaluating: boolean;
}

export const RankOrderTask: React.FC<RankOrderTaskProps> = ({ level, onComplete, isEvaluating }) => {
    const [showHints, setShowHints] = useState(false);
    const [items, setItems] = useState<string[]>(() => {
        const initial = [...(level.taskData?.items || [])];
        // Fisher-Yates shuffle
        for (let i = initial.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [initial[i], initial[j]] = [initial[j], initial[i]];
        }
        return initial;
    });

    return (
        <div className="p-8 md:p-12 glass-card rounded-[2.5rem] border border-white/5 space-y-8 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-black italic tracking-tight uppercase">Strategic Prioritization</h3>
                <p className="text-muted-foreground text-sm font-medium">Drag and reorder the elements based on impact weight.</p>
            </div>

            <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3">
                {items.map((item) => (
                    <Reorder.Item
                        key={item}
                        value={item}
                        className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 cursor-grab active:cursor-grabbing transition-colors flex items-center gap-4 group"
                    >
                        <GripVertical className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-sm font-bold italic">{item}</span>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <div className="pt-4 flex flex-col items-center gap-6">
                <button
                    onClick={() => setShowHints(!showHints)}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-full hover:bg-white/5"
                >
                    <Lightbulb className={cn("w-4 h-4", showHints && "text-primary")} />
                    {showHints ? 'Hide Strategic Intel' : 'Reveal Intel'}
                </button>

                <Button
                    variant="glow"
                    size="xl"
                    disabled={isEvaluating}
                    onClick={() => onComplete(items)}
                    className="rounded-2xl px-12 h-16 text-sm font-black uppercase tracking-widest min-w-[280px]"
                >
                    {isEvaluating ? 'Evaluating...' : 'Confirm Strategy'}
                </Button>

                {/* Hints Section */}
                <AnimatePresence>
                    {showHints && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="w-full overflow-hidden"
                        >
                            <div className="grid gap-3 pt-4 text-left">
                                {(level.taskHints && level.taskHints.length > 0 ? level.taskHints : [
                                    "Sequential Logic: Some actions MUST happen before others. Identify the foundational step.",
                                    "Impact vs. Effort: Rank items based on their immediate ability to move the primary KPI.",
                                    "Dependency Check: Does Option B require Option A to be completed first?",
                                    "Strategic Focus: Prioritize the item that addresses the specific problem SARAH mentioned.",
                                    "Red Herring Detection: Look for items that sound urgent but aren't actually important for this mission."
                                ]).map((hint, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-3 italic">
                                        <span className="text-primary font-black">#0{i + 1}</span>
                                        <span className="text-sm text-muted-foreground">{hint}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
