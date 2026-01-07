import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    auth,
    db
} from '@/lib/firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';
import {
    Sparkles,
    Mail,
    Lock,
    ArrowRight,
    Chrome,
    AlertCircle,
    Loader2,
    ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudio } from '@/hooks/useAudio';

export const AuthView: React.FC = () => {
    const { setScreen, updatePlayer, player } = useGameStore();
    const { playSfx } = useAudio();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (player) {
            setScreen('office-hub');
        }
    }, [player, setScreen]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        playSfx('click');

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            // Persistence and fetching is handled in GameContainer, which will update 'player'
            // The useEffect above will then navigate to 'office-hub' if player exists.
            // If player doesn't exist (new user), GameContainer will navigate to character-creation.
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialSignIn = async () => {
        setIsLoading(true);
        setError(null);
        playSfx('click');

        try {
            const authProvider = new GoogleAuthProvider();
            await signInWithPopup(auth, authProvider);
            setScreen('character-creation');
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements to match theme */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <div className="text-center mb-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setScreen('splash')}
                        className="absolute top-8 left-8 text-muted-foreground hover:text-foreground"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>

                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 bg-gradient-gold rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-primary/20"
                    >
                        <Sparkles className="w-8 h-8 text-primary-foreground" />
                    </motion.div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">
                        {isLogin ? 'Welcome Back' : 'Join the Quest'}
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        {isLogin ? 'Sign in to continue your marketing journey' : 'Create an account to start your career'}
                    </p>
                </div>

                <div className="glass-card p-8 rounded-3xl border border-border shadow-2xl relative overflow-hidden">
                    {/* Form */}
                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="email"
                                    placeholder="Email Address"
                                    className="pl-10 h-12 bg-muted/30 border-border text-foreground transition-all focus:ring-2 focus:ring-primary/50"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    className="pl-10 h-12 bg-muted/30 border-border text-foreground transition-all focus:ring-2 focus:ring-primary/50"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-xl text-sm border border-destructive/20"
                            >
                                <AlertCircle className="w-4 h-4" />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all group"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    {/* Social Sign In */}
                    <div className="flex flex-col gap-4">
                        <Button
                            variant="glass"
                            className="h-12 rounded-xl w-full"
                            onClick={() => handleSocialSignIn()}
                            disabled={isLoading}
                        >
                            <Chrome className="w-5 h-5 mr-2" />
                            Continue with Google
                        </Button>
                    </div>

                    <p className="mt-8 text-center text-sm text-muted-foreground">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-primary font-bold hover:underline underline-offset-4"
                        >
                            {isLogin ? 'Sign Up' : 'Log In'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
