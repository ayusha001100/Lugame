import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Database, Zap, ArrowRight, BrainCircuit, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VariableWritingTaskProps {
    level: any;
    onComplete: (submission: any) => void;
    isEvaluating: boolean;
}

export const VariableWritingTask: React.FC<VariableWritingTaskProps> = ({ level, onComplete, isEvaluating }) => {
    const { taskData, taskPrompt } = level;
    const variables = taskData.variables || {};
    const [answer, setAnswer] = useState('');
    const [showHints, setShowHints] = useState(false);

    return (
        <div className="space-y-10 max-w-4xl mx-auto">
            <div className="text-center space-y-3">
                <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary">Contextual Synthesis</h3>
                <p className="text-2xl font-black italic uppercase tracking-tight leading-tight">{taskPrompt}</p>
            </div>

            {/* Strategic Brief / Variables Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(variables).map(([key, value]) => (
                    <div key={key} className="glass-card rounded-2xl p-4 border border-border/50 bg-gradient-to-b from-card to-muted/20 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-5 -translate-y-2 group-hover:translate-y-0 transition-transform">
                            <Database className="w-8 h-8" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 block mb-1">{key}</span>
                        <p className="font-black italic text-sm text-foreground">{value as string}</p>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="space-y-6">
                <div className="relative">
                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        disabled={isEvaluating}
                        placeholder="TYPE YOUR STRATEGIC RESPONSE HERE..."
                        className="w-full h-40 bg-card rounded-[2rem] border-2 border-border p-8 text-lg font-medium focus:border-primary transition-all outline-none resize-none shadow-inner"
                    />
                    <div className="absolute bottom-6 right-8 flex items-center gap-2 opacity-40">
                        <BrainCircuit className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{answer.length} Characters</span>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-6">
                    <button
                        onClick={() => setShowHints(!showHints)}
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-full hover:bg-white/5"
                    >
                        <Lightbulb className={cn("w-4 h-4", showHints && "text-primary")} />
                        {showHints ? 'Hide Strategic Intel' : 'Reveal Intel'}
                    </button>

                    <Button
                        size="xl"
                        disabled={answer.length < 5 || isEvaluating}
                        onClick={() => onComplete(answer)}
                        className="rounded-[2.5rem] px-16 h-20 text-xl font-black italic uppercase tracking-widest shadow-2xl shadow-primary/20 group overflow-hidden relative"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            {isEvaluating ? "SYNTHESIZING..." : "EXECUTE STRATEGY"}
                            {!isEvaluating && <Zap className="w-5 h-5 fill-current group-hover:scale-125 transition-transform" />}
                        </span>
                        <motion.div
                            className="absolute inset-0 bg-primary/20"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '100%' }}
                            transition={{ duration: 0.5 }}
                        />
                    </Button>
                </div>

                {/* Hints Section */}
                <AnimatePresence>
                    {showHints && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="w-full overflow-hidden"
                        >
                            <div className="grid md:grid-cols-2 gap-4 pt-4 text-left">
                                {(level.taskHints && level.taskHints.length > 0 ? level.taskHints : [
                                    "Synthesize Variables: Incorporate at least two of the provided data points into your answer.",
                                    "Tone Check: Ensure your writing style matches the specific Persona Choices made earlier.",
                                    "Logic Flow: Start with the problem, then state the variable-backed solution, then the outcome.",
                                    "Conciseness: The more direct your response, the higher the 'Efficiency' score.",
                                    "Alignment Check: Cross-reference your draft with the NPC's primary goal in this mission."
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
