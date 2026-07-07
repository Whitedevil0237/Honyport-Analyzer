import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Area, AreaChart
} from 'recharts';
import { LogEntry } from '@/lib/simulation';

interface ChartsProps {
  logs: LogEntry[];
}

export function SecurityCharts({ logs }: ChartsProps) {
  // 1. Threat Distribution (Pie)
  const pieData = useMemo(() => {
    const counts = { safe: 0, warning: 0, critical: 0 };
    logs.forEach(l => counts[l.threatLevel]++);
    return [
      { name: 'Safe', value: counts.safe, color: 'hsl(120, 100%, 50%)' }, // primary
      { name: 'Warning', value: counts.warning, color: 'hsl(45, 100%, 50%)' }, // chart-2
      { name: 'Critical', value: counts.critical, color: 'hsl(0, 100%, 50%)' } // destructive
    ].filter(d => d.value > 0);
  }, [logs]);

  // 2. Target Ports (Bar)
  const barData = useMemo(() => {
    const ports: Record<string, number> = {};
    logs.forEach(l => {
      const p = l.destinationPort.toString();
      ports[p] = (ports[p] || 0) + 1;
    });
    return Object.entries(ports)
      .map(([port, count]) => ({ port: `Port ${port}`, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7); // top 7
  }, [logs]);

  // 3. Timeline (Area)
  const timelineData = useMemo(() => {
    if (logs.length === 0) return [];
    
    // Group by hour or 10-minute intervals depending on time span
    const timeMap: Record<string, { time: string, safe: number, warning: number, critical: number, timestamp: number }> = {};
    
    logs.forEach(l => {
      const d = new Date(l.timestamp);
      // Format: HH:MM, rounding to nearest 10 mins
      const mins = Math.floor(d.getMinutes() / 10) * 10;
      const key = `${d.getHours().toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      
      if (!timeMap[key]) {
        timeMap[key] = { time: key, safe: 0, warning: 0, critical: 0, timestamp: d.getTime() };
      }
      timeMap[key][l.threatLevel]++;
    });

    return Object.values(timeMap).sort((a, b) => a.timestamp - b.timestamp);
  }, [logs]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 rounded-md text-sm font-mono z-50">
          <p className="text-foreground mb-1 pb-1 border-b border-border font-bold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="flex justify-between gap-4">
              <span>{entry.name}:</span>
              <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      {/* Chart 1: Threat Distribution */}
      <div className="glass-panel p-4 rounded-lg flex flex-col h-[300px]">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-heading mb-4">Event Distribution</h3>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Timeline */}
      <div className="glass-panel p-4 rounded-lg flex flex-col h-[300px]">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-heading mb-4">Attack Timeline</h3>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(120, 100%, 50%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(120, 100%, 50%)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 100%, 50%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(0, 100%, 50%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={10} 
                tickMargin={10} 
                axisLine={false} 
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={10} 
                axisLine={false} 
                tickLine={false}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="critical" name="Critical" stroke="hsl(0, 100%, 50%)" fillOpacity={1} fill="url(#colorCritical)" />
              <Area type="monotone" dataKey="warning" name="Warning" stroke="hsl(45, 100%, 50%)" fill="none" />
              <Area type="monotone" dataKey="safe" name="Safe" stroke="hsl(120, 100%, 50%)" fillOpacity={1} fill="url(#colorSafe)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Top Targeted Ports */}
      <div className="glass-panel p-4 rounded-lg flex flex-col h-[300px] md:col-span-2">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-heading mb-4">Targeted Ports Frequency</h3>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="port" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={10} 
                tickMargin={10} 
                axisLine={false} 
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={10} 
                axisLine={false} 
                tickLine={false}
              />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted)/0.2)' }} />
              <Bar dataKey="count" name="Hits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
    </div>
  );
}
