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
        {/* THE PREMIUM CERTIFICATE */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative group"
        >
          {/* Outer Premium Glow */}
          <div className="absolute -inset-8 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />

          <div
            ref={certificateRef}
            className="relative bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#0a0a0a] rounded-sm overflow-hidden shadow-[0_20px_100px_rgba(0,0,0,0.8)]"
          >
            {/* Ornate Border System */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Outer Border - Gold */}
              <div className="absolute inset-0 border-[3px] border-primary/40" />

              {/* Inner Border - Double Line */}
              <div className="absolute inset-[12px] border-[1.5px] border-primary/20" />
              <div className="absolute inset-[18px] border-[0.5px] border-primary/10" />

              {/* Decorative Corners */}
              <div className="absolute top-0 left-0 w-32 h-32 border-t-[3px] border-l-[3px] border-primary/60" />
              <div className="absolute top-0 right-0 w-32 h-32 border-t-[3px] border-r-[3px] border-primary/60" />
              <div className="absolute bottom-0 left-0 w-32 h-32 border-b-[3px] border-l-[3px] border-primary/60" />
              <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[3px] border-r-[3px] border-primary/60" />

              {/* Corner Ornaments */}
              <div className="absolute top-6 left-6 w-6 h-6 border-2 border-primary/40 rotate-45" />
              <div className="absolute top-6 right-6 w-6 h-6 border-2 border-primary/40 rotate-45" />
              <div className="absolute bottom-6 left-6 w-6 h-6 border-2 border-primary/40 rotate-45" />
              <div className="absolute bottom-6 right-6 w-6 h-6 border-2 border-primary/40 rotate-45" />
            </div>

            {/* Premium Background Texture */}
            <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }} />

            {/* Radial Gradient Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.03)_0%,transparent_70%)]" />

            {/* Certificate Content */}
            <div className="relative p-16 md:p-24 lg:p-32 aspect-[1.414/1] flex flex-col">

              {/* Header Section */}
              <div className="text-center space-y-8 mb-12">
                {/* Top Seal */}
                <div className="flex items-center justify-center gap-6">
                  <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-primary/30 flex items-center justify-center bg-gradient-to-br from-primary/10 to-transparent shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                      <Medal className="w-10 h-10 text-primary" />
                    </div>
                    <div className="absolute -inset-2 rounded-full border border-primary/10" />
                  </div>
                  <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                </div>

                {/* Institution Header */}
                <div className="space-y-3">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-primary/70 letterspacing">
                    Diploma of Professional Excellence
                  </h2>
                  <div className="h-[1px] w-48 mx-auto bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                </div>

                {/* Certificate Title */}
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight leading-tight">
                    <span className="text-white/90">Master </span>
                    <span className={cn("bg-gradient-to-r from-primary via-amber-400 to-primary bg-clip-text text-transparent", cert.color)}>
                      Growth Strategist
                    </span>
                  </h1>
                </div>
              </div>

              {/* Body Section */}
              <div className="flex-1 flex flex-col justify-center space-y-10 text-center">
                <div className="space-y-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
                    This credential is hereby conferred upon
                  </p>

                  {/* Recipient Name */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="relative py-6"
                  >
                    <h3 className="text-5xl md:text-7xl lg:text-8xl font-serif italic text-white tracking-tight leading-none">
                      {player.name}
                    </h3>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                  </motion.div>
                </div>

                {/* Achievement Description */}
                <div className="max-w-3xl mx-auto space-y-6">
                  <p className="text-base md:text-lg font-serif text-white/70 leading-relaxed px-8">
                    For demonstrating exceptional mastery in completing the rigorous{' '}
                    <span className="font-bold text-primary">Master Growth Strategist Challenge</span>,
                    encompassing Digital Strategy, Performance Marketing, Creative Development, and Data Architecture.
                  </p>

                  {/* Achievement Badges */}
                  <div className="flex justify-center gap-4 pt-4">
                    <div className="px-5 py-2.5 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">{player.xp} XP</span>
                      </div>
                    </div>
                    <div className="px-5 py-2.5 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">{player.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Section - Signatures & Seal */}
              <div className="mt-auto pt-16">
                <div className="grid grid-cols-3 gap-8 items-end">
                  {/* Left Signature */}
                  <div className="text-left space-y-3">
                    <div className="h-[1px] w-full bg-gradient-to-r from-primary/30 to-transparent" />
                    <div>
                      <p className="text-sm font-semibold text-white/90 tracking-wide">Elena Vasquez</p>
                      <p className="text-[10px] font-medium text-primary/60 uppercase tracking-wider">Lead Architect</p>
                      <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">NovaTech Ecosystem</p>
                    </div>
                  </div>

                  {/* Center Seal */}
                  <div className="flex justify-center">
                    <div className="relative w-32 h-32">
                      {/* Rotating Border */}
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20 animate-spin-slow" />

                      {/* Seal Background */}
                      <div className="absolute inset-3 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-2 border-primary/40 shadow-[0_0_40px_rgba(234,179,8,0.3)]">
                        <div className="absolute inset-0 rounded-full flex items-center justify-center">
                          <ShieldCheck className="w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]" />
                        </div>
                      </div>

                      {/* Seal Text Ring */}
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-primary/60">Official Seal</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Signature */}
                  <div className="text-right space-y-3">
                    <div className="h-[1px] w-full bg-gradient-to-l from-primary/30 to-transparent" />
                    <div>
                      <p className="text-sm font-semibold text-white/90 tracking-wide">Vikram Singh</p>
                      <p className="text-[10px] font-medium text-primary/60 uppercase tracking-wider">Executive Director</p>
                      <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">MarketCraft Institute</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Metadata */}
                <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  <div>Certificate ID: MC-{player.id.substring(0, 8).toUpperCase()}</div>
                  <div>Issued: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  <div>Verification: {player.id.substring(0, 6).toUpperCase()}</div>
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
