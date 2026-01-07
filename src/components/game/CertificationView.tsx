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
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const CertificationView: React.FC = () => {
  const { player, setScreen } = useGameStore();
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!player) return null;

  const handleDownload = () => {
    // In a real app, we'd use something like html2canvas or generate a PDF
    window.print();
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 py-12 px-6 md:px-12 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-5xl flex items-center justify-between mb-12">
        <div className="flex items-center gap-6">
          <Button
            variant="glass"
            size="icon"
            onClick={() => setScreen('portfolio')}
            className="rounded-2xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex flex-col">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Credential Verification</h2>
            <h1 className="text-xl font-black italic tracking-tight uppercase">Academic Honors</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[10px]">
            <Share2 className="w-4 h-4 mr-2" />
            Share Link
          </Button>
          <Button 
            variant="glow" 
            size="sm" 
            className="rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[10px]"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </header>

      <main className="w-full max-w-5xl space-y-12">
        {/* THE CERTIFICATE */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group"
        >
          {/* Certificate Shadow Decor */}
          <div className="absolute inset-0 bg-primary/10 blur-[100px] -z-10 group-hover:bg-primary/20 transition-all duration-1000" />
          
          <div 
            ref={certificateRef}
            className="bg-card border-8 border-double border-primary/20 p-12 md:p-20 rounded-[1rem] relative overflow-hidden aspect-[1.414/1] flex flex-col items-center text-center shadow-2xl"
          >
            {/* Corner Decor */}
            <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-primary/30 m-8" />
            <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-primary/30 m-8" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-primary/30 m-8" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-primary/30 m-8" />

            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <ShieldCheck className="w-[40rem] h-[40rem]" />
            </div>

            {/* Header */}
            <div className="space-y-4 mb-12 relative z-10">
              <div className="flex items-center justify-center gap-2 text-primary mb-6">
                <Award className="w-12 h-12" />
              </div>
              <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-muted-foreground opacity-60">Certificate of Completion</h2>
              <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">MarketCraft Mastery</h1>
            </div>

            {/* Body */}
            <div className="space-y-8 flex-1 flex flex-col justify-center relative z-10">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground mb-2">This credential is proudly presented to</p>
                <h3 className="text-5xl md:text-7xl font-black italic text-primary tracking-tighter uppercase">{player.name}</h3>
              </div>

              <div className="max-w-2xl mx-auto">
                <p className="text-lg md:text-xl font-medium text-foreground/80 leading-relaxed italic">
                  For demonstrating exceptional strategic prowess and technical execution in the field of Digital Marketing. 
                  Having successfully completed the 10-Day NovaTech Growth Simulation with a rank of <span className="text-primary font-black uppercase tracking-widest">{player.role}</span>.
                </p>
              </div>
            </div>

            {/* Footer / Seals */}
            <div className="w-full flex items-end justify-between mt-12 relative z-10">
              <div className="flex flex-col items-start gap-4">
                <div className="space-y-1">
                  <div className="h-px w-48 bg-border" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Elena Vasquez</p>
                  <p className="text-[8px] font-bold uppercase tracking-tighter text-primary/60">Lead Strategist, NovaTech</p>
                </div>
                <div className="text-[8px] font-black uppercase text-muted-foreground/40 font-mono">
                  ID: {player.id.substring(0, 18).toUpperCase()}
                </div>
              </div>

              <div className="w-32 h-32 relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20 animate-spin-slow" />
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/30">
                  <ShieldCheck className="w-12 h-12 text-primary" />
                </div>
              </div>

              <div className="flex flex-col items-end gap-4">
                <div className="space-y-1 text-right">
                  <div className="h-px w-48 bg-border" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vikram Singh</p>
                  <p className="text-[8px] font-bold uppercase tracking-tighter text-primary/60">Executive Director, NovaTech</p>
                </div>
                <div className="text-[8px] font-black uppercase text-muted-foreground/40 font-mono">
                  ISSUE DATE: {new Date().toLocaleDateString().toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* STATS BREAKDOWN (MODULE 1/2) */}
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-[2rem] p-8 border-border/50 space-y-6"
          >
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Skill Matrix</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(player.stats.skillTree).map(([skill, level]) => (
                <div key={skill} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span>{skill}</span>
                    <span className="text-primary">LVL {level}</span>
                  </div>
                  <div className="h-1 w-full bg-muted rounded-full">
                    <div className="h-full bg-primary" style={{ width: `${(level/10)*100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-[2rem] p-8 border-border/50 space-y-6"
          >
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-primary" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Performance KPIs</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                <span className="text-[8px] font-black uppercase opacity-50 block mb-1">ROAS</span>
                <span className="text-lg font-black italic">{player.stats.performanceKPIs.roas.toFixed(1)}x</span>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                <span className="text-[8px] font-black uppercase opacity-50 block mb-1">Leads</span>
                <span className="text-lg font-black italic">{player.stats.performanceKPIs.leads.toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                <span className="text-[8px] font-black uppercase opacity-50 block mb-1">XP Points</span>
                <span className="text-lg font-black italic">{player.xp.toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                <span className="text-[8px] font-black uppercase opacity-50 block mb-1">Stipend Earned</span>
                <span className="text-lg font-black italic">₹{(player.stats.performanceKPIs.stipend || 0).toLocaleString()}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-[2rem] p-8 border-border/50 space-y-6"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Global Ranking</h3>
            </div>
            <div className="space-y-6">
              <div className="text-center p-6 rounded-3xl bg-primary/5 border-2 border-primary/20 relative overflow-hidden group">
                <Award className="w-12 h-12 text-primary/20 absolute -top-2 -right-2 rotate-12 group-hover:scale-125 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">Network Status</span>
                <div className="text-3xl font-black italic uppercase italic">Top 1% Agent</div>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium uppercase leading-relaxed italic text-center">
                This certification confirms the user has achieved a global reputation index of {player.stats.reputation} GRP within the MarketCraft protocol.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

