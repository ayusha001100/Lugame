import React, { useState } from 'react';
import { GameLevel } from '@/types/game';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sparkles, RefreshCcw, Lightbulb } from 'lucide-react';

interface FillBlanksTaskProps {
    level: GameLevel;
    onComplete: (submission: string) => void;
    isEvaluating: boolean;
}

export const FillBlanksTask: React.FC<FillBlanksTaskProps> = ({ level, onComplete, isEvaluating }) => {
    // Expected taskData: { text: "The {0} is a {1} metric.", chips: ["ROAS", "KPI", "LTV"] }
    const { text = "Engine data missing", chips = [] } = level.taskData || {};
    const [selectedChips, setSelectedChips] = useState<Record<number, string>>({});
    const [showHints, setShowHints] = useState(false);

    const handleChipClick = (chip: string) => {
        const nextBlank = Object.keys(selectedChips).length;
        if (nextBlank < (text.match(/\{(\d+)\}/g) || []).length) {
            setSelectedChips({ ...selectedChips, [nextBlank]: chip });
        }
    };

    const reset = () => setSelectedChips({});

    const renderText = () => {
        const parts = text.split(/(\{\d+\})/);
        return parts.map((part, i) => {
            const match = part.match(/\{(\d+)\}/);
            if (match) {
                const index = parseInt(match[1]);
                const selected = selectedChips[index];
                return (
                    <span
                        key={i}
                        className={cn(
                            "inline-flex items-center justify-center min-w-[100px] h-10 px-4 mx-2 rounded-xl border transition-all font-black italic",
                            selected
                                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                : "bg-white/5 border-dashed border-white/20 text-transparent"
                        )}
                    >
                        {selected || '____'}
                    </span>
                );
            }
            return <span key={i} className="text-xl md:text-2xl font-medium italic">{part}</span>;
        });
    };

    return (
        <div className="p-8 md:p-12 glass-card rounded-[2.5rem] border border-white/5 space-y-12 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-black italic tracking-tight uppercase flex items-center justify-center gap-3">
                    <Sparkles className="w-6 h-6 text-primary" />
                    Strategic Synthesis
                </h3>
                <p className="text-muted-foreground text-sm font-medium">Reconstruct the growth framework by selecting the correct strategic chips.</p>
            </div>

            <div className="bg-black/20 p-10 rounded-[2rem] border border-white/5 leading-relaxed text-center">
                {renderText()}
            </div>

            <div className="space-y-6">
                <div className="flex flex-wrap justify-center gap-3">
                    {chips.map((chip: string) => (
                        <button
                            key={chip}
                            disabled={Object.values(selectedChips).includes(chip)}
                            onClick={() => handleChipClick(chip)}
                            className={cn(
                                "px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all",
                                Object.values(selectedChips).includes(chip)
                                    ? "opacity-20 cursor-not-allowed bg-white/5"
                                    : "bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 active:scale-95"
                            )}
                        >
                            {chip}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-6 pt-8">
                    <button
                        onClick={() => setShowHints(!showHints)}
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-full hover:bg-white/5"
                    >
                        <Lightbulb className={cn("w-4 h-4", showHints && "text-primary")} />
                        {showHints ? 'Hide Strategic Intel' : 'Reveal Intel'}
                    </button>

                    <div className="flex justify-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={reset}
                            className="rounded-xl h-12 text-[10px] font-black uppercase tracking-widest"
                        >
                            <RefreshCcw className="w-3 h-3 mr-2" />
                            Reset
                        </Button>
                        <Button
                            variant="glow"
                            disabled={isEvaluating || Object.keys(selectedChips).length < (text.match(/\{(\d+)\}/g) || []).length}
                            onClick={() => onComplete(Object.values(selectedChips).join(', '))}
                            className="rounded-2xl px-12 h-14 text-xs font-black uppercase tracking-widest"
                        >
                            {isEvaluating ? 'Syncing...' : 'Submit Logic'}
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
                                        "Semantic Mapping: Ensure the chosen chip fits the grammatical structure of the sentence.",
                                        "Contextual Relevance: Look for keywords in the surrounding text that hint at the missing metric.",
                                        "Calibration Check: Review previous briefs for specific definitions of ROAS, CAC, and LTV.",
                                        "Funnel Logic: Consider whether the blank refers to the 'top', 'middle', or 'bottom' of the marketing funnel.",
                                        "Economic Impact: Choose the metric that directly influences the bottom-line revenue mentioned in the briefing."
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
        </div>
    );
};
