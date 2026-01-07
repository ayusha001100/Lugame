import React, { useState } from 'react';
import { GameLevel } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Lightbulb, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ShortAnswerTaskProps {
    level: GameLevel;
    onComplete: (submission: string) => void;
    isEvaluating: boolean;
}

export const ShortAnswerTask: React.FC<ShortAnswerTaskProps> = ({ level, onComplete, isEvaluating }) => {
    const [submission, setSubmission] = useState('');
    const [showHints, setShowHints] = useState(false);

    return (
        <div className="space-y-6">
            {/* Task Prompt Card (MODULE 4) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-3xl p-8 border-l-4 border-primary bg-primary/5 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles className="w-12 h-12" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary/80 mb-3">Operational Brief</h3>
                <p className="text-lg font-medium leading-relaxed italic text-foreground/90">
                    {level.taskPrompt}
                </p>
            </motion.div>

            {/* Input Area */}
            <div className="space-y-4">
                <div className="relative group">
                    <Textarea
                        value={submission}
                        onChange={(e) => setSubmission(e.target.value)}
                        placeholder="Type your strategic response here..."
                        className="min-h-[280px] rounded-[2rem] bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 p-8 text-lg italic leading-relaxed transition-all resize-none shadow-inner"
                    />
                    <div className="absolute bottom-6 right-8 flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
                            {submission.length} chars
                        </span>
                    </div>
                </div>

                {/* Footer Actions (MODULE 6 Feedback loop) */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
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
                        onClick={() => onComplete(submission)}
                        disabled={!submission.trim() || isEvaluating}
                        className="min-w-[260px] h-16 rounded-[2rem] shadow-2xl group shadow-primary/20"
                    >
                        {isEvaluating ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin mr-3" />
                                ORCHESTRATING...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                EXECUTE SUBMISSION
                            </>
                        )}
                    </Button>
                </div>

                {/* Hints (CMS Module 3/4) */}
                <AnimatePresence>
                    {showHints && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="grid md:grid-cols-2 gap-4 pt-4">
                                {level.taskHints.map((hint, i) => (
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
