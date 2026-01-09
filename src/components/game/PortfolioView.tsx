import React, { useState, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { GAME_LEVELS } from '@/data/levels';
import { ACHIEVEMENTS } from '@/types/achievements';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Download,
  Share2,
  FileText,
  Calendar,
  ExternalLink,
  ChevronRight,
  Eye,
  Lock,
  Sparkles,
  Search,
  CheckCircle2,
  Rocket,
  Award,
  Zap,
  TrendingUp,
  Target,
  Medal,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const PortfolioView: React.FC = () => {
  const { player, setScreen } = useGameStore();
  const [activeTab, setActiveTab] = useState<'artifacts' | 'achievements' | 'credentials'>('artifacts');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<any | null>(null);

  if (!player) return null;

  const handleDownload = () => {
    // Standard professional print trigger
    window.print();
  };

  const sortedPortfolio = useMemo(() =>
    [...player.portfolio].sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    , [player.portfolio]);

  const categories = ['SEO', 'Ads', 'Copy', 'Strategy', 'Analytics', 'Design'];

  const normalizeCategory = (cat: string) => {
    if (cat === 'MARKETING') return 'Strategy';
    if (cat === 'ADS') return 'Ads';
    if (cat === 'CONTENT') return 'Design';
    if (cat === 'ANALYTICS') return 'Analytics';
    // Handle specific level titles/competencies if stored in category (fallback)
    return cat;
  };

  const filteredPortfolio = selectedTag
    ? sortedPortfolio.filter(item => normalizeCategory(item.category) === selectedTag || item.category === selectedTag)
    : sortedPortfolio;

  const stats = [
    { label: 'Artifacts', value: player.portfolio.length, icon: FileText, color: 'text-blue-500' },
    { label: 'XP Points', value: player.xp.toLocaleString(), icon: Zap, color: 'text-yellow-500' },
    { label: 'Rank', value: player.role, icon: TrendingUp, color: 'text-green-500' },
    { label: 'Trust', value: `${player.stats.reputation}%`, icon: ShieldCheck, color: 'text-purple-500' },
  ];

  const renderArtifactContent = (content: any): React.ReactNode => {
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) return content.join(', ');
    if (typeof content === 'object' && content !== null) {
      return (
        <div className="space-y-1">
          {Object.entries(content).map(([key, value]) => (
            <div key={key} className="flex gap-2 text-[10px]">
              <span className="font-black uppercase text-primary/60">{key}:</span>
              <span className="opacity-80">{String(value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return String(content);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 pb-20">
      {/* Cinematic Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(234,179,8,0.1)_0%,transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

      {/* Modern Header */}
      <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-white/5 p-4 md:p-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Button
              variant="glass"
              size="icon"
              onClick={() => setScreen('office-hub')}
              className="rounded-2xl shrink-0 border-white/5 bg-white/5 hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Briefcase className="w-3 h-3 text-primary" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80">Career Terminal</h2>
              </div>
              <h1 className="text-xl md:text-2xl font-black italic tracking-tight uppercase leading-none mt-1">Professional Portfolio</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="glow"
              size="sm"
              className="rounded-xl h-11 px-6 font-black uppercase tracking-widest text-[11px] hidden md:flex"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Full Resume
            </Button>
            <Button variant="glass" size="icon" className="md:hidden rounded-xl border-white/10" onClick={handleDownload}>
              <Download className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12">

          {/* PROFILE COLUMN */}
          <aside className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-[2.5rem] p-8 border-white/5 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />

              <div className="text-center space-y-6">
                <div className="relative inline-block">
                  <div className="w-36 h-36 rounded-3xl bg-gradient-gold p-1 shadow-[0_0_50px_rgba(234,179,8,0.15)] group-hover:scale-105 transition-transform duration-500">
                    <div className="w-full h-full rounded-[1.4rem] bg-card flex items-center justify-center text-5xl">
                      {player.gender === 'male' ? '👨‍💼' : (player.gender === 'female' ? '👩‍💼' : '🧑‍💼')}
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-[10px] font-black uppercase shadow-xl border-2 border-background">
                    LVL {player.level}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter">{player.name}</h3>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{player.role}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{player.cohort}</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mt-10">
                {stats.map((stat, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1 hover:bg-white/[0.08] transition-colors">
                    <stat.icon className={cn("w-4 h-4 mb-1", stat.color)} />
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                    <span className="text-sm font-black italic">{stat.value}</span>
                  </div>
                ))}
              </div>

              {/* Skill Matrix */}
              <div className="mt-10 space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground border-b border-white/5 pb-3">Competency Cloud</h4>
                <div className="grid gap-5">
                  {Object.entries(player.stats.skillTree).map(([skill, level]) => (
                    <div key={skill} className="space-y-2 group/skill">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="group-hover/skill:text-primary transition-colors">{skill}</span>
                        <span className="text-primary/60">{(level / 10 * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                        <motion.div
                          className="h-full bg-gradient-gold rounded-full shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${(level / 10) * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Certification Status */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground border-b border-white/5 pb-3">Department Credentials</h4>
              <div className="grid gap-3">
                {[
                  { id: 'marketing', label: 'Marketing HQ', levels: [1, 2], icon: '📊' },
                  { id: 'ads', label: 'Ads Lab', levels: [3, 4], icon: '🎯' },
                  { id: 'content', label: 'Content Studio', levels: [5, 6], icon: '✍️' },
                  { id: 'creative', label: 'Design Studio', levels: [7, 8], icon: '🎨' },
                  { id: 'analytics', label: 'Analytics War Room', levels: [9, 10], icon: '📈' },
                ].map(module => {
                  const isCompleted = module.levels.every(l => player.completedLevels.includes(l));
                  return (
                    <button
                      key={module.id}
                      disabled={!isCompleted}
                      onClick={() => {
                        useGameStore.getState().setCertificationType(module.id as any);
                        setScreen('certification');
                      }}
                      className={cn(
                        "w-full p-4 rounded-2xl border flex items-center justify-between transition-all group",
                        isCompleted 
                          ? "bg-primary/5 border-primary/20 hover:border-primary/40 cursor-pointer" 
                          : "bg-muted/20 border-white/5 opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{module.icon}</span>
                        <div className="text-left">
                          <div className="text-[10px] font-black uppercase tracking-widest">{module.label}</div>
                          <div className="text-[8px] font-bold text-muted-foreground uppercase">
                            {isCompleted ? "Verified Credential" : "Calibration Incomplete"}
                          </div>
                        </div>
                      </div>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-[2.5rem] p-8 bg-gradient-to-br from-primary/10 via-background to-background border-primary/20 relative group hover:border-primary/40 transition-all cursor-pointer overflow-hidden"
              onClick={() => {
                if (player.completedLevels.length >= 10) {
                  useGameStore.getState().setCertificationType('master');
                  setScreen('certification');
                }
              }}
            >
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                <Award className="w-32 h-32 rotate-12" />
              </div>
              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase text-primary mb-1 block">Master Score</span>
                    <span className="text-2xl font-black italic">{(player.completedLevels.length / 10 * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-black italic uppercase tracking-tight">Master Strategist</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Global Operational Clearance</p>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${(player.completedLevels.length / 10) * 100}%` }} />
                </div>
                <Button variant="glow" className="w-full rounded-2xl h-11 text-[10px] font-black uppercase tracking-widest" disabled={player.completedLevels.length < 10}>
                  {player.completedLevels.length >= 10 ? 'Generate Master Certificate' : `Complete ${10 - player.completedLevels.length} More Missions`}
                </Button>
              </div>
            </motion.div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <section className="lg:col-span-8 space-y-10">
            {/* View Scoped Tabs */}
            <div className="flex items-center gap-6 border-b border-white/5 pb-1">
              {[
                { id: 'artifacts', label: 'Artifact Archives', icon: FileText },
                { id: 'achievements', label: 'Milestone Gallery', icon: Medal },
                { id: 'credentials', label: 'Skill Endorsements', icon: Target },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative",
                    activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                    />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'artifacts' && (
                <motion.div
                  key="artifacts"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Category Filter */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setSelectedTag(null)}
                      className={cn(
                        "px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                        !selectedTag
                          ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                          : "bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10"
                      )}
                    >
                      Universal
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedTag(cat)}
                        className={cn(
                          "px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                          selectedTag === cat
                            ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                            : "bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Artifact Grid */}
                  <div className="space-y-6">
                    {filteredPortfolio.length > 0 ? (
                      filteredPortfolio.map((artifact, idx) => (
                        <motion.div
                          key={`${artifact.levelId}-${idx}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="glass-card rounded-[2.5rem] p-8 border-white/5 group hover:border-primary/30 transition-all relative overflow-hidden flex flex-col md:flex-row gap-8"
                        >
                          <div className="flex-1 space-y-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[9px] font-black text-primary uppercase tracking-widest">
                                  {artifact.category}
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(artifact.completedAt).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground mb-1 block">Performance Score</span>
                                <span className="text-xl font-black italic text-gradient-gold">{artifact.score}/100</span>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h3 className="text-xl md:text-2xl font-black italic tracking-tight leading-tight group-hover:text-primary transition-colors">
                                {artifact.title}
                              </h3>
                              <div className="bg-white/5 rounded-3xl p-6 border border-white/5 relative group/content">
                                <div className="absolute top-2 right-4 opacity-20 pointer-events-none">
                                  <FileText className="w-8 h-8" />
                                </div>
                                <div className="text-sm md:text-base font-medium text-foreground/80 leading-relaxed italic whitespace-pre-wrap line-clamp-3 group-hover/content:line-clamp-none transition-all">
                                  “{renderArtifactContent(artifact.content)}”
                                </div>
                              </div>

                              {/* AI Feedback Log */}
                              <div className="p-5 rounded-2xl bg-primary/[0.03] border border-primary/10 flex gap-4 items-start">
                                <Rocket className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/80 block">Chief Strategist Feedback</span>
                                  <p className="text-xs text-muted-foreground leading-relaxed italic">
                                    {typeof artifact.feedback === 'string' ? artifact.feedback : (artifact.feedback?.feedback || 'Strategic execution validated.')}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex md:flex-col justify-center gap-3 md:border-l border-white/5 md:pl-8 shrink-0">
                            {[
                              { icon: Eye, label: 'Inspect' },
                              { icon: Share2, label: 'Distribute' },
                              { icon: Download, label: 'Export' },
                            ].map((btn, i) => (
                              <button
                                key={i}
                                className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all shadow-xl group/btn overflow-hidden relative"
                              >
                                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                <btn.icon className="w-6 h-6 relative z-10" />
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-32 glass-card rounded-[3rem] border border-dashed border-white/10">
                        <Rocket className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-10 animate-pulse" />
                        <h3 className="text-2xl font-black italic text-muted-foreground leading-none">Archives Unpopulated</h3>
                        <p className="text-sm text-muted-foreground/60 mt-3 uppercase tracking-widest font-bold">Initiate missions to generate professional artifacts.</p>
                        <Button
                          variant="glow"
                          className="mt-8 px-10 h-12 rounded-2xl"
                          onClick={() => setScreen('office-hub')}
                        >
                          Return to Hub
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'achievements' && (
                <motion.div
                  key="achievements"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid sm:grid-cols-2 gap-6"
                >
                  {ACHIEVEMENTS.map((achievement, idx) => {
                    const isUnlocked = true; // Force unlock for demo/user request
                    return (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setSelectedAchievement(achievement)}
                        className={cn(
                          "glass-card rounded-[2rem] p-6 border-white/5 relative overflow-hidden group transition-all cursor-pointer hover:border-primary/40 hover:bg-white/[0.08]",
                          isUnlocked ? "bg-gradient-to-br from-white/5 to-transparent border-primary/20" : "opacity-50 grayscale"
                        )}
                      >
                        <div className="flex gap-5">
                          <div className={cn(
                            "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl transition-transform group-hover:rotate-12",
                            isUnlocked ? "bg-gradient-gold" : "bg-muted grayscale"
                          )}>
                            {achievement.icon}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-black italic text-lg uppercase leading-none">{achievement.title}</h4>
                              <Sparkles className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-xs text-muted-foreground leading-tight">{achievement.description}</p>
                            <div className="flex items-center gap-3 pt-3">
                              <span className={cn(
                                "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                                achievement.rarity === 'legendary' ? "border-yellow-500/30 text-yellow-500 bg-yellow-500/10" :
                                  achievement.rarity === 'epic' ? "border-purple-500/30 text-purple-500 bg-purple-500/10" :
                                    "border-blue-500/30 text-blue-500 bg-blue-500/10"
                              )}>
                                {achievement.rarity}
                              </span>
                              <span className="text-[10px] font-black text-primary">+{achievement.xpReward} XP</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {activeTab === 'credentials' && (
                <motion.div
                  key="credentials"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-10"
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="glass-card rounded-[2.5rem] p-8 border-white/5 space-y-6">
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-primary" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em]">Network Standing</h3>
                      </div>
                      <div className="space-y-6">
                        {Object.entries(player.stats.trust).map(([role, trust]) => (
                          <div key={role} className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase">
                              <span>{role} Endorsement</span>
                              <span className="text-primary">{trust}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full">
                              <motion.div
                                className="h-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${trust}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card rounded-[2.5rem] p-8 border-white/5 space-y-6">
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-primary" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em]">Verified Achievements</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                          <span className="text-[10px] font-bold uppercase opacity-60">Levels Conquered</span>
                          <span className="text-lg font-black italic text-primary">{player.completedLevels.length}/10</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                          <span className="text-[10px] font-bold uppercase opacity-60">Milestones Unlocked</span>
                          <span className="text-lg font-black italic text-primary">{player.achievements?.length || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                          <span className="text-[10px] font-bold uppercase opacity-60">Certification Rank</span>
                          <span className="text-lg font-black italic text-primary uppercase">{player.role}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center p-12 glass-card rounded-[3rem] border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
                    <Award className="w-16 h-16 text-primary mx-auto mb-6" />
                    <h3 className="text-2xl font-black italic tracking-tighter uppercase">MarketCraft Professional Standard</h3>
                    <p className="text-sm text-muted-foreground max-w-lg mx-auto mt-4 leading-relaxed">
                      This validates that {player.name} has undergone intensive role-play simulations and demonstrated mastery over core digital marketing principles.
                    </p>
                    <Button
                      variant="glow"
                      size="xl"
                      className="mt-10 rounded-2xl px-12"
                      onClick={() => setScreen('certification')}
                    >
                      Visit Validation Portal
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card max-w-lg w-full rounded-[3rem] p-10 border-primary/30 relative overflow-hidden text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-gold" />

              <div className="w-24 h-24 rounded-3xl bg-gradient-gold mx-auto flex items-center justify-center text-5xl mb-8 shadow-[0_0_50px_rgba(234,179,8,0.3)]">
                {selectedAchievement.icon}
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex justify-center gap-2 items-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{selectedAchievement.rarity} Recognition</span>
                </div>
                <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none italic">{selectedAchievement.title}</h3>
                <p className="text-muted-foreground leading-relaxed italic px-4">
                  “{selectedAchievement.description}”
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-1">XP Gratification</span>
                  <span className="text-2xl font-black italic text-primary">+{selectedAchievement.xpReward}</span>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Status Impact</span>
                  <span className="text-2xl font-black italic text-primary">+3% Rep</span>
                </div>
              </div>

              <Button
                variant="glow"
                className="w-full mt-8 h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest"
                onClick={() => setSelectedAchievement(null)}
              >
                Close Gallery Record
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
