import React, { useState } from 'react';
import { GameLevel } from '@/types/game';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Highlighter, Trash2, CheckCircle2 } from 'lucide-react';

interface MarkupTaskProps {
    level: GameLevel;
    onComplete: (submission: any) => void;
    isEvaluating: boolean;
}

export const MarkupTask: React.FC<MarkupTaskProps> = ({ level, onComplete, isEvaluating }) => {
    const { text = "", targets = [] } = level.taskData || {};
    const [selectedWords, setSelectedWords] = useState<number[]>([]);

    const words = text.split(' ');

    const toggleWord = (index: number) => {
        if (selectedWords.includes(index)) {
            setSelectedWords(selectedWords.filter(i => i !== index));
        } else {
            setSelectedWords([...selectedWords, index]);
        }
    };

    const reset = () => setSelectedWords([]);

    return (
        <div className="p-8 md:p-12 glass-card rounded-[2.5rem] border border-white/5 space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-black italic tracking-tight uppercase flex items-center justify-center gap-3">
                    <Highlighter className="w-6 h-6 text-primary" />
                    Strategic Markup
                </h3>
                <p className="text-muted-foreground text-sm font-medium italic">
                    {level.taskPrompt}
                </p>
            </div>

            <div className="bg-black/40 p-10 rounded-[2rem] border border-white/5 leading-relaxed">
                <div className="flex flex-wrap gap-x-1.5 gap-y-3">
                    {words.map((word: string, i: number) => (
                        <button
                            key={i}
                            onClick={() => toggleWord(i)}
                            className={cn(
                                "text-lg md:text-xl font-medium px-1.5 py-0.5 rounded-lg transition-all border-b-2 border-transparent",
                                selectedWords.includes(i) 
                                    ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(234,179,8,0.2)]" 
                                    : "hover:bg-white/5"
                            )}
                        >
                            {word}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-center gap-4">
                <Button
                    variant="glass"
                    onClick={reset}
                    className="rounded-xl h-12 text-[10px] font-black uppercase tracking-widest"
                >
                    <Trash2 className="w-3 h-3 mr-2" />
                    Clear All
                </Button>
                <Button
                    variant="glow"
                    disabled={isEvaluating || selectedWords.length === 0}
                    onClick={() => onComplete(selectedWords.map(i => words[i]).join(' '))}
                    className="rounded-2xl px-12 h-14 text-xs font-black uppercase tracking-widest"
                >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {isEvaluating ? 'Analyzing...' : 'Finalize Markup'}
                </Button>
            </div>
        </div>
    );
};

