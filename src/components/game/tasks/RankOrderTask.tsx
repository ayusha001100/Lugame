import React, { useState } from 'react';
import { GameLevel } from '@/types/game';
import { Button } from '@/components/ui/button';
import { motion, Reorder } from 'framer-motion';
import { GripVertical } from 'lucide-react';

interface RankOrderTaskProps {
    level: GameLevel;
    onComplete: (submission: any) => void;
    isEvaluating: boolean;
}

export const RankOrderTask: React.FC<RankOrderTaskProps> = ({ level, onComplete, isEvaluating }) => {
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

            <div className="pt-4 flex justify-center">
                <Button
                    variant="glow"
                    size="xl"
                    disabled={isEvaluating}
                    onClick={() => onComplete(items)}
                    className="rounded-2xl px-12 h-16 text-sm font-black uppercase tracking-widest"
                >
                    {isEvaluating ? 'Evaluating...' : 'Confirm Strategy'}
                </Button>
            </div>
        </div>
    );
};
