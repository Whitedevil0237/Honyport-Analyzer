import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  ShieldAlert, 
  Target,
  FileText,
  Download,
  Terminal,
  LogOut
} from 'lucide-react';
import { Link } from 'wouter';
import { MatrixRain } from '@/components/MatrixRain';
import { StatCard } from '@/components/StatCard';
import { LogTable } from '@/components/LogTable';
import { LogDetailPanel } from '@/components/LogDetailPanel';
import { SecurityCharts } from '@/components/Charts';
import { DomainScan } from '@/components/DomainScan';
import { ScenarioButtons } from '@/components/ScenarioButtons';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LogEntry, generateMixedAttack } from '@/lib/simulation';
import { exportToCSV, exportToPDF } from '@/lib/export';

export default function DashboardPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const { toast } = useToast();

  // Load initial mixed data on mount (simulated)
  React.useEffect(() => {
    setIsInitializing(true);
    setTimeout(() => {
      setLogs(generateMixedAttack());
      setIsInitializing(false);
    }, 1500);
  }, []);

  // Calculate stats based on current logs
  const stats = useMemo(() => {
    const total = logs.length;
    let safe = 0, warning = 0, critical = 0;
    let honeypotHits = 0, portScans = 0, bruteForce = 0;

    logs.forEach(l => {
      if (l.threatLevel === 'safe') safe++;
      if (l.threatLevel === 'warning') warning++;
      if (l.threatLevel === 'critical') critical++;
      
      if (l.event.toLowerCase().includes('honeypot') || l.status.includes('Honeypot')) honeypotHits++;
      if (l.detectionRule.includes('NMAP') || l.event.includes('Scan')) portScans++;
      if (l.detectionRule.includes('Brute-Force') || l.event.includes('Auth Failure')) bruteForce++;
    });

    // Score: 100 - (critical * 2 + warning * 0.5) / total * 100, clamped 0-100
    let score = 100;
    if (total > 0) {
      const penalty = ((critical * 2 + warning * 0.5) / total) * 100;
      score = Math.max(0, Math.round(100 - penalty));
    }

    return { total, safe, warning, critical, honeypotHits, portScans, bruteForce, score };
  }, [logs]);

  const handleGenerate = (newLogs: LogEntry[]) => {
    setIsInitializing(true);
    setTimeout(() => {
      setLogs(newLogs);
      setSelectedLog(null);
      setIsInitializing(false);
      toast({
        title: "Telemetry Ingested",
        description: `Loaded ${newLogs.length} events into analysis engine.`,
        className: "bg-card border-primary text-primary font-mono",
      });
    }, 800);
  };

  const handleExportPDF = () => {
    if (logs.length === 0) return;
    exportToPDF(logs, stats);
    toast({ title: "Report Exported", description: "PDF summary generated.", className: "font-mono" });
  };

  const handleExportCSV = () => {
    if (logs.length === 0) return;
    exportToCSV(logs);
    toast({ title: "Data Exported", description: "CSV raw log dump generated.", className: "font-mono" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <MatrixRain opacity={0.05} />

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <Shield className="text-primary group-hover:drop-shadow-[0_0_8px_rgba(0,255,65,0.8)] transition-all" />
              <span className="font-heading font-bold text-lg tracking-wider hidden sm:inline-block">HONEYPORT</span>
            </div>
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block mx-2" />
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-destructive/10 border border-destructive/50 text-destructive font-mono text-xs animate-pulse">
            <span className="w-2 h-2 rounded-full bg-destructive" />
            SIMULATION MODE
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="font-mono text-xs hidden sm:flex border-primary/30 hover:bg-primary/10">
            <Download size={14} className="mr-2" /> CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF} className="font-mono text-xs hidden sm:flex border-primary/30 hover:bg-primary/10">
            <FileText size={14} className="mr-2" /> PDF REPORT
          </Button>
          <Link href="/">
            <Button variant="ghost" size="icon" className="hover:bg-destructive/10 hover:text-destructive">
              <LogOut size={18} />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 max-w-[1600px] mx-auto w-full relative z-10 flex flex-col gap-6">
        
        {/* Loading Overlay */}
        <AnimatePresence>
          {isInitializing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center font-mono"
            >
              <Terminal className="w-12 h-12 text-primary mb-4 animate-pulse" />
              <div className="text-xl text-primary font-bold tracking-widest">INITIALIZING SYSTEMS</div>
              <div className="text-muted-foreground mt-2">Loading simulated telemetry...</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Controls: Scenarios & Upload */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ScenarioButtons onGenerate={handleGenerate} isGenerating={isInitializing} />
          </div>
          <div className="lg:col-span-1">
            <DomainScan onScanSuccess={handleGenerate} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <StatCard title="Total Logs" value={stats.total} icon={Activity} delay={0.1} />
          <StatCard title="Security Score" value={`${stats.score}%`} icon={Shield} color={stats.score > 80 ? 'primary' : stats.score > 50 ? 'warning' : 'critical'} delay={0.15} />
          <StatCard title="Safe Events" value={stats.safe} icon={Shield} delay={0.2} />
          <StatCard title="Warnings" value={stats.warning} icon={AlertTriangle} color="warning" delay={0.25} />
          <StatCard title="Critical" value={stats.critical} icon={ShieldAlert} color="critical" delay={0.3} />
          <StatCard title="HP Hits" value={stats.honeypotHits} icon={Target} color={stats.honeypotHits > 0 ? 'critical' : 'primary'} delay={0.35} />
          <StatCard title="Port Scans" value={stats.portScans} icon={Activity} color={stats.portScans > 0 ? 'warning' : 'primary'} delay={0.4} />
          <StatCard title="Brute Force" value={stats.bruteForce} icon={Activity} color={stats.bruteForce > 0 ? 'critical' : 'primary'} delay={0.45} />
        </div>

        {/* Main Split: Table & Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 h-full flex flex-col">
            <h2 className="font-heading text-lg font-bold mb-3 flex items-center gap-2"><Terminal size={18} className="text-primary"/> RAW TELEMETRY</h2>
            <LogTable logs={logs} onRowClick={setSelectedLog} />
          </div>
          <div className="xl:col-span-1 flex flex-col h-full overflow-hidden">
            <h2 className="font-heading text-lg font-bold mb-3 flex items-center gap-2"><Activity size={18} className="text-primary"/> THREAT ANALYSIS</h2>
            <div className="overflow-y-auto custom-scrollbar pr-2 pb-2">
              <SecurityCharts logs={logs} />
            </div>
          </div>
        </div>

      </main>

      {/* Educational Footer */}
      <footer className="relative z-10 p-3 border-t border-border bg-black text-center text-[10px] font-mono text-muted-foreground mt-auto">
        EDUCATIONAL SIMULATION ONLY - NO REAL DATA INGESTED
      </footer>

      {/* Slide-in Detail Panel */}
      <LogDetailPanel log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
}
