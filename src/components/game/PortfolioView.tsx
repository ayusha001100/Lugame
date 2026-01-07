import React, { useState } from 'react';
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
  ExternalLink,
  ChevronRight,
  Eye,
  Lock,
  Sparkles,
  Search,
  CheckCircle2,
  Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const PortfolioView: React.FC = () => {
  const { player, setScreen } = useGameStore();
  const [viewMode, setViewMode] = useState<'agent' | 'recruiter'>('agent');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  if (!player) return null;

  const sortedPortfolio = [...player.portfolio].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  const categories = ['SEO', 'Ads', 'Copy', 'Strategy', 'Analytics'];

  const filteredPortfolio = selectedTag
    ? sortedPortfolio.filter(item => item.category === selectedTag)
    : sortedPortfolio;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 pb-20">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(234,179,8,0.05)_0%,transparent_50%)] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/50 backdrop-blur-xl border-b border-border p-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button
            variant="glass"
            size="icon"
            onClick={() => setScreen('office-hub')}
            className="rounded-2xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex flex-col">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Artifact Archives</h2>
            <h1 className="text-xl font-black italic tracking-tight uppercase">Professional Portfolio</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-muted/30 rounded-2xl p-1 border border-border/50 mr-4 overflow-hidden">
            <button
              onClick={() => setViewMode('agent')}
              className={cn("px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", viewMode === 'agent' ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
            >
              Agent View
            </button>
            <button
              onClick={() => setViewMode('recruiter')}
              className={cn("px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", viewMode === 'recruiter' ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
            >
              Recruiter Mode
            </button>
          </div>
          <Button variant="glow" size="sm" className="rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[10px]">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12">

          {/* LEFT: Skill Matrix & Bio (MODULE 1/2) */}
          <aside className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-[2.5rem] p-8 border-border shadow-2xl space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="w-32 h-32 rounded-full mx-auto bg-gradient-gold p-1 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-4xl">
                    {player.gender === 'male' ? '👨‍💼' : (player.gender === 'female' ? '👩‍💼' : '🧑‍💼')}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black italic">{player.name}</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary/80">{player.role} • {player.cohort}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Competency Cloud</h4>
                  <div className="space-y-4">
                    {Object.entries(player.stats.skillTree).map(([skill, level]) => (
                      <div key={skill} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase">
                          <span>{skill}</span>
                          <span className="text-primary">LVL {level}</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${(level / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Network Trust</h4>
                  <div className="flex gap-2">
                    {Object.entries(player.stats.trust).map(([role, trust]) => (
                      <div key={role} className="flex-1 p-2 rounded-xl bg-muted/30 border border-border/50 text-center">
                        <div className="text-[8px] font-black uppercase opacity-50 mb-1">{role}</div>
                        <div className="text-xs font-black">{trust}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Portfolio Polish Certificate (MODULE 5) */}
            {player.completedLevels.length >= 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-[2.5rem] p-8 bg-gradient-to-br from-primary/20 to-transparent border-primary/20 relative group overflow-hidden cursor-pointer"
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Trophy className="w-16 h-16" />
                </div>
                <h3 className="text-sm font-black italic tracking-tight mb-2 uppercase">Certified Growth Intern</h3>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mb-6">Verified by MarketCraft Protocol</p>
                <Button 
                  variant="glow" 
                  className="w-full rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest"
                  onClick={() => setScreen('certification')}
                >
                  Claim Certificate
                </Button>
              </motion.div>
            )}
          </aside>

          {/* RIGHT: Artifact Timeline (MODULE 5) */}
          <section className="lg:col-span-8 space-y-12">

            {/* Filter Hub */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setSelectedTag(null)}
                className={cn("px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all", !selectedTag ? "bg-primary text-primary-foreground" : "bg-muted/30 text-muted-foreground hover:bg-muted/50")}
              >
                All Data
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedTag(cat)}
                  className={cn("px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all", selectedTag === cat ? "bg-primary text-primary-foreground" : "bg-muted/30 text-muted-foreground hover:bg-muted/50")}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Artifact List */}
            <div className="space-y-6">
              {filteredPortfolio.length > 0 ? (
                filteredPortfolio.map((artifact, idx) => (
                  <motion.div
                    key={artifact.levelId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-card rounded-[2.5rem] p-8 border-border group hover:border-primary/20 transition-all relative overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[8px] font-black text-primary uppercase">
                            {artifact.category}
                          </div>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">{new Date(artifact.completedAt).toLocaleDateString()}</span>
                        </div>

                        <div>
                          <h3 className="text-2xl font-black italic tracking-tight leading-tight mb-4 group-hover:text-primary transition-colors">{artifact.title}</h3>
                          <div className="bg-muted/30 rounded-2xl p-6 border border-border/50 relative mb-4">
                            <p className="text-sm font-medium text-muted-foreground leading-relaxed italic whitespace-pre-wrap line-clamp-3 group-hover:line-clamp-none transition-all">
                              “{artifact.content}”
                            </p>
                          </div>
                          
                          {/* Module 6 Feedback display in Portfolio */}
                          <div className="space-y-2 mb-6">
                            <div className="text-[8px] font-black uppercase text-primary/60">Expert Feedback</div>
                            <p className="text-xs text-muted-foreground italic leading-relaxed">
                              {typeof artifact.feedback === 'string' ? artifact.feedback : artifact.feedback.feedback}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                          <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Performance Score</span>
                            <span className="text-xl font-black italic">{artifact.score}/100</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Submission State</span>
                            <span className="text-[10px] font-black uppercase text-success flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Polished
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="w-full md:w-32 flex flex-col justify-between items-center gap-4 pt-4 md:pt-0">
                        <button className="w-12 h-12 rounded-2xl bg-muted/30 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="w-12 h-12 rounded-2xl bg-muted/30 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                          <Share2 className="w-5 h-5" />
                        </button>
                        <button className="w-12 h-12 rounded-2xl bg-muted/30 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20 bg-muted/30 rounded-[3rem] border border-dashed border-border/50">
                  <Rocket className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <h3 className="text-xl font-black italic text-muted-foreground">Trajectory Pending...</h3>
                  <p className="text-sm text-muted-foreground/60 mt-2">Complete more missions to populate your archives.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
