import React, { useState } from 'react';
import { LogEntry } from '@/lib/simulation';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter, ShieldAlert, ShieldCheck, ShieldOff } from 'lucide-react';

interface LogTableProps {
  logs: LogEntry[];
  onRowClick: (log: LogEntry) => void;
}

export function LogTable({ logs, onRowClick }: LogTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.sourceIp.includes(searchTerm) || 
      log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.destinationPort.toString().includes(searchTerm);
      
    const matchesFilter = filterLevel === 'all' || log.threatLevel === filterLevel;
    
    return matchesSearch && matchesFilter;
  });

  const getThreatIcon = (level: string) => {
    switch(level) {
      case 'critical': return <ShieldAlert size={14} className="mr-1" />;
      case 'warning': return <ShieldOff size={14} className="mr-1" />;
      default: return <ShieldCheck size={14} className="mr-1" />;
    }
  };

  const getThreatBadge = (level: string) => {
    switch(level) {
      case 'critical': 
        return <Badge variant="destructive" className="bg-destructive/20 text-destructive border-destructive/50 flex items-center shadow-[0_0_10px_rgba(255,0,0,0.5)]"><ShieldAlert size={12} className="mr-1"/> CRITICAL</Badge>;
      case 'warning': 
        return <Badge variant="outline" className="bg-chart-2/20 text-chart-2 border-chart-2/50 flex items-center"><ShieldOff size={12} className="mr-1"/> WARNING</Badge>;
      default: 
        return <Badge variant="outline" className="bg-primary/20 text-primary border-primary/50 flex items-center"><ShieldCheck size={12} className="mr-1"/> SAFE</Badge>;
    }
  };

  return (
    <div className="glass-panel rounded-lg flex flex-col h-[500px] overflow-hidden">
      <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/40">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search IPs, events, ports..."
            className="w-full bg-background/50 border-primary/30 pl-9 font-mono text-sm focus-visible:ring-primary/50 text-foreground placeholder:text-muted-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select 
            className="bg-background/50 border border-primary/30 rounded-md p-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 w-full sm:w-auto appearance-none"
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option value="all">ALL THREAT LEVELS</option>
            <option value="safe">SAFE ONLY</option>
            <option value="warning">WARNINGS ONLY</option>
            <option value="critical">CRITICAL ONLY</option>
          </select>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar">
        <Table>
          <TableHeader className="bg-background/80 sticky top-0 z-10">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-heading text-xs tracking-wider text-muted-foreground w-[100px]">TIMESTAMP</TableHead>
              <TableHead className="font-heading text-xs tracking-wider text-muted-foreground">SOURCE IP</TableHead>
              <TableHead className="font-heading text-xs tracking-wider text-muted-foreground">PORT/SRV</TableHead>
              <TableHead className="font-heading text-xs tracking-wider text-muted-foreground">EVENT</TableHead>
              <TableHead className="font-heading text-xs tracking-wider text-muted-foreground">RULE</TableHead>
              <TableHead className="font-heading text-xs tracking-wider text-muted-foreground">THREAT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="font-mono text-xs">
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  NO LOGS MATCHING CRITERIA
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow 
                  key={log.id} 
                  className="cursor-pointer border-border/50 transition-colors hover:bg-primary/10 data-[state=selected]:bg-primary/20"
                  onClick={() => onRowClick(log)}
                >
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                  </TableCell>
                  <TableCell className="text-primary">{log.sourceIp}</TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">{log.destinationPort}</span> / {log.service}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={log.event}>{log.event}</TableCell>
                  <TableCell className="text-muted-foreground text-[10px]">{log.detectionRule}</TableCell>
                  <TableCell>{getThreatBadge(log.threatLevel)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
