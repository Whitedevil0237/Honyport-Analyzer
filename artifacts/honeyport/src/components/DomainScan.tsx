import React, { useState } from 'react';
import { Globe, ScanSearch, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateMixedAttack, LogEntry } from '@/lib/simulation';
import { motion, AnimatePresence } from 'framer-motion';

interface DomainScanProps {
  onScanSuccess: (logs: LogEntry[]) => void;
}

const DOMAIN_PATTERN = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63})+$/;

export function DomainScan({ onScanSuccess }: DomainScanProps) {
  const [domain, setDomain] = useState('');
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isScanning || success) return;
    const trimmed = domain.trim();

    if (!trimmed) {
      setError('Enter a domain name to scan.');
      return;
    }
    if (!DOMAIN_PATTERN.test(trimmed)) {
      setError('Enter a valid domain, e.g. example.com');
      return;
    }

    setError('');
    setIsScanning(true);

    // Simulate scan/telemetry-ingestion delay for effect
    setTimeout(() => {
      const logs = generateMixedAttack();
      setIsScanning(false);
      setSuccess(true);
      setTimeout(() => {
        onScanSuccess(logs);
        setSuccess(false);
      }, 1000);
    }, 1500);
  };

  return (
    <div className="glass-panel rounded-lg p-6 flex flex-col items-center justify-center text-center font-mono relative overflow-hidden">

      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/90 z-10 flex flex-col items-center justify-center backdrop-blur-sm"
          >
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
            <div className="text-primary font-bold animate-pulse">SCANNING DOMAIN...</div>
            <div className="text-xs text-muted-foreground mt-2">Simulating telemetry for {domain}</div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary/20 z-10 flex flex-col items-center justify-center backdrop-blur-sm border border-primary"
          >
            <CheckCircle className="text-primary w-16 h-16 mb-4" />
            <div className="text-primary font-bold text-xl">SCAN COMPLETE</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full h-40 flex flex-col items-center justify-center gap-3">
        <Globe className="w-10 h-10 mb-1 text-muted-foreground" />
        <p className="text-sm text-foreground font-bold">
          Enter a domain to simulate a scan
        </p>
        <p className="text-xs text-muted-foreground mb-1">
          No real network requests are made
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-2 items-stretch justify-center max-w-sm">
          <Input
            type="text"
            placeholder="e.g. example.com"
            value={domain}
            disabled={isScanning || success}
            onChange={(e) => { setDomain(e.target.value); if (error) setError(''); }}
            className="bg-background/50 border-primary/30 font-mono text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50"
          />
          <Button
            type="submit"
            variant="outline"
            disabled={isScanning || success}
            className="font-mono text-xs border-primary/30 hover:bg-primary/10 whitespace-nowrap flex items-center gap-2"
          >
            <ScanSearch size={14} /> SCAN
          </Button>
        </form>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}
