import React, { useState } from 'react';
import { GameLevel } from '@/types/game';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Send, Sparkles, Lightbulb } from 'lucide-react';

interface MCQTaskProps {
    level: GameLevel;
    onComplete: (submission: string | string[]) => void;
    isEvaluating: boolean;
}

export const MCQTask: React.FC<MCQTaskProps> = ({ level, onComplete, isEvaluating }) => {
    const [selected, setSelected] = useState<string[]>([]);
    const [showHints, setShowHints] = useState(false);
    const isMulti = level.taskType === 'multi-select';
    const options = level.taskData?.options || [];

    const handleSelect = (option: string) => {
        if (isMulti) {
            setSelected(prev =>
                prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
            );
        } else {
            setSelected([option]);
        }
    };

    return (
        <div className="space-y-8">
            {/* Question Brief */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-[2rem] p-8 bg-gradient-to-br from-primary/5 to-transparent border-white/5 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Sparkles className="w-16 h-16" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary/80 mb-4">Strategic Decision</h3>
                <p className="text-2xl font-black italic tracking-tight leading-tight">
                    {level.taskPrompt}
                </p>
            </motion.div>

            {/* Options Grid (MODULE 4) */}
            <div className="grid gap-4">
                {options.map((option: string, idx: number) => {
                    const isSelected = selected.includes(option);
                    return (
                        <motion.button
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => handleSelect(option)}
                            className={cn(
                                "w-full p-6 rounded-[2rem] border-2 text-left transition-all duration-300 relative group overflow-hidden flex items-center gap-6",
                                isSelected
                                    ? "bg-primary/10 border-primary shadow-[0_0_30px_rgba(234,179,8,0.15)]"
                                    : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10"
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                isSelected ? "bg-primary text-primary-foreground" : "bg-white/10 text-muted-foreground"
                            )}>
                                {isSelected ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-5 h-5 opacity-20" />}
                            </div>

                            <div className="flex-1">
                                <span className={cn(
                                    "text-lg font-bold transition-all",
                                    isSelected ? "text-foreground" : "text-muted-foreground"
                                )}>
                                    {option}
                                </span>
                            </div>

                            {/* Decorative Index */}
                            <div className="text-[10px] font-black opacity-20 absolute top-4 right-8">
                                ENTRY #0{idx + 1}
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Submit Section */}
            <div className="flex flex-col items-center gap-6 pt-8">
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
                    onClick={() => onComplete(isMulti ? selected : selected[0])}
                    disabled={selected.length === 0 || isEvaluating}
                    className="min-w-[300px] h-20 rounded-[2.5rem] shadow-2xl group text-xl font-black italic"
                >
                    {isEvaluating ? "SYNCHRONIZING..." : "LOG DECISION"}
                    <Send className="w-6 h-6 ml-4 group-hover:translate-x-2 transition-transform" />
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
                            <div className="grid md:grid-cols-2 gap-4 pt-4">
                                {(level.taskHints && level.taskHints.length > 0 ? level.taskHints : [
                                    "Analyze the psychological drivers: Identify if the audience is motivated by 'loss' or 'gain'.",
                                    "Check NPC Alignment: Ensure your decision priorities speed and scalability.",
                                    "Evaluate the long-term impact of this decision on the overall acquisition funnel.",
                                    "Data-Driven Logic: Look for the specific performance target mentioned in the brief.",
                                    "Calibrate terminology: Focus on terms that demonstrate strategic maturity."
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
