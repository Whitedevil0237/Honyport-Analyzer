import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { MatrixRain } from '@/components/MatrixRain';
import { Shield, Terminal, UploadCloud, ChevronRight, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      <MatrixRain opacity={0.15} />
      
      {/* Decorative gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <header className="p-6 relative z-10 flex justify-between items-center border-b border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
            <div className="absolute inset-0 bg-primary/20 blur-md rounded-full" />
          </div>
          <span className="font-heading font-bold text-xl tracking-wider text-foreground">HONEYPORT</span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" className="font-mono text-sm hidden sm:flex hover:text-primary">Documentation</Button>
          <Button variant="ghost" className="font-mono text-sm hidden sm:flex hover:text-primary">API</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 text-center">
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 relative"
        >
          <div className="relative flex items-center justify-center w-32 h-32 mx-auto">
            <Shield className="w-24 h-24 text-primary relative z-10" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute inset-0 bg-primary/40 rounded-full blur-xl z-0"
            />
          </div>
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-heading text-5xl md:text-7xl font-bold mb-4 tracking-tight neon-text uppercase"
        >
          HoneyPort Analyzer
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="font-mono text-lg md:text-xl text-muted-foreground max-w-2xl mb-10"
        >
          Advanced Cybersecurity Simulation & Telemetry Platform
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto"
        >
          <Link href="/dashboard" className="w-full">
            <Button size="lg" className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-heading tracking-widest text-sm neon-border flex items-center gap-2 group">
              <Terminal size={18} />
              LAUNCH
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full text-left font-mono"
        >
          <div className="glass-panel p-6 rounded-lg border-t-2 border-t-primary">
            <Activity className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-bold mb-2 text-foreground">Threat Emulation</h3>
            <p className="text-sm text-muted-foreground">Generate realistic attack patterns including port scans, brute force, and honeypot engagements.</p>
          </div>
          <div className="glass-panel p-6 rounded-lg border-t-2 border-t-chart-2">
            <UploadCloud className="w-8 h-8 text-chart-2 mb-4" />
            <h3 className="text-lg font-bold mb-2 text-foreground">Log Ingestion</h3>
            <p className="text-sm text-muted-foreground">Upload sample CSV or JSON logs to visualize and analyze telemetry in a controlled environment.</p>
          </div>
          <div className="glass-panel p-6 rounded-lg border-t-2 border-t-chart-4">
            <Terminal className="w-8 h-8 text-chart-4 mb-4" />
            <h3 className="text-lg font-bold mb-2 text-foreground">SOC Experience</h3>
            <p className="text-sm text-muted-foreground">Train on a dark-mode interface designed to mimic professional Security Operations Center tools.</p>
          </div>
        </motion.div>
      </main>

      {/* Disclaimer Footer */}
      <footer className="relative z-10 p-4 border-t border-border bg-black/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center gap-3 text-xs font-mono text-muted-foreground">
          <Shield className="text-chart-2 w-4 h-4 shrink-0" />
          <p>
            <strong className="text-chart-2">EDUCATIONAL SIMULATION ONLY:</strong> This application analyzes uploaded or generated sample logs using predefined detection rules. It does not monitor live networks, connect to real honeypots, or detect real-time attacks.
          </p>
        </div>
      </footer>
    </div>
  );
}
