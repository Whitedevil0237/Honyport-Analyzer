import React from 'react';
import { Button } from '@/components/ui/button';
import { Activity, SearchCode, Key, Target, Layers } from 'lucide-react';
import { 
  generateNormalActivity, 
  generatePortScan, 
  generateSshBruteForce, 
  generateHoneypotInteraction, 
  generateMixedAttack,
  LogEntry
} from '@/lib/simulation';

interface ScenarioButtonsProps {
  onGenerate: (logs: LogEntry[]) => void;
  isGenerating?: boolean;
}

export function ScenarioButtons({ onGenerate, isGenerating }: ScenarioButtonsProps) {
  
  const handleScenario = (generatorFn: () => LogEntry[]) => {
    if (isGenerating) return;
    // We add a tiny delay to allow UI to show loading state if parent implements it
    setTimeout(() => {
      onGenerate(generatorFn());
    }, 50);
  };

  const scenarios = [
    {
      name: 'Normal Traffic',
      icon: Activity,
      desc: 'Routine network behavior',
      color: 'hover:border-primary hover:text-primary',
      action: () => generateNormalActivity(50)
    },
    {
      name: 'Port Scan',
      icon: SearchCode,
      desc: 'Sequential recon sweep',
      color: 'hover:border-chart-2 hover:text-chart-2',
      action: () => generatePortScan(20)
    },
    {
      name: 'SSH Brute Force',
      icon: Key,
      desc: 'Aggressive auth attacks',
      color: 'hover:border-destructive hover:text-destructive',
      action: () => generateSshBruteForce(30)
    },
    {
      name: 'Honeypot Trap',
      icon: Target,
      desc: 'Active deception engagement',
      color: 'hover:border-chart-5 hover:text-chart-5',
      action: () => generateHoneypotInteraction()
    },
    {
      name: 'Mixed APT',
      icon: Layers,
      desc: 'Multi-vector advanced threat',
      color: 'border-primary/50 text-primary shadow-[0_0_10px_rgba(0,255,65,0.2)] hover:bg-primary hover:text-primary-foreground',
      action: () => generateMixedAttack()
    }
  ];

  return (
    <div className="glass-panel p-4 rounded-lg">
      <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-heading mb-4">Simulation Scenarios</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {scenarios.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Button
              key={idx}
              variant="outline"
              disabled={isGenerating}
              onClick={() => handleScenario(s.action)}
              className={`h-auto py-3 flex flex-col items-center justify-center gap-2 bg-background/50 border-border transition-all ${s.color} font-mono`}
            >
              <Icon size={20} />
              <div className="text-center">
                <div className="text-xs font-bold">{s.name}</div>
              </div>
            </Button>
          )
        })}
      </div>
    </div>
  );
}
