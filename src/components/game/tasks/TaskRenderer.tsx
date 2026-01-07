import React from 'react';
import { TaskType, GameLevel } from '@/types/game';
import { MCQTask } from './MCQTask';
import { ShortAnswerTask } from './ShortAnswerTask';
import { FillBlanksTask } from './FillBlanksTask';
import { RankOrderTask } from './RankOrderTask';
import { SwipeTask } from './SwipeTask';
import { MarkupTask } from './MarkupTask';

interface TaskRendererProps {
    level: GameLevel;
    onComplete: (submission: any) => void;
    isEvaluating: boolean;
    activePhaseIndex?: number;
}

export const TaskRenderer: React.FC<TaskRendererProps> = ({ level, onComplete, isEvaluating, activePhaseIndex }) => {
    const activeTask = level.phases && activePhaseIndex !== undefined 
        ? level.phases[activePhaseIndex] 
        : level;

    if (!activeTask) return null;

    const taskType = activeTask.taskType;

    switch (taskType) {
        case 'mcq':
        case 'multi-select':
            return <MCQTask level={activeTask as any} onComplete={onComplete} isEvaluating={isEvaluating} />;

        case 'short-answer':
        case 'creative-canvas':
            return <ShortAnswerTask level={activeTask as any} onComplete={onComplete} isEvaluating={isEvaluating} />;

        case 'fill-blanks':
        case 'drag-drop':
            return <FillBlanksTask level={activeTask as any} onComplete={onComplete} isEvaluating={isEvaluating} />;

        case 'rank-order':
            return <RankOrderTask level={activeTask as any} onComplete={onComplete} isEvaluating={isEvaluating} />;

        case 'swipe':
            return <SwipeTask level={activeTask as any} onComplete={onComplete} isEvaluating={isEvaluating} />;

        case 'markup':
        case 'highlight':
            return <MarkupTask level={activeTask as any} onComplete={onComplete} isEvaluating={isEvaluating} />;

        default:
            return (
                <div className="p-8 glass-card rounded-2xl text-center">
                    <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Engine Error</p>
                    <h3 className="text-xl font-black italic mt-2">Unknown Task Type: {taskType}</h3>
                </div>
            );
    }
};
