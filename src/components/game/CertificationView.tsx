import React, { useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Download,
  Share2,
  Award,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Star,
  Globe,
  Crown,
  Sparkles,
  FileBadge,
  Medal,
  Cpu,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const CertificationView: React.FC = () => {
  const { player, setScreen, currentCertificateType } = useGameStore();
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!player) return null;

  const handleDownload = () => {
    window.print();
  };

  const masteryPercentage = (player.completedLevels.length / 10) * 100;

  const getCertificateData = () => {
    switch (currentCertificateType) {
      case 'marketing':
        return { title: 'Marketing Strategist', levels: [1, 2], color: 'text-blue-400' };
      case 'ads':
        return { title: 'Paid Media Specialist', levels: [3, 4], color: 'text-red-400' };
      case 'content':
        return { title: 'Content Architect', levels: [5, 6], color: 'text-green-400' };
      case 'creative':
        return { title: 'Visual Designer', levels: [7, 8], color: 'text-purple-400' };
      case 'analytics':
        return { title: 'Data Scientist', levels: [9, 10], color: 'text-amber-400' };
      default:
        return { title: 'Master Growth Strategist', levels: Array.from({ length: 10 }, (_, i) => i + 1), color: 'text-primary' };
    }
  };

  const cert = getCertificateData();
  const isMaster = currentCertificateType === 'master' || !currentCertificateType;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 py-12 px-6 md:px-12 flex flex-col items-center">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(234,179,8,0.15)_0%,transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')] opacity-[0.02] pointer-events-none" />

      {/* Modern Header */}
      <header className="w-full max-w-6xl flex items-center justify-between mb-16 relative z-10">
        <div className="flex items-center gap-6">
          <Button
            variant="glass"
            size="icon"
            onClick={() => setScreen('portfolio')}
            className="rounded-2xl border-white/10 bg-white/5 hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex flex-col">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80">Global Ledger Verification</h2>
            <h1 className="text-xl md:text-2xl font-black italic tracking-tight uppercase leading-none mt-1">Certification Portal</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="glass" size="sm" className="rounded-xl h-11 px-6 font-black uppercase tracking-widest text-[10px] border-white/10">
            <Share2 className="w-4 h-4 mr-2" />
            Share Credential
          </Button>
          <Button
            variant="glow"
            size="sm"
            className="rounded-xl h-11 px-8 font-black uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(234,179,8,0.3)]"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Export High-Res PDF
          </Button>
        </div>
      </header>

      <main className="w-full max-w-6xl space-y-16 relative z-10">
        {/* THE HOLOGRAPHIC CERTIFICATE */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative group "
        >
          {/* Outer Glow */}
          <div className="absolute inset-0 bg-primary/20 blur-[120px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          <div
            ref={certificateRef}
            className="bg-[#0a0a0a] border-[12px] border-double border-white/10 p-12 md:p-24 rounded-[0.5rem] relative overflow-hidden aspect-[1.414/1] flex flex-col items-center text-center shadow-[0_0_100px_rgba(0,0,0,0.5)]"
          >
            {/* Holographic Overlays */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')] opacity-[0.02] pointer-events-none" />

            {/* Corner Emblems */}
            <div className="absolute top-0 left-0 p-12 opacity-20">
              <Cpu className="w-12 h-12 text-primary" />
            </div>
            <div className="absolute top-0 right-0 p-12 opacity-20 text-right">
              <div className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Grade</div>
              <div className="text-[10px] font-bold opacity-50 uppercase">Serial: MC-{player.id.substring(0, 6).toUpperCase()}</div>
            </div>

            {/* Center Seal Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
              <ShieldCheck className="w-[45rem] h-[45rem]" />
            </div>

            {/* Header Content */}
            <div className="space-y-6 mb-16 relative z-10 pt-8">
              <div className="flex items-center justify-center gap-4 text-primary">
                <div className="h-px w-12 bg-primary/30" />
                <Medal className={cn("w-14 h-14", cert.color)} />
                <div className="h-px w-12 bg-primary/30" />
              </div>
              <div>
                <h2 className="text-[12px] font-black uppercase tracking-[0.6em] text-primary/60 mb-2">Diploma of Professional Excellence</h2>
                <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none text-white">
                  {cert.title.split(' ').map((word, i) => (
                    <span key={i} className={i === 0 ? "text-white" : cn(cert.color, "italic ml-2")}>{word}</span>
                  ))}
                </h1>
              </div>
            </div>

            {/* Core Body */}
            <div className="space-y-12 flex-1 flex flex-col justify-center relative z-10">
              <div className="space-y-4">
                <p className="text-[13px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60">This high-standing credential is awarded to</p>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-6xl md:text-9xl font-black italic text-white tracking-tighter uppercase leading-none drop-shadow-2xl"
                >
                  {player.name}
                </motion.h3>
              </div>

              <div className="max-w-3xl mx-auto space-y-6">
                <p className="text-lg md:text-2xl font-medium text-white/70 leading-relaxed italic border-x border-white/5 px-12">
                  For completing the rigorous <span className={cn("font-black uppercase tracking-widest", cert.color)}>{cert.title} Challenge</span> with full operational clearance.
                  Demonstrated elite competence in Digital Strategy, Performance Marketing, and Data Architecture.
                </p>
                <div className="flex justify-center gap-6">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{player.xp} XP Accumulated</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                    <Star className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Rank: {player.role}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer / Authenticators */}
            <div className="w-full flex items-end justify-between mt-16 relative z-10 px-8">
              <div className="flex flex-col items-start gap-4">
                <div className="space-y-2">
                  <div className="h-px w-56 bg-white/10" />
                  <p className="text-[11px] font-black uppercase tracking-widest text-white/90">Elena Vasquez</p>
                  <p className="text-[9px] font-bold uppercase tracking-tighter text-primary/60">Lead Architect, NovaTech Ecosystem</p>
                </div>
                <div className="text-[9px] font-black uppercase text-white/20 font-mono tracking-widest">
                  VERIFICATION_HASH: {player.id.toUpperCase()}
                </div>
              </div>

              <div className="w-40 h-40 relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20 animate-spin-slow" />
                <div className="absolute inset-4 rounded-full border border-primary/10" />
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center border-2 border-primary/30 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                  <ShieldCheck className="w-14 h-14 text-primary drop-shadow-[0_0_10px_rgba(234_179,8,0.5)]" />
                </div>
              </div>

              <div className="flex flex-col items-end gap-4">
                <div className="space-y-2 text-right">
                  <div className="h-px w-56 bg-white/10" />
                  <p className="text-[11px] font-black uppercase tracking-widest text-white/90">Vikram Singh</p>
                  <p className="text-[9px] font-bold uppercase tracking-tighter text-primary/60">Executive Oversight, MarketCraft</p>
                </div>
                <div className="text-[9px] font-black uppercase text-white/20 font-mono tracking-widest">
                  TIMESTAMP: {new Date().toISOString().substring(0, 10).replaceAll('-', '.')}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* METRICS & MASTERY SUMMARY */}
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card rounded-[2.5rem] p-10 border-white/5 relative overflow-hidden group"
          >
            <div className="text-center space-y-8">
              <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                <Cpu className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-black italic tracking-widest uppercase">Operational Mastery</h3>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">Overall Phase Completion</p>
              </div>
              <div className="relative pt-4">
                <div className="flex justify-between text-[10px] font-black uppercase mb-3">
                  <span className="text-primary">{masteryPercentage}% Optimized</span>
                  <span className="opacity-50">100% Target</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${masteryPercentage}%` }}
                    className="h-full bg-gradient-gold rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {player.stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="glass-card rounded-[2.5rem] p-10 border-white/5 relative overflow-hidden group"
            >
              <div className="text-center space-y-8">
                <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-black italic tracking-widest uppercase">Strategic Impact</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">Validated Performance KPIs</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[8px] font-black opacity-50 block mb-1">ROAS</span>
                    <span className="text-xl font-black italic">{player.stats.performanceKPIs?.roas.toFixed(1) || '0.0'}x</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[8px] font-black opacity-50 block mb-1">CONV.</span>
                    <span className="text-xl font-black italic">{player.stats.performanceKPIs?.conversionRate || '0.0'}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-card rounded-[2.5rem] p-10 border-white/5 relative overflow-hidden group"
          >
            <div className="text-center space-y-8">
              <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                <Globe className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-black italic tracking-widest uppercase">Global Standing</h3>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">Reputation Index Score</p>
              </div>
              <div className="py-6">
                <div className="text-4xl font-black italic text-white tracking-tighter uppercase leading-none">
                  Tier 1 Agent
                </div>
                <p className="text-[10px] mt-4 opacity-50 font-bold tracking-widest uppercase italic">
                  Top 0.5% of Global Cohort
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Call */}
        <div className="flex justify-center gap-6 pt-8">
          <Button variant="outline" className="h-14 px-12 rounded-2xl font-black uppercase tracking-widest border-white/10 hover:bg-white/5" onClick={() => setScreen('portfolio')}>
            Back to Career Hub
          </Button>
          <Button variant="glow" className="h-14 px-12 rounded-2xl font-black uppercase tracking-widest" onClick={handleDownload}>
            Secure Verification Record
          </Button>
        </div>
      </main>
    </div>
  );
};
