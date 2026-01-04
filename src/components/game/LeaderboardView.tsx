import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Trophy, 
  Medal, 
  Star, 
  Crown,
  RefreshCw,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudio } from '@/hooks/useAudio';
import { CharacterAvatar } from './CharacterAvatar';

interface LeaderboardEntry {
  id: string;
  player_name: string;
  player_id: string;
  total_xp: number;
  levels_completed: number;
  highest_score: number;
  avatar_gender: string;
  avatar_style: number;
}

export const LeaderboardView: React.FC = () => {
  const { player, setScreen } = useGameStore();
  const { playSfx } = useAudio();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'xp' | 'levels' | 'score'>('xp');

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const orderBy = activeTab === 'xp' ? 'total_xp' : activeTab === 'levels' ? 'levels_completed' : 'highest_score';
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order(orderBy, { ascending: false })
        .limit(50);

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">{rank}</span>;
    }
  };

  const getRankBgClass = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/10 border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-orange-500/10 border-amber-600/30';
      default:
        return 'bg-card/50 border-border/50';
    }
  };

  const playerEntry = entries.find(e => e.player_id === player?.id);
  const playerRank = playerEntry ? entries.indexOf(playerEntry) + 1 : null;

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <Button
          variant="glass"
          size="icon"
          onClick={() => {
            playSfx('click');
            setScreen('office-hub');
          }}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Leaderboard</h1>
        </div>

        <Button
          variant="glass"
          size="icon"
          onClick={() => {
            playSfx('click');
            fetchLeaderboard();
          }}
          disabled={isLoading}
        >
          <RefreshCw className={cn('w-5 h-5', isLoading && 'animate-spin')} />
        </Button>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 justify-center">
        {[
          { id: 'xp', label: 'Total XP', icon: Star },
          { id: 'levels', label: 'Levels', icon: Zap },
          { id: 'score', label: 'High Score', icon: Trophy },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              playSfx('click');
              setActiveTab(tab.id as typeof activeTab);
            }}
            className={cn(
              'px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2',
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                : 'bg-card/50 text-muted-foreground hover:bg-card'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Player's Rank Card */}
      {player && playerRank && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-4 mb-6 border-2 border-primary/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center font-bold text-xl text-primary">
                #{playerRank}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Rank</p>
                <p className="font-semibold">{player.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gradient-gold">
                {activeTab === 'xp' ? player.xp.toLocaleString() : 
                 activeTab === 'levels' ? player.completedLevels.length :
                 playerEntry?.highest_score || 0}
              </p>
              <p className="text-xs text-muted-foreground">
                {activeTab === 'xp' ? 'XP' : activeTab === 'levels' ? 'Completed' : 'Best Score'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Leaderboard List */}
      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-20"
            >
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </motion.div>
          ) : entries.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">No entries yet. Be the first!</p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {entries.map((entry, index) => {
                const rank = index + 1;
                const isCurrentPlayer = entry.player_id === player?.id;

                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'rounded-xl p-4 border transition-all',
                      getRankBgClass(rank),
                      isCurrentPlayer && 'ring-2 ring-primary'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="w-10 flex justify-center">
                        {getRankIcon(rank)}
                      </div>

                      {/* Avatar */}
                      <CharacterAvatar
                        gender={entry.avatar_gender as 'male' | 'female' | 'other'}
                        size="sm"
                        gesture="idle"
                        enableMicroAnimations={rank <= 3}
                        showGlow={rank === 1}
                      />

                      {/* Name */}
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'font-semibold truncate',
                          isCurrentPlayer && 'text-primary'
                        )}>
                          {entry.player_name}
                          {isCurrentPlayer && <span className="text-xs ml-2">(You)</span>}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Level {Math.floor(entry.total_xp / 500) + 1} • {entry.levels_completed} completed
                        </p>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <p className={cn(
                          'font-bold text-lg',
                          rank === 1 && 'text-yellow-400',
                          rank === 2 && 'text-gray-300',
                          rank === 3 && 'text-amber-500'
                        )}>
                          {activeTab === 'xp' ? entry.total_xp.toLocaleString() :
                           activeTab === 'levels' ? entry.levels_completed :
                           entry.highest_score}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activeTab === 'xp' ? 'XP' : activeTab === 'levels' ? 'Levels' : 'Score'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
