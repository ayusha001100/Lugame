import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Target, TrendingUp, HelpCircle, ArrowRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ABTestTaskProps {
    level: any;
    onComplete: (submission: any) => void;
    isEvaluating: boolean;
}

export const ABTestTask: React.FC<ABTestTaskProps> = ({ level, onComplete, isEvaluating }) => {
    const { taskData, taskPrompt } = level;
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <div className="space-y-12 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Performance Prediction</span>
                </div>
                <p className="text-3xl font-black italic uppercase tracking-tight max-w-3xl mx-auto leading-[1.1]">{taskPrompt}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Variation A */}
                <motion.button
                    whileHover={{ y: -10, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelected(taskData.variationA)}
                    className={cn(
                        "group relative p-1 rounded-[2.5rem] transition-all duration-500",
                        selected === taskData.variationA ? "bg-gradient-to-r from-primary to-amber-500 shadow-2xl shadow-primary/20" : "bg-border/30"
                    )}
                >
                    <div className="bg-card rounded-[2.4rem] p-10 h-full flex flex-col justify-between items-center text-center space-y-8 min-h-[300px]">
                        <span className="text-4xl font-black italic text-muted-foreground/20 absolute top-8 left-10">A</span>
                        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                            <TrendingUp className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="text-xl font-bold leading-relaxed px-4 italic">{taskData.variationA}</p>
                        <div className={cn(
                            "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            selected === taskData.variationA ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                        )}>
                            Select Variation A
                        </div>
                    </div>
                </motion.button>

                {/* Variation B */}
                <motion.button
                    whileHover={{ y: -10, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelected(taskData.variationB)}
                    className={cn(
                        "group relative p-1 rounded-[2.5rem] transition-all duration-500",
                        selected === taskData.variationB ? "bg-gradient-to-r from-primary to-amber-500 shadow-2xl shadow-primary/20" : "bg-border/30"
                    )}
                >
                    <div className="bg-card rounded-[2.4rem] p-10 h-full flex flex-col justify-between items-center text-center space-y-8 min-h-[300px]">
                        <span className="text-4xl font-black italic text-muted-foreground/20 absolute top-8 left-10">B</span>
                        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                            <TrendingUp className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="text-xl font-bold leading-relaxed px-4 italic">{taskData.variationB}</p>
                        <div className={cn(
                            "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            selected === taskData.variationB ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                        )}>
                            Select Variation B
                        </div>
                    </div>
                </motion.button>
            </div>

            <div className="bg-muted/30 p-8 rounded-[2rem] border border-border/50 flex flex-col md:flex-row items-center gap-6 max-w-3xl mx-auto">
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <HelpCircle className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xs font-medium text-muted-foreground italic leading-relaxed text-center md:text-left">
                    Predict the winning variation based on psychological triggers such as <span className="text-foreground font-bold italic">Curiosity</span>, <span className="text-foreground font-bold italic">Social Proof</span>, or <span className="text-foreground font-bold italic">Direct Utility</span>. Data shows humans favor narratives over feature lists.
                </p>
            </div>

            <div className="flex justify-center pt-4">
                <Button
                    size="xl"
                    disabled={!selected || isEvaluating}
                    onClick={() => onComplete(selected)}
                    className="rounded-[2.5rem] px-20 h-20 text-xl font-black italic uppercase tracking-[0.2em] shadow-2xl group transition-all"
                >
                    {isEvaluating ? "SIMULATING TRAFFIC..." : "CONFIRM PREDICTION"}
                    {!isEvaluating && <Zap className="w-6 h-6 ml-4 fill-current group-hover:rotate-12 transition-transform" />}
                </Button>
            </div>
        </div>
    );
};
