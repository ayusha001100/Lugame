import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useTheme } from '@/hooks/useTheme';
import { 
  ArrowLeft, 
  Trash2,
  Volume2,
  Volume1,
  VolumeX,
  Moon,
  Sun,
  ShieldAlert,
  User,
  Zap,
  Music
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const SettingsView: React.FC = () => {
  const { 
    player, 
    setScreen, 
    resetGame, 
    audio, 
    toggleMusic, 
    toggleSfx, 
    setVolume 
  } = useGameStore();
  const { theme, toggleTheme } = useTheme();

  if (!player) return null;

  const handleResetGame = () => {
    if (window.confirm('CRITICAL ACTION: This will permanently wipe all mission progress, artifacts, and certifications. Continue?')) {
      resetGame();
      setScreen('splash');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-500 pb-20">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(234,179,8,0.05)_0%,transparent_50%)] pointer-events-none" />

      <div className="max-w-2xl mx-auto px-6 pt-12 md:pt-20 relative z-10 space-y-12">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button
              variant="glass"
              size="icon"
              onClick={() => setScreen('office-hub')}
              className="rounded-2xl border-white/10 bg-white/5 hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex flex-col">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80">System Configuration</h2>
              <h1 className="text-2xl md:text-3xl font-black italic tracking-tight uppercase leading-none mt-1">Operational Settings</h1>
            </div>
          </div>
        </header>

        <div className="grid gap-8">
          {/* PROFILE SECTION */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Personal Identity</h3>
            <div className="glass-card rounded-[2.5rem] p-8 border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-gradient-gold p-0.5 shadow-2xl">
                  <div className="w-full h-full rounded-[1.4rem] bg-card flex items-center justify-center text-4xl">
                    {player.gender === 'male' ? '👨‍💼' : player.gender === 'female' ? '👩‍💼' : '🧑‍💼'}
                  </div>
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-black italic">{player.name}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-primary tracking-widest">{player.role}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Level {player.level}</span>
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-1">
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Experience</span>
                <span className="text-xl font-black italic text-primary">{player.xp.toLocaleString()} XP</span>
              </div>
            </div>
          </section>

          {/* AUDIO SECTION */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Neural Audio Link</h3>
            <div className="glass-card rounded-[2.5rem] p-8 border-white/5 bg-white/[0.02] space-y-10">
              {/* Toggles */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <Zap className={cn("w-4 h-4 transition-colors", audio.isSfxEnabled ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-xs font-black uppercase tracking-widest">Sound Effects</span>
                  </div>
                  <Button 
                    variant={audio.isSfxEnabled ? "glow" : "glass"} 
                    size="sm" 
                    onClick={toggleSfx}
                    className="h-8 rounded-xl text-[10px] font-black uppercase px-4"
                  >
                    {audio.isSfxEnabled ? 'Active' : 'Disabled'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <Music className={cn("w-4 h-4 transition-colors", audio.isMusicPlaying ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-xs font-black uppercase tracking-widest">Background Music</span>
                  </div>
                  <Button 
                    variant={audio.isMusicPlaying ? "glow" : "glass"} 
                    size="sm" 
                    onClick={toggleMusic}
                    className="h-8 rounded-xl text-[10px] font-black uppercase px-4"
                  >
                    {audio.isMusicPlaying ? 'Active' : 'Disabled'}
                  </Button>
                </div>
              </div>

              {/* Master Volume */}
              <div className="space-y-6 px-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {audio.volume === 0 ? <VolumeX className="w-4 h-4 text-muted-foreground" /> : audio.volume < 0.5 ? <Volume1 className="w-4 h-4 text-primary" /> : <Volume2 className="w-4 h-4 text-primary" />}
                    <span className="text-xs font-black uppercase tracking-widest text-primary">Master Volume</span>
                  </div>
                  <span className="text-xs font-black font-mono">{Math.round(audio.volume * 100)}%</span>
                </div>
                <Slider
                  value={[audio.volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(vals) => setVolume(vals[0] / 100)}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </section>

          {/* DISPLAY SECTION */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Interface & Difficulty</h3>
            <div className="glass-card rounded-[2.5rem] p-8 border-white/5 bg-white/[0.02] space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                    {theme === 'dark' ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                  </div>
                  <div>
                    <span className="text-sm font-black italic uppercase block">Protocol Theme</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Current: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={toggleTheme}
                  className="rounded-xl h-11 px-6 font-black uppercase tracking-widest text-[10px] border-white/10 hover:bg-white/5"
                >
                  Switch Protocol
                </Button>
              </div>

              <div className="h-px w-full bg-white/5" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Zap className={cn("w-5 h-5 transition-colors", player.preferences.preferredDifficulty === 'elite' ? "text-amber-500" : "text-primary")} />
                  </div>
                  <div>
                    <span className="text-sm font-black italic uppercase block">Mission Difficulty</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Current: {player.preferences.preferredDifficulty === 'elite' ? 'Elite' : 'Standard'}</span>
                  </div>
                </div>
                <Button 
                  variant={player.preferences.preferredDifficulty === 'elite' ? "glow" : "outline"} 
                  onClick={() => {
                    const newDiff = player.preferences.preferredDifficulty === 'elite' ? 'standard' : 'elite';
                    useGameStore.getState().updatePlayer({
                      preferences: { ...player.preferences, preferredDifficulty: newDiff }
                    });
                  }}
                  className="rounded-xl h-11 px-6 font-black uppercase tracking-widest text-[10px] border-white/10"
                >
                  {player.preferences.preferredDifficulty === 'elite' ? 'Disable Elite' : 'Enable Elite'}
                </Button>
              </div>
            </div>
          </section>

          {/* DANGER ZONE */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-destructive/60 ml-2">Irreversible Actions</h3>
            <div className="glass-card rounded-[2.5rem] p-8 border-destructive/20 bg-destructive/5 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-6 h-6 text-destructive" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-black italic uppercase text-destructive">Wipe All Records</h4>
                  <p className="text-xs font-bold text-destructive/60 uppercase leading-relaxed max-w-sm">
                    This will permanently delete your career progress, earned stipend, and all verified certifications.
                  </p>
                </div>
              </div>
              <Button 
                variant="destructive" 
                className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-destructive/20 group" 
                onClick={handleResetGame}
              >
                <Trash2 className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                Initialize Factory Reset
              </Button>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2 py-8">
          <div className="flex items-center justify-center gap-2 opacity-30">
            <span className="h-px w-8 bg-muted-foreground" />
            <span className="text-[8px] font-black uppercase tracking-[0.5em]">MarketCraft Core v4.0</span>
            <span className="h-px w-8 bg-muted-foreground" />
          </div>
          <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">© 2026 NovaTech Strategic Ecosystems</p>
        </div>
      </div>
    </div>
  );
};
