import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, ENERGY_COST_PER_TASK } from '@/store/gameStore';
import { OFFICE_ROOMS, GAME_LEVELS, OFFICE_HUB_IMAGE } from '@/data/levels';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Briefcase,
  FileText,
  Settings,
  Trophy,
  ChevronRight,
  Zap,
  Star,
  Crown,
  Volume2,
  VolumeX,
  Award,
  Flame,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Users2,
  Calendar,
  Coins,
  Activity,
  Clock,
  Heart,
  LogOut,
  ArrowDownRight,
  LineChart as LineChartIcon,
  Star as StarIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudio } from '@/hooks/useAudio';
import { OfficeCharacters } from './OfficeCharacters';
import { PlayerAvatarDisplay } from './PlayerAvatarDisplay';
import { ThemeToggle } from './ThemeToggle';
import { AIAssistant } from './AIAssistant';
import { ResponsiveContainer, ComposedChart, Area, Line, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { toast } from 'sonner';

const parseTimeToMinutes = (timeStr: string) => {
  const [time, period] = timeStr.split(' ');
  let [hours, mins] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + mins;
};

export const OfficeHub: React.FC = () => {
  const {
    player,
    setScreen,
    setCurrentRoom,
    checkStaminaRegen,
    isLevelUnlocked,
    toggleMusic,
    resetGame,
    gameTime,
    growthData,
    isClockedIn,
    isResting,
    clockIn,
    clockOut,
    sleep
  } = useGameStore();
  const { isMusicPlaying, playSfx } = useAudio();
  const [activeCharacter, setActiveCharacter] = useState<string | undefined>();

  const isLateNight = isResting && parseTimeToMinutes(gameTime) >= 22 * 60; // After 10 PM
  const isMorning = isResting && parseTimeToMinutes(gameTime) < 9 * 60; // Before 9 AM
  const isExhausted = player.stats.energy < ENERGY_COST_PER_TASK && !player.isPremium;

  const [timeLeft, setTimeLeft] = useState<{ lives: string | null; energy: string | null }>({ lives: null, energy: null });

  useEffect(() => {
    const timer = setInterval(() => {
      if (!player) return;

      const now = new Date().getTime();
      let livesStr = null;
      let energyStr = null;

      // Life Timer (2 minutes for sequential regen)
      if (player.lives < 3 && player.lastLifeLostAt) {
        const lastLost = new Date(player.lastLifeLostAt).getTime();
        const diff = Math.max(0, (120 * 1000) - (now - lastLost)); // 120s regen
        if (diff > 0) {
          const mins = Math.floor(diff / 60000);
          const secs = Math.floor((diff % 60000) / 1000);
          livesStr = `${mins}:${secs.toString().padStart(2, '0')}`;
        }
      }

      // Energy Timer (15 seconds for 10% regen)
      if (player.stats.energy < 100) {
        const lastRegen = player.lastStaminaRegenAt ? new Date(player.lastStaminaRegenAt).getTime() : 0;
        const diff = Math.max(0, (15 * 1000) - (now - lastRegen)); // 15s regen
        if (diff > 0) {
          const secs = Math.floor((diff % 60000) / 1000);
          energyStr = `${secs}s`;
        }
      }

      setTimeLeft({ lives: livesStr, energy: energyStr });
    }, 1000);

    return () => clearInterval(timer);
  }, [player]);

  if (!player) return null;

  const completedCount = player.completedLevels.length;
  const totalLevels = GAME_LEVELS.length;

  const xpToNextLevel = (player.level * 1000) - player.xp;
  const currentLevelXp = player.xp - ((player.level - 1) * 1000);
  const levelProgress = (currentLevelXp / 1000) * 100;

  const handleRoomClick = (roomId: string) => {
    // Requirements bypassed: Everything Unlocked
    playSfx('transition');
    setCurrentRoom(roomId);
    setScreen('room');
  };

  const getNetworkRank = (reputation: number) => {
    if (reputation >= 90) return "TOP 1%";
    if (reputation >= 70) return "TOP 5%";
    if (reputation >= 50) return "TOP 15%";
    if (reputation >= 30) return "TOP 30%";
    return "TOP 50%";
  };

  const currentImpactRevenue = player.stats.performanceKPIs.revenue || 0;
  const previousImpactRevenue = growthData.length > 1 ? growthData[growthData.length - 2].revenue : 0;
  const impactChangePercent = previousImpactRevenue > 0
    ? ((currentImpactRevenue - previousImpactRevenue) / previousImpactRevenue * 100).toFixed(1)
    : "14.4"; // Fallback aesthetic value if no history

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground transition-colors duration-500">
      {/* Background System */}
      <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px]" />

      {/* World Particles & Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.02)_0%,transparent_100%)] pointer-events-none" />

      {/* Clock In Overlay if not clocked in */}
      <AnimatePresence>
        {(!isClockedIn || isLateNight || isExhausted) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-background/90 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card rounded-[3rem] p-12 text-center max-w-lg border-primary/20 bg-card shadow-2xl"
            >
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
                {isLateNight ? <Star className="w-12 h-12 text-primary animate-pulse" /> : <Clock className="w-12 h-12 text-primary" />}
              </div>

              <h2 className="text-3xl font-black italic uppercase mb-4">
                {isLateNight ? "Shift Complete" : (isExhausted ? "Status: Exhausted" : "Morning Protocol")}
              </h2>

              <p className="text-muted-foreground font-medium mb-10 leading-relaxed italic">
                {isLateNight
                  ? "The office is closed for the night. Rest up, regain your energy, and we'll see you at 09:00 AM sharp."
                  : isExhausted
                    ? "Agent, your neural energy levels are critical. You must return home and rest before the next calibration cycle."
                    : "Ready to push the metrics? Your shift starts now. Clock in to access the department modules and begin your missions."}
              </p>

              <div className="flex flex-col gap-4 w-full">
                {isLateNight ? (
                  <Button
                    variant="glow"
                    size="xl"
                    className="w-full rounded-[2rem] h-20 text-xl font-black italic group"
                    onClick={() => {
                      sleep();
                      playSfx('success');
                    }}
                  >
                    SLEEP UNTIL MORNING
                    <Star className="w-6 h-6 ml-4 group-hover:scale-125 transition-transform" />
                  </Button>
                ) : isExhausted ? (
                  <div className="space-y-4 w-full">
                    <Button
                      variant="glow"
                      size="xl"
                      className="w-full rounded-[2rem] h-20 text-xl font-black italic group bg-destructive hover:bg-destructive/90 shadow-destructive/20 border-destructive/50"
                      onClick={() => {
                        sleep();
                        playSfx('success');
                      }}
                    >
                      GO HOME & REST
                      <Star className="w-6 h-6 ml-4 group-hover:rotate-12 transition-transform" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground"
                      onClick={clockOut}
                    >
                      Just Clock Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 w-full">
                    <Button
                      variant="glow"
                      size="xl"
                      className="w-full rounded-[2rem] h-20 text-xl font-black italic group"
                      onClick={() => {
                        clockIn();
                        playSfx('success');
                      }}
                    >
                      CLOCK IN :: 09:00 AM
                      <ChevronRight className="w-6 h-6 ml-4 group-hover:translate-x-2 transition-transform" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full rounded-2xl h-14 text-[10px] font-black uppercase tracking-[0.2em] opacity-60 hover:opacity-100"
                      onClick={() => {
                        sleep();
                        playSfx('click');
                      }}
                    >
                      Skip Day :: Sleep
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main UI Layer */}
      <div className="relative z-10 p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">

        {/* TOP COMMAND BAR */}
        <header className="flex flex-col xl:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 bg-card/80 backdrop-blur-md px-6 py-3 rounded-[2rem] border border-border shadow-xl shadow-primary/5 w-full xl:w-auto overflow-hidden">
            <div className="shrink-0">
              <PlayerAvatarDisplay
                size="sm"
                expression="happy"
                gesture="idle"
                showStats={false}
                showName={false}
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary truncate">Day {player.worldState.currentDay} • {player.role}</span>
              </div>
              <h1 className="text-xl font-black italic tracking-tight uppercase flex items-center gap-2 truncate">
                {player.name}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 bg-black/40 backdrop-blur-xl px-4 md:px-8 py-4 rounded-[2rem] md:rounded-full border border-white/10 shadow-2xl w-full xl:w-auto">
            {/* WORLD TIME */}
            <div className="flex items-center gap-3 md:gap-4 pr-4 md:pr-8 border-r border-white/10">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-black italic text-amber-500 leading-none">{gameTime || "09:00 AM"}</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Hours</span>
              </div>
            </div>

            {/* LIVES */}
            <div className="flex items-center gap-3 md:gap-4 px-4 md:px-8 border-r border-white/10">
              <div className="flex items-center gap-1 md:gap-1.5">
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    className={cn("w-4 h-4 md:w-5 md:h-5", i < (player.lives || 3) ? "fill-destructive text-destructive" : "text-white/10")}
                  />
                ))}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60 leading-none">Status</span>
                <div className="flex flex-col gap-0.5 mt-1">
                  {timeLeft.lives && (
                    <span className="text-[7px] font-bold text-destructive animate-pulse tracking-tighter uppercase">HEART REGEN: {timeLeft.lives}</span>
                  )}
                  {timeLeft.energy && (
                    <span className="text-[7px] font-bold text-primary animate-pulse tracking-tighter uppercase">ENERGY REGEN: {timeLeft.energy}</span>
                  )}
                </div>
              </div>
            </div>

            {/* ENERGY */}
            <div className="flex items-center gap-3 md:gap-4 px-4 md:px-8 border-r border-white/10">
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-amber-500 shrink-0" />
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-black italic leading-none text-white">{player.stats.energy}%</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Energy</span>
              </div>
            </div>

            {/* CREDITS */}
            <div className="flex items-center gap-3 md:gap-4 px-4 md:px-8 border-r border-white/10">
              <Coins className="w-5 h-5 md:w-6 md:h-6 text-amber-500 shrink-0" />
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-black italic leading-none text-white">{player.tokens}</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Credits</span>
              </div>
            </div>

            {/* CLOCK OUT / SLEEP */}
            <div className="flex items-center">
              {isClockedIn ? (
                <button
                  onClick={clockOut}
                  className="flex items-center gap-3 md:gap-4 pl-4 md:pl-8 group"
                >
                  <LogOut className="w-5 h-5 md:w-6 md:h-6 text-white/40 group-hover:text-destructive transition-colors shrink-0" />
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] md:text-[12px] font-black uppercase tracking-tighter leading-none text-white group-hover:text-destructive transition-colors">Clock Out</span>
                    <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest hidden sm:inline">End Shift</span>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => { sleep(); playSfx('success'); }}
                  className="flex items-center gap-3 md:gap-4 pl-4 md:pl-8 group"
                >
                  <Star className="w-5 h-5 md:w-6 md:h-6 text-amber-500 group-hover:text-amber-400 transition-colors shrink-0" />
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] md:text-[12px] font-black uppercase tracking-tighter leading-none text-amber-500 group-hover:text-amber-400 transition-colors">Go Home</span>
                    <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest hidden sm:inline">Sleep</span>
                  </div>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="glass"
              size="icon"
              onClick={() => { setScreen('portfolio'); playSfx('click'); }}
              title="Career Portfolio"
              className="bg-primary/5 border-primary/20"
            >
              <Briefcase className="w-5 h-5 text-primary" />
            </Button>
            <ThemeToggle />
            <Button variant="glass" size="icon" onClick={() => { toggleMusic(); playSfx('click'); }}>
              {isMusicPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
            <Button variant="glass" size="icon" onClick={() => setScreen('settings')}><Settings className="w-5 h-5" /></Button>
          </div>
        </header>

        {/* DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* GROWTH CHART PANEL (NEW STYLE FROM IMAGE) */}
          <motion.div
            className="lg:col-span-8 bg-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-border shadow-2xl shadow-primary/5 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-black italic uppercase tracking-tight">Market Trajectory</h3>
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest truncate">Leads vs Revenue</p>
                </div>
              </div>
              <div className="text-left sm:text-right w-full sm:w-auto">
                <span className="text-[10px] font-black uppercase text-primary">Current Impact</span>
                <div className="text-2xl md:text-3xl font-black italic">₹{currentImpactRevenue.toLocaleString()}</div>
                <div className={cn(
                  "flex items-center gap-1 font-black italic text-[10px] justify-start sm:justify-end",
                  currentImpactRevenue >= previousImpactRevenue ? "text-success" : "text-destructive"
                )}>
                  <ArrowDownRight className={cn("w-2.5 h-2.5", currentImpactRevenue >= previousImpactRevenue && "rotate-180")} />
                  <span>{impactChangePercent}%</span>
                </div>
              </div>
            </div>

            <div className="h-[250px] md:h-[300px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(255,255,255,0.05)"
                  />

                  <XAxis
                    dataKey="timestamp"
                    hide
                  />
                  <YAxis
                    yAxisId="left"
                    hide
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    hide
                  />

                  <Tooltip
                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      backdropFilter: 'blur(10px)',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '1.5rem',
                      fontSize: '10px',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                    }}
                    itemStyle={{ padding: '2px 0' }}
                  />

                  {/* Volume Bars - Leads */}
                  <Bar
                    yAxisId="right"
                    dataKey="leads"
                    barSize={20}
                    radius={[4, 4, 0, 0]}
                  >
                    {growthData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill="url(#colorLeads)"
                        className="filter drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                      />
                    ))}
                  </Bar>

                  {/* Trend Area - Revenue */}
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="none"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />

                  {/* Trend Line - Revenue */}
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0ea5e9"
                    strokeWidth={4}
                    dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0, className: "animate-pulse" }}
                    animationDuration={2000}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Overlay Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-8 mt-8 relative z-10 border-t border-border pt-8">
              <div className="space-y-1">
                <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Total Leads</span>
                <div className="text-lg md:text-xl font-black italic">{player.stats.performanceKPIs.leads.toLocaleString()}</div>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Market Share</span>
                <div className="text-lg md:text-xl font-black italic">{player.stats.reputation}% GRP</div>
              </div>
              <div className="space-y-1 sm:col-span-1 col-span-2">
                <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Network Rank</span>
                <div className="text-lg md:text-xl font-black italic">{getNetworkRank(player.stats.reputation)}</div>
              </div>
            </div>
          </motion.div>

          {/* KPI Real-time Panel */}
          <motion.div
            className="lg:col-span-4 bg-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-border shadow-2xl shadow-primary/5 relative group"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center justify-between mb-8 md:mb-10">
              <h3 className="font-black italic text-xl tracking-tight uppercase">KPI Analytics</h3>
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            </div>

            <div className="space-y-4 md:space-y-6">
              {[
                { label: 'ROAS', value: `${player.stats.performanceKPIs.roas.toFixed(1)}x`, color: 'text-primary' },
                { label: 'Conv. Rate', value: `${player.stats.performanceKPIs.conversionRate.toFixed(1)}%`, color: 'text-foreground' },
                { label: 'Total Leads', value: player.stats.performanceKPIs.leads.toLocaleString(), color: 'text-foreground' },
                { label: 'CAC', value: `₹${player.stats.performanceKPIs.cac}`, color: 'text-destructive' },
                { label: 'STIPEND', value: `₹${Math.floor(player.stats.performanceKPIs.stipend || 0).toLocaleString()}`, color: 'text-success' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-end border-b border-border pb-3">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</span>
                  <span className={cn("text-xl md:text-2xl font-black italic tracking-tighter", item.color)}>{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 md:mt-8 p-4 rounded-2xl bg-muted/30 border border-border/50 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Target Stipend Pool: ₹10,000
            </div>

            <div className="space-y-3 mt-6">
              <button
                className="w-full text-[10px] font-black uppercase tracking-[0.3em] bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl h-14 shadow-lg shadow-primary/20 transition-all font-bold flex items-center justify-center gap-2"
                onClick={() => setScreen('simulation')}
              >
                Analyze Simulation
              </button>
              <button
                className="w-full text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 text-foreground hover:bg-white/10 rounded-2xl h-14 transition-all font-bold border border-white/10 flex items-center justify-center gap-2 group"
                onClick={() => setScreen('portfolio')}
              >
                <Briefcase className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                Professional Portfolio
              </button>
            </div>
          </motion.div>
        </div>

        {/* DEPARTMENT GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {OFFICE_ROOMS.map((room, index) => {
            const departmentLevels = GAME_LEVELS.filter(l => room.levels.includes(l.id));
            const completedInRoom = departmentLevels.filter(l => player.completedLevels.includes(l.id)).length;

            // Special unlock logic for Executive Suite (manager room)
            const isUnlocked = room.id === 'manager'
              ? player.completedLevels.length >= 10 // Unlock after completing all 10 levels
              : departmentLevels.some(l => isLevelUnlocked(l.id));

            return (
              <motion.button
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={isUnlocked ? { y: -8, scale: 1.01 } : {}}
                onClick={() => isUnlocked && handleRoomClick(room.id)}
                className={cn(
                  "room-card text-left p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border-2 transition-all duration-500 relative overflow-hidden group shadow-xl",
                  isUnlocked
                    ? "bg-card border-border hover:border-primary shadow-primary/5"
                    : "bg-muted/80 border-transparent opacity-90 cursor-not-allowed overflow-hidden"
                )}
              >
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
                    <div className="bg-background/80 p-4 rounded-2xl flex flex-col items-center gap-2 border border-white/10 shadow-2xl">
                      <ShieldCheck className="w-8 h-8 text-primary/40" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Calibration Required</span>
                    </div>
                  </div>
                )}

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6 md:mb-8">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-muted/50 flex items-center justify-center text-3xl md:text-4xl shadow-inner group-hover:scale-110 transition-transform duration-500 border border-border">
                      {room.icon}
                    </div>
                    {isUnlocked && <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground group-hover:text-primary transition-all" />}
                  </div>

                  <h3 className="text-xl md:text-2xl font-black uppercase italic mb-2 md:mb-3 tracking-tighter leading-none">{room.name}</h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-2 mb-6 md:mb-8 font-bold uppercase tracking-tight opacity-60">
                    {room.description}
                  </p>

                  <div className="space-y-3 md:space-y-4">
                    <div className="flex justify-between items-end text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <span>Sync Progress</span>
                      <span className="text-primary">{Math.round((completedInRoom / (departmentLevels.length || 1)) * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary shadow-[0_0_10px_rgba(234,179,8,0.3)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${(completedInRoom / (departmentLevels.length || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
