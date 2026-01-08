import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, RefreshCcw, ArrowRightLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchFollowingTaskProps {
    level: any;
    onComplete: (submission: any) => void;
    isEvaluating: boolean;
}

export const MatchFollowingTask: React.FC<MatchFollowingTaskProps> = ({ level, onComplete, isEvaluating }) => {
    const { taskData, taskPrompt } = level;
    const pairs = taskData.pairs || [];

    const [leftItems, setLeftItems] = useState<string[]>([]);
    const [rightItems, setRightItems] = useState<string[]>([]);
    const [matches, setMatches] = useState<Record<string, string>>({});
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

    useEffect(() => {
        // Shuffle right items to make it a challenge
        const lefts = pairs.map((p: any) => p.left);
        const rights = [...pairs.map((p: any) => p.right)].sort(() => Math.random() - 0.5);
        setLeftItems(lefts);
        setRightItems(rights);
    }, [level]);

    const handleMatch = (left: string, right: string) => {
        setMatches(prev => ({ ...prev, [left]: right }));
        setSelectedLeft(null);
    };

    const handleReset = () => {
        setMatches({});
        setSelectedLeft(null);
    };

    const handleSubmit = () => {
        const submission = leftItems.map(left => ({
            left,
            right: matches[left] || ""
        }));
        onComplete(submission);
    };

    const allMatched = Object.keys(matches).length === leftItems.length;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Strategic Alignment</h3>
                <p className="text-2xl font-black italic uppercase tracking-tight">{taskPrompt}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block opacity-10">
                    <ArrowRightLeft className="w-24 h-24" />
                </div>

                {/* Left Side: Prompts */}
                <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Definitions / Variations</span>
                    {leftItems.map((item) => (
                        <motion.button
                            key={item}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedLeft(item)}
                            className={cn(
                                "w-full p-6 rounded-2xl border-2 text-left transition-all duration-300 relative overflow-hidden",
                                selectedLeft === item ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(234,179,8,0.1)]" :
                                    (matches[item] ? "border-success/50 bg-success/5" : "border-border hover:border-primary/50 bg-card")
                            )}
                        >
                            <p className="font-bold text-sm leading-tight">{item}</p>
                            {matches[item] && (
                                <div className="mt-2 text-[10px] font-black uppercase text-success flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Matched: {matches[item]}
                                </div>
                            )}
                        </motion.button>
                    ))}
                </div>

                {/* Right Side: Targets */}
                <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Intents / Actions</span>
                    {rightItems.map((item) => {
                        const isTargeted = Object.values(matches).includes(item);
                        return (
                            <motion.button
                                key={item}
                                disabled={!selectedLeft || isTargeted}
                                whileHover={selectedLeft && !isTargeted ? { scale: 1.02 } : {}}
                                onClick={() => selectedLeft && handleMatch(selectedLeft, item)}
                                className={cn(
                                    "w-full p-6 rounded-2xl border-2 text-center transition-all duration-300 font-black italic uppercase tracking-wide",
                                    isTargeted ? "opacity-30 border-transparent bg-muted cursor-not-allowed" :
                                        (selectedLeft ? "border-primary/30 hover:border-primary bg-primary/5 cursor-pointer" : "border-border bg-card cursor-not-allowed opacity-60")
                                )}
                            >
                                {item}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
                <Button variant="ghost" onClick={handleReset} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Reset All Pairs
                </Button>

                <Button
                    size="xl"
                    disabled={!allMatched || isEvaluating}
                    onClick={handleSubmit}
                    className="rounded-2xl px-12 font-black italic uppercase tracking-wider shadow-xl"
                >
                    {isEvaluating ? "EVALUATING..." : "SUBMIT CALIBRATION"}
                </Button>
            </div>
        </div>
    );
};
