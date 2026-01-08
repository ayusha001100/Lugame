import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { GameLevel } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowRight, ArrowLeft, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwipeTaskProps {
    level: GameLevel;
    onComplete: (submission: any) => void;
    isEvaluating: boolean;
}

export const SwipeTask: React.FC<SwipeTaskProps> = ({ level, onComplete, isEvaluating }) => {
    const items = level.taskData?.items || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [results, setResults] = useState<Record<string, 'approve' | 'reject'>>({});
    const [exitX, setExitX] = useState<number>(0);
    const [showHints, setShowHints] = useState(false);

    const handleSwipe = (direction: 'left' | 'right') => {
        const item = items[currentIndex];
        const newResults = { ...results, [item.id]: direction === 'right' ? 'approve' : 'reject' };
        setResults(newResults);

        if (currentIndex < items.length - 1) {
            setExitX(direction === 'right' ? 200 : -200);
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
                setExitX(0);
            }, 200);
        } else {
            onComplete(newResults);
        }
    };

    const onDragEnd = (event: any, info: PanInfo) => {
        if (info.offset.x > 100) {
            handleSwipe('right');
        } else if (info.offset.x < -100) {
            handleSwipe('left');
        }
    };

    if (currentIndex >= items.length) return null;

    const currentItem = items[currentIndex];

    return (
        <div className="max-w-md mx-auto space-y-8 py-10">
            <div className="text-center space-y-2">
                <h3 className="text-xl font-black italic uppercase tracking-tighter">Hook Arena</h3>
                <p className="text-muted-foreground text-sm font-medium">Swipe RIGHT to Approve, LEFT to Reject</p>
                <div className="flex justify-center gap-2 mt-4">
                    {items.map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "h-1 rounded-full transition-all duration-300",
                                i === currentIndex ? "w-8 bg-primary" : (i < currentIndex ? "w-4 bg-primary/40" : "w-4 bg-white/10")
                            )}
                        />
                    ))}
                </div>
            </div>

            <div className="relative h-[300px] flex items-center justify-center">
                <AnimatePresence>
                    <motion.div
                        key={currentItem.id}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={onDragEnd}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        exit={{ x: exitX, opacity: 0, scale: 0.5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute inset-0 glass-card rounded-[2.5rem] p-10 border-white/10 flex flex-col items-center justify-center text-center shadow-2xl cursor-grab active:cursor-grabbing select-none"
                    >
                        <div className="text-4xl mb-6 opacity-20">“</div>
                        <p className="text-2xl font-black italic leading-tight tracking-tight">
                            {currentItem.text}
                        </p>
                        <div className="mt-8 flex gap-12 text-[10px] font-black uppercase tracking-widest opacity-40">
                            <div className="flex flex-col items-center gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Reject
                            </div>
                            <div className="flex flex-col items-center gap-2 text-primary">
                                <ArrowRight className="w-4 h-4" />
                                Approve
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex flex-col items-center gap-6">
                <button
                    onClick={() => setShowHints(!showHints)}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-full hover:bg-white/5"
                >
                    <Lightbulb className={cn("w-4 h-4", showHints && "text-primary")} />
                    {showHints ? 'Hide Strategic Intel' : 'Reveal Intel'}
                </button>

                <div className="flex justify-center gap-6">
                    <button
                        onClick={() => handleSwipe('left')}
                        className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <button
                        onClick={() => handleSwipe('right')}
                        className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-lg shadow-green-500/10"
                    >
                        <Check className="w-8 h-8" />
                    </button>
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
                            <div className="grid gap-3 pt-4 text-left">
                                {(level.taskHints && level.taskHints.length > 0 ? level.taskHints : [
                                    "Pattern Recognition: Look for repetitive structures that indicate automated vs. human copy.",
                                    "Emotional Frequency: High-converting hooks often trigger curiosity or urgency.",
                                    "Clarity Scale: If you have to read it twice to understand the value, it's a 'Reject'.",
                                    "Mobile First: Ensure the hook length is optimized for small-screen visibility.",
                                    "Check Against Brief: Does this hook specifically target the segment assigned in the mission start?"
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

