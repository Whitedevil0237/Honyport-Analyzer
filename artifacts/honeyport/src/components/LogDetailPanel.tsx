import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, FileText, Server, AlertTriangle, Crosshair, CheckCircle2 } from 'lucide-react';
import { LogEntry } from '@/lib/simulation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface LogDetailPanelProps {
  log: LogEntry | null;
  onClose: () => void;
}

export function LogDetailPanel({ log, onClose }: LogDetailPanelProps) {
  if (!log) return null;

  const isCritical = log.threatLevel === 'critical';
  const isWarning = log.threatLevel === 'warning';
  
  const headerColor = isCritical ? 'bg-destructive/20 border-destructive' : 
                      isWarning ? 'bg-chart-2/20 border-chart-2' : 
                      'bg-primary/20 border-primary';
                      
  const textColor = isCritical ? 'text-destructive' : 
                    isWarning ? 'text-chart-2' : 
                    'text-primary';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-background/95 backdrop-blur-xl border-l border-border shadow-2xl z-50 flex flex-col font-mono"
      >
        {/* Header */}
        <div className={`p-4 border-b ${headerColor} flex justify-between items-center`}>
          <div className="flex items-center gap-2">
            {isCritical ? <ShieldAlert className="text-destructive" /> : 
             isWarning ? <AlertTriangle className="text-chart-2" /> : 
             <CheckCircle2 className="text-primary" />}
            <h2 className={`font-heading font-bold uppercase tracking-widest ${textColor} text-lg`}>
              Event Analysis
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-background/20 text-foreground">
            <X size={18} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          
          {/* Main Info */}
          <div>
            <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center"><FileText size={12} className="mr-2"/> Summary</h3>
            <div className="glass-panel p-4 rounded-md">
              <div className="text-lg font-bold text-foreground mb-1">{log.event}</div>
              <div className="text-sm text-muted-foreground">{log.details.description}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center"><Crosshair size={12} className="mr-2"/> Source IP</h3>
              <div className="text-primary font-bold">{log.sourceIp}</div>
            </div>
            <div>
              <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center"><Server size={12} className="mr-2"/> Target Service</h3>
              <div className="text-foreground">{log.service} <span className="text-muted-foreground">(Port {log.destinationPort})</span></div>
            </div>
            <div>
              <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Timestamp</h3>
              <div className="text-xs text-foreground">{new Date(log.timestamp).toLocaleString()}</div>
            </div>
            <div>
              <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Status</h3>
              <Badge variant="outline" className="border-border text-xs">{log.status}</Badge>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Analysis */}
          <div>
            <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Diagnostic Context</h3>
            <div className="space-y-4">
              <div>
                <span className="text-muted-foreground text-xs block mb-1">Triggered Rule:</span>
                <code className="bg-muted text-foreground px-2 py-1 rounded text-xs">{log.detectionRule}</code>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block mb-1">Why it was flagged:</span>
                <p className="text-sm text-foreground leading-relaxed">{log.details.whyFlagged}</p>
              </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Recommendations */}
          <div>
            <h3 className={`text-xs uppercase tracking-wider mb-3 font-bold ${textColor}`}>Actionable Recommendations</h3>
            <ul className="space-y-2">
              {log.details.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start text-sm">
                  <span className={`mr-2 mt-0.5 ${textColor}`}>&gt;</span>
                  <span className="text-foreground/90">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Raw JSON View */}
          <div className="pt-4">
            <details className="group">
              <summary className="text-xs text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-primary transition-colors flex items-center">
                <span className="mr-2">RAW JSON PAYLOAD</span>
                <span className="group-open:rotate-180 transition-transform text-xs">▼</span>
              </summary>
              <pre className="mt-2 bg-black/50 p-3 rounded-md text-[10px] text-primary/70 overflow-x-auto border border-border">
                {JSON.stringify(log, null, 2)}
              </pre>
            </details>
          </div>

        </div>
        
        {/* Footer Action */}
        <div className="p-4 border-t border-border bg-background/50">
          <Button 
            className="w-full font-heading tracking-widest bg-primary text-primary-foreground hover:bg-primary/80 neon-border"
            onClick={onClose}
          >
            ACKNOWLEDGE EVENT
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
