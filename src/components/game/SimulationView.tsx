import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  ArrowLeft,
  Target,
  Zap,
  Activity,
  Users2,
  LayoutDashboard,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  Crown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const SimulationView: React.FC = () => {
  const { player, setScreen, growthData } = useGameStore();

  if (!player) return null;

  const kpis = player.stats.performanceKPIs;
  const currentImpactRevenue = kpis.revenue || 0;
  const previousImpactRevenue = growthData.length > 1 ? growthData[growthData.length - 2].revenue : 0;
  const impactChangePercent = previousImpactRevenue > 0
    ? ((currentImpactRevenue - previousImpactRevenue) / previousImpactRevenue * 100).toFixed(1)
    : (currentImpactRevenue > 0 ? "100" : "0");

  const getImpactColor = (val: number | string) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return num >= 0 ? "text-success" : "text-destructive";
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12">
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-6">
          <Button variant="glass" size="icon" onClick={() => setScreen('office-hub')} className="rounded-2xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex flex-col">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Market Simulation</h2>
            <h1 className="text-xl font-black italic tracking-tight uppercase">Performance Engine</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-6 py-3 glass-card rounded-2xl border-primary/20 bg-primary/5 flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase text-primary/60">Total Stipend</span>
              <span className="text-xl font-black italic tracking-tighter tabular-nums text-primary">₹{(kpis.stipend || 0).toLocaleString()}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Coins className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="px-4 py-2 glass-card rounded-xl border-border/50 flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-muted-foreground">Day</span>
            <span className="text-xl font-black italic">{player.worldState.currentDay}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto space-y-12">
        {/* GROWTH DASHBOARD (NEW STYLE FROM IMAGE) */}
        <motion.div
          className="glass-card rounded-[2.5rem] p-10 border-border/50 relative overflow-hidden bg-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-10 space-y-2">
            <h1 className="text-7xl font-black tracking-tighter">₹{currentImpactRevenue.toLocaleString()}</h1>
            <div className={cn("flex items-center gap-2 font-black italic", getImpactColor(impactChangePercent))}>
              <div className={cn("w-5 h-5 rounded-full flex items-center justify-center", parseFloat(impactChangePercent) >= 0 ? "bg-success/20" : "bg-destructive/20")}>
                <ArrowDownRight className={cn("w-3 h-3", parseFloat(impactChangePercent) >= 0 && "rotate-180")} />
              </div>
              <span>{impactChangePercent}% vs Last Phase</span>
            </div>
          </div>

          <div className="h-[350px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="timestamp" hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '1rem',
                    fontSize: '10px',
                    fontWeight: 900,
                    textTransform: 'uppercase'
                  }}
                  labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                />
                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fillOpacity={1}
                  fill="url(#leadsGradient)"
                  animationDuration={1500}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Revenue', value: `₹${currentImpactRevenue.toLocaleString()}`, icon: TrendingUp },
            { label: 'ROAS', value: `${(kpis.roas || 0).toFixed(2)}x`, icon: Target },
            { label: 'Conversion', value: `${(kpis.conversionRate || 0).toFixed(1)}%`, icon: Activity },
            { label: 'CAC', value: `₹${kpis.cac || 0}`, icon: Users2 },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-3xl p-6 border-border/50 relative overflow-hidden"
            >
              <kpi.icon className="absolute -top-4 -right-4 w-16 h-16 text-foreground/5 -rotate-12" />
              <div className="space-y-1">
                <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">{kpi.label}</span>
                <div className="text-2xl font-black italic">{kpi.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Funnel Visualization (Module 8) */}
        <div className="grid lg:grid-cols-12 gap-8">
          <motion.div
            className="lg:col-span-7 glass-card rounded-[2.5rem] p-10 border-border/50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-sm font-black italic uppercase mb-8 flex items-center gap-3">
              <BarChart3 className="w-4 h-4 text-primary" />
              Acquisition Funnel
            </h3>

            <div className="space-y-6">
              {[
                { stage: 'Awareness', count: (kpis.leads || 0) * 10, percent: 100, color: 'bg-blue-500' },
                { stage: 'Interest', count: (kpis.leads || 0) * 4, percent: 40, color: 'bg-indigo-500' },
                { stage: 'Consideration', count: (kpis.leads || 0) * 2, percent: 20, color: 'bg-purple-500' },
                { stage: 'Conversion', count: (kpis.leads || 0), percent: 10, color: 'bg-primary' },
              ].map((stage, i) => (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span className="text-muted-foreground">{stage.stage}</span>
                    <span>{(stage.count || 0).toLocaleString()} Users</span>
                  </div>
                  <div className="h-10 bg-muted rounded-xl overflow-hidden relative group">
                    <motion.div
                      className={cn("h-full opacity-40 group-hover:opacity-60 transition-opacity", stage.color)}
                      initial={{ width: 0 }}
                      animate={{ width: `${stage.percent}%` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                    />
                    <div className="absolute inset-0 flex items-center px-4 font-black italic text-xs">
                      {stage.percent}% Retention
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skill Tree Matrix (Module 1/2) */}
          <motion.div
            className="lg:col-span-5 glass-card rounded-[2.5rem] p-10 border-border/50"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-sm font-black italic uppercase mb-8 flex items-center gap-3">
              <PieChart className="w-4 h-4 text-primary" />
              Competency Matrix
            </h3>

            <div className="space-y-8">
              {Object.entries(player.stats.skillTree).map(([skill, level], i) => (
                <div key={skill} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{skill}</span>
                        {level >= 8 && <Crown className="w-3 h-3 text-yellow-500" />}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black italic">LVL {level}</span>
                        <span className="text-[10px] font-bold text-primary uppercase opacity-80">
                          {level < 3 ? "Novice" : level < 7 ? "Pro" : "Elite"}
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                      {level >= 10 ? "MAX RANK" : "Complete Missions to Rank Up"}
                    </span>
                  </div>
                  <div className="flex gap-1 h-2 bg-black/20 rounded-full p-0.5 border border-white/5">
                    {[...Array(10)].map((_, step) => (
                      <div
                        key={step}
                        className={cn(
                          "h-full flex-1 rounded-full transition-all duration-500",
                          step < level
                            ? "bg-gradient-to-r from-primary to-amber-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]"
                            : "bg-white/5"
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center gap-4 text-muted-foreground">
                <Zap className="w-5 h-5 text-primary" />
                <p className="text-xs font-medium italic leading-relaxed">
                  Complete more <span className="text-foreground font-bold uppercase">Analytics missions</span> to unlock advanced conversion modeling.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Narrative & NPC Status (Module 9) */}
        <div className="glass-card rounded-[2.5rem] p-10 border-border/50">
          <h3 className="text-sm font-black italic uppercase mb-8 flex items-center gap-3">
            <Users2 className="w-4 h-4 text-primary" />
            Network Trust Levels
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(player.stats.trust).map(([npc, trust]) => (
              <div key={npc} className="flex items-center gap-6 p-6 rounded-3xl bg-muted/30 border border-border/50">
                <div className="w-16 h-16 rounded-2xl bg-gradient-gold p-1">
                  <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center text-2xl">
                    {npc === 'manager' ? '👩‍💼' : (npc === 'designer' ? '🎨' : '🏢')}
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span>{npc}</span>
                    <span>{trust}% Trust</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${trust}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

