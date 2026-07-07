import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: 'primary' | 'warning' | 'critical';
  delay?: number;
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp, 
  color = 'primary',
  delay = 0 
}: StatCardProps) {
  
  const [displayValue, setDisplayValue] = useState(0);
  const isNumeric = typeof value === 'number' || !isNaN(Number(value.toString().replace(/[^0-9.-]+/g,"")));
  const numericTarget = isNumeric ? Number(value.toString().replace(/[^0-9.-]+/g,"")) : 0;
  const prefix = typeof value === 'string' && value.includes('%') ? '' : '';
  const suffix = typeof value === 'string' && value.includes('%') ? '%' : '';

  useEffect(() => {
    if (!isNumeric) return;
    
    let start = 0;
    const end = numericTarget;
    if (start === end) {
      setDisplayValue(end);
      return;
    }
    
    let totalDuration = 1000;
    let incrementTime = Math.max(totalDuration / end, 16); 
    
    // For large numbers, cap the number of steps
    if (end > 1000) incrementTime = 16;
    
    let timer = setInterval(() => {
      start += Math.max(Math.ceil(end / (totalDuration / incrementTime)), 1);
      if (start >= end) {
        clearInterval(timer);
        setDisplayValue(end);
      } else {
        setDisplayValue(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, isNumeric, numericTarget]);

  const colorStyles = {
    primary: 'text-primary neon-border',
    warning: 'text-chart-2 neon-border-warning',
    critical: 'text-destructive neon-border-critical'
  };

  const bgStyles = {
    primary: 'bg-primary/10',
    warning: 'bg-chart-2/10',
    critical: 'bg-destructive/10'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`glass-panel p-4 rounded-lg flex flex-col justify-between ${color === 'critical' ? 'border-destructive/30' : color === 'warning' ? 'border-chart-2/30' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-md ${bgStyles[color]}`}>
          <Icon size={16} className={colorStyles[color].split(' ')[0]} />
        </div>
      </div>
      
      <div className="mt-2">
        <div className={`text-3xl font-heading font-bold ${colorStyles[color].split(' ')[0]} neon-text tracking-widest`}>
          {isNumeric ? `${prefix}${displayValue.toLocaleString()}${suffix}` : value}
        </div>
        
        {trend && (
          <div className="mt-2 flex items-center text-xs font-mono">
            <span className={trendUp ? 'text-destructive' : 'text-primary'}>
              {trendUp ? '↑' : '↓'} {trend}
            </span>
            <span className="text-muted-foreground ml-2 text-[10px]">vs last hr</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
