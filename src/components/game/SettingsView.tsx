import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Trash2,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { player, setScreen, resetGame } = useGameStore();

  if (!player) return null;

  const handleResetGame = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      resetGame();
      setScreen('splash');
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <Button
          variant="glass"
          size="icon"
          onClick={() => setScreen('office-hub')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your game preferences</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto space-y-6">
        {/* Player Info */}
        <div className="glass-card rounded-2xl p-6 animate-fade-up">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Account
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-gold flex items-center justify-center text-3xl">
              {player.gender === 'male' ? '👨‍💼' : player.gender === 'female' ? '👩‍💼' : '🧑‍💼'}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{player.name}</h2>
              <p className="text-sm text-muted-foreground">Level {player.level} • {player.xp} XP</p>
            </div>
          </div>
        </div>

        {/* Audio Settings */}
        <div className="glass-card rounded-2xl p-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Audio
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-muted-foreground" />
                <span>Sound Effects</span>
              </div>
              <Button variant="glass" size="sm">On</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-muted-foreground" />
                <span>Background Music</span>
              </div>
              <Button variant="glass" size="sm">Off</Button>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="glass-card rounded-2xl p-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Display
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-muted-foreground" />
              <span>Dark Mode</span>
            </div>
            <Button variant="glass" size="sm">Always On</Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass-card rounded-2xl p-6 border-destructive/30 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-sm font-semibold text-destructive uppercase tracking-wide mb-4">
            Danger Zone
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Reset Game Progress</h4>
              <p className="text-sm text-muted-foreground">Delete all progress and start over</p>
            </div>
            <Button variant="destructive" size="sm" onClick={handleResetGame}>
              <Trash2 className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Version */}
        <div className="text-center text-xs text-muted-foreground pt-4">
          <p>MarketCraft v1.0.0</p>
          <p>© 2024 NovaTech Learning</p>
        </div>
      </div>
    </div>
  );
};
