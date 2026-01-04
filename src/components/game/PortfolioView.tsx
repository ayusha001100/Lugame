import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { GAME_LEVELS } from '@/data/levels';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Download,
  Share2,
  FileText,
  Calendar,
  Trophy,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const PortfolioView: React.FC = () => {
  const { player, setScreen } = useGameStore();

  if (!player) return null;

  const sortedPortfolio = [...player.portfolio].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="glass"
            size="icon"
            onClick={() => setScreen('office-hub')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Your Portfolio</h1>
            <p className="text-muted-foreground">Showcase your marketing achievements</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="glass" size="sm">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button variant="premium" size="sm">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </header>

      {/* Portfolio Stats */}
      <div className="glass-card rounded-2xl p-6 mb-8 animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-1">{player.name}'s Portfolio</h2>
            <p className="text-sm text-muted-foreground">
              {player.portfolio.length} completed projects • Level {player.level} Marketer
            </p>
          </div>
          
          {player.completedLevels.length >= 10 && (
            <div className="flex items-center gap-3 bg-gradient-gold rounded-xl px-4 py-2">
              <Trophy className="w-6 h-6 text-primary-foreground" />
              <div className="text-primary-foreground">
                <p className="text-xs font-medium opacity-80">Certificate</p>
                <p className="font-bold">Unlocked!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Items */}
      {sortedPortfolio.length === 0 ? (
        <div className="text-center py-16 animate-fade-up">
          <div className="w-20 h-20 rounded-2xl bg-muted mx-auto mb-6 flex items-center justify-center">
            <FileText className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Portfolio Items Yet</h3>
          <p className="text-muted-foreground mb-6">
            Complete levels to build your marketing portfolio
          </p>
          <Button variant="premium" onClick={() => setScreen('office-hub')}>
            Start Your First Challenge
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {sortedPortfolio.map((item, index) => {
            const level = GAME_LEVELS.find(l => l.id === item.levelId);
            if (!level) return null;

            return (
              <div
                key={item.levelId}
                className="glass-card rounded-2xl p-6 animate-fade-up group hover:bg-white/5 transition-all"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="xp-badge">Level {level.id}</span>
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        item.score >= 80 
                          ? 'bg-success/20 text-success' 
                          : 'bg-primary/20 text-primary'
                      )}>
                        {item.score}/100
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg">{level.title}</h3>
                    <p className="text-sm text-muted-foreground">{level.artifactType}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content Preview */}
                <div className="bg-card/50 rounded-xl p-4 mb-4 max-h-32 overflow-hidden">
                  <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">
                    {item.content}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(item.completedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <span>{level.npcName}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Certificate Preview */}
      {player.completedLevels.length >= 10 && (
        <div className="mt-12 glass-card rounded-2xl p-8 text-center border-2 border-primary/30 animate-fade-up">
          <div className="w-24 h-24 rounded-full bg-gradient-gold mx-auto mb-6 flex items-center justify-center">
            <Trophy className="w-12 h-12 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Certificate of Completion</h2>
          <p className="text-muted-foreground mb-6">
            {player.name} has successfully completed the MarketCraft Digital Marketing Program
          </p>
          <Button variant="glow" size="lg">
            <Download className="w-5 h-5" />
            Download Certificate
          </Button>
        </div>
      )}
    </div>
  );
};
