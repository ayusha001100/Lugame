import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TUTORIAL_STEPS, TutorialStep } from '@/data/tutorial';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, X, Lightbulb, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TutorialWalkthroughProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const TutorialWalkthrough: React.FC<TutorialWalkthroughProps> = ({
  isOpen,
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const step = TUTORIAL_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === TUTORIAL_STEPS.length - 1;
  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  // Particle effect
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setParticles(prev => {
          const newParticle = {
            id: Date.now(),
            x: Math.random() * 100,
            y: Math.random() * 100,
          };
          return [...prev.slice(-20), newParticle];
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-background/90 backdrop-blur-md"
          onClick={handleSkip}
        />

        {/* Floating particles */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full bg-primary/30"
            style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: -50 }}
            transition={{ duration: 2 }}
          />
        ))}

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-lg glass-card rounded-3xl border-2 border-primary/20 overflow-hidden z-10"
        >
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-amber-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Skip button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Step indicator */}
          <div className="absolute top-4 left-4 text-xs text-muted-foreground">
            {currentStep + 1} / {TUTORIAL_STEPS.length}
          </div>

          {/* Content */}
          <div className="pt-12 pb-8 px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ x: direction * 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction * -50, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                {/* Icon */}
                <motion.div
                  className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-5xl"
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 3, -3, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {step.icon}
                </motion.div>

                {/* Title */}
                <h2 className="text-2xl font-bold mb-3">{step.title}</h2>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {step.description}
                </p>

                {/* Tip box */}
                {step.tip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-left"
                  >
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">{step.tip}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="px-8 pb-8">
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={isFirst}
                className={cn(isFirst && 'invisible')}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>

              {/* Step dots */}
              <div className="flex gap-1.5">
                {TUTORIAL_STEPS.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentStep ? 1 : -1);
                      setCurrentStep(index);
                    }}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all',
                      index === currentStep
                        ? 'bg-primary w-6'
                        : index < currentStep
                        ? 'bg-primary/50'
                        : 'bg-muted-foreground/30'
                    )}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>

              <Button
                variant={isLast ? 'glow' : 'default'}
                onClick={handleNext}
              >
                {isLast ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-1" />
                    Start Playing
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Decorative elements */}
          <motion.div
            className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, delay: 2 }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
