import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { LogEntry, generateMixedAttack } from './simulation';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export function exportToCSV(logs: LogEntry[], filename = 'honeyport-logs.csv') {
  const data = logs.map(log => ({
    Timestamp: log.timestamp,
    'Source IP': log.sourceIp,
    'Destination Port': log.destinationPort,
    Service: log.service,
    Event: log.event,
    'Detection Rule': log.detectionRule,
    'Threat Level': log.threatLevel.toUpperCase(),
    Status: log.status,
    'Risk Level': log.details.riskLevel,
    Description: log.details.description
  }));

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToPDF(logs: LogEntry[], summaryStats: any, filename = 'honeyport-report.pdf') {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(0, 255, 65); // Neon green
  doc.text('HoneyPort Analyzer Simulator', 14, 22);
  
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text('Security Simulation Report', 14, 32);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 40);

  // Disclaimer
  doc.setFontSize(9);
  doc.setTextColor(200, 50, 50);
  doc.text('EDUCATIONAL SIMULATION ONLY - NOT REAL NETWORK DATA', 14, 50);

  // Summary Stats
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text('Summary Statistics', 14, 65);
  
  const statsData = [
    ['Total Logs', summaryStats.total],
    ['Critical Threats', summaryStats.critical],
    ['Warning Events', summaryStats.warning],
    ['Safe Events', summaryStats.safe],
    ['Security Score', `${summaryStats.score}%`],
  ];

  autoTable(doc, {
    startY: 70,
    head: [['Metric', 'Value']],
    body: statsData,
    theme: 'grid',
    headStyles: { fillColor: [5, 10, 5], textColor: [0, 255, 65] },
    alternateRowStyles: { fillColor: [240, 255, 240] },
    margin: { bottom: 20 }
  });

  // Top Critical Threats Table
  const criticalLogs = logs.filter(l => l.threatLevel === 'critical').slice(0, 20);
  
  const firstTableY = (doc as any).lastAutoTable?.finalY ?? 90;
  doc.text('Recent Critical Threats (Top 20)', 14, firstTableY + 15);
  
  const threatData = criticalLogs.map(log => [
    new Date(log.timestamp).toLocaleTimeString(),
    log.sourceIp,
    log.event,
    log.service,
    log.details.riskLevel
  ]);

  if (threatData.length > 0) {
    autoTable(doc, {
      startY: firstTableY + 20,
      head: [['Time', 'Source IP', 'Event', 'Service', 'Risk']],
      body: threatData,
      theme: 'grid',
      headStyles: { fillColor: [200, 0, 0], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
    });
  } else {
    doc.setFontSize(10);
    doc.text('No critical threats detected in this sample.', 14, firstTableY + 25);
  }

  doc.save(filename);
}

// Minimal stub for parsing uploaded logs
export function parseUploadedLog(fileContent: string, fileName: string): LogEntry[] {
  // In a real app, this would be robust. Here we'll just mock it based on extension
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (extension === 'csv') {
    // Parse CSV (Simplified)
    const res = Papa.parse(fileContent, { header: true });
    // mapping logic would go here, returning mock logs for now
  }
  
  // Just return a mixed attack scenario as a fallback for the simulation
  // This simulates successfully "parsing" a file and finding threats.
  return generateMixedAttack();
}
