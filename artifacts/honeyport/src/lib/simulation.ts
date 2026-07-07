import { v4 as uuidv4 } from 'uuid';

export type ThreatLevel = 'safe' | 'warning' | 'critical';

export type LogEntry = {
  id: string;
  timestamp: string;
  sourceIp: string;
  destinationPort: number;
  service: string;
  event: string;
  detectionRule: string;
  threatLevel: ThreatLevel;
  status: string;
  details: {
    description: string;
    whyFlagged: string;
    riskLevel: string;
    recommendations: string[];
  };
};

const RANDOM_IPS = [
  '192.168.1.45', '10.0.0.12', '172.16.0.100', // Internal
  '45.33.32.156', '89.160.20.111', '103.45.2.19', '185.20.44.1', // External Suspicious
  '203.0.113.44', '198.51.100.22', '18.220.14.3' // Cloud
];

const SERVICES = [
  { port: 22, name: 'SSH' },
  { port: 80, name: 'HTTP' },
  { port: 443, name: 'HTTPS' },
  { port: 21, name: 'FTP' },
  { port: 3389, name: 'RDP' },
  { port: 3306, name: 'MySQL' },
  { port: 8080, name: 'HTTP-Alt' },
];

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateSafeLog(time: Date): LogEntry {
  const ip = RANDOM_IPS[Math.floor(Math.random() * 3)]; // Mostly internal
  const srv = SERVICES[Math.floor(Math.random() * 3)]; // Web or SSH
  return {
    id: uuidv4(),
    timestamp: time.toISOString(),
    sourceIp: ip,
    destinationPort: srv.port,
    service: srv.name,
    event: 'Connection Accepted',
    detectionRule: 'Default Allow',
    threatLevel: 'safe',
    status: 'Allowed',
    details: {
      description: `Standard connection attempt to ${srv.name} port.`,
      whyFlagged: 'Matches standard operational profile. No anomalies detected.',
      riskLevel: 'Low',
      recommendations: ['No action required.', 'Continue normal monitoring.']
    }
  };
}

export function generateNormalActivity(count = 50): LogEntry[] {
  const logs: LogEntry[] = [];
  const now = new Date();
  const start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  for (let i = 0; i < count; i++) {
    const time = randomDate(start, now);
    if (Math.random() > 0.9) {
      // Occasional warning
      logs.push({
        id: uuidv4(),
        timestamp: time.toISOString(),
        sourceIp: RANDOM_IPS[Math.floor(Math.random() * RANDOM_IPS.length)],
        destinationPort: 443,
        service: 'HTTPS',
        event: 'Malformed Packet',
        detectionRule: 'Anomaly-101',
        threatLevel: 'warning',
        status: 'Dropped',
        details: {
          description: 'Packet with invalid checksum detected.',
          whyFlagged: 'Possible network glitch or early reconnaissance.',
          riskLevel: 'Medium',
          recommendations: ['Monitor source IP for further unusual activity.']
        }
      });
    } else {
      logs.push(generateSafeLog(time));
    }
  }
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function generatePortScan(count = 20): LogEntry[] {
  const logs: LogEntry[] = [];
  const now = new Date();
  const scanIp = '185.20.44.1';
  let currentTime = new Date(now.getTime() - 1000 * 60 * 5); // 5 mins ago

  SERVICES.forEach((srv) => {
    currentTime = new Date(currentTime.getTime() + 1500); // 1.5 seconds apart
    logs.push({
      id: uuidv4(),
      timestamp: currentTime.toISOString(),
      sourceIp: scanIp,
      destinationPort: srv.port,
      service: srv.name,
      event: 'SYN Stealth Scan',
      detectionRule: 'NMAP-Signature-Match',
      threatLevel: 'warning',
      status: 'Blocked',
      details: {
        description: `Rapid SYN packets sent to port ${srv.port} without completing handshake.`,
        whyFlagged: 'Pattern matches automated port scanning tools (e.g., Nmap).',
        riskLevel: 'Medium-High',
        recommendations: [
          'Add source IP to temporary blocklist.',
          'Review firewall rules for exposed ports.',
          'Correlate with other recent scans.'
        ]
      }
    });
  });
  
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function generateSshBruteForce(count = 30): LogEntry[] {
  const logs: LogEntry[] = [];
  const now = new Date();
  const attackerIp = '103.45.2.19';
  let currentTime = new Date(now.getTime() - 1000 * 60 * 10); // 10 mins ago

  for (let i = 0; i < count; i++) {
    currentTime = new Date(currentTime.getTime() + Math.random() * 2000 + 500);
    const isSuccess = i === count - 1 && Math.random() > 0.8; // Maybe succeed at end
    
    logs.push({
      id: uuidv4(),
      timestamp: currentTime.toISOString(),
      sourceIp: attackerIp,
      destinationPort: 22,
      service: 'SSH',
      event: isSuccess ? 'Honeypot Compromise Simulation' : 'Auth Failure',
      detectionRule: 'Brute-Force-Threshold',
      threatLevel: 'critical',
      status: isSuccess ? 'Honeypot Engaged' : 'Rejected',
      details: {
        description: `Repeated SSH login failures using common username 'root'.`,
        whyFlagged: `Exceeded failed login threshold (5 attempts / min).`,
        riskLevel: 'Critical',
        recommendations: [
          'Immediately block source IP at edge firewall.',
          'Ensure SSH key-based authentication is enforced.',
          'Disable root login over SSH.'
        ]
      }
    });
  }
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function generateHoneypotInteraction(): LogEntry[] {
  const logs: LogEntry[] = [];
  const now = new Date();
  const attackerIp = '45.33.32.156';
  let currentTime = new Date(now.getTime() - 1000 * 60 * 30);

  const events = [
    { port: 22, srv: 'SSH', evt: 'Decoy Credential Used', rule: 'HP-Auth-Trap', lvl: 'critical' as ThreatLevel, status: 'Logged' },
    { port: 22, srv: 'SSH', evt: 'Suspicious Command: wget', rule: 'HP-Cmd-Malware-Drop', lvl: 'critical' as ThreatLevel, status: 'Simulated Exec' },
    { port: 8080, srv: 'HTTP-Alt', evt: 'DirBuster Scan', rule: 'HP-Web-Enum', lvl: 'warning' as ThreatLevel, status: 'Blocked' },
    { port: 3306, srv: 'MySQL', evt: 'SQLi Attempt', rule: 'HP-SQLi-Payload', lvl: 'critical' as ThreatLevel, status: 'Logged' },
  ];

  events.forEach((e) => {
    currentTime = new Date(currentTime.getTime() + Math.random() * 60000 + 10000);
    logs.push({
      id: uuidv4(),
      timestamp: currentTime.toISOString(),
      sourceIp: attackerIp,
      destinationPort: e.port,
      service: e.srv,
      event: e.evt,
      detectionRule: e.rule,
      threatLevel: e.lvl,
      status: e.status,
      details: {
        description: `Adversary interacted with simulated ${e.srv} honeypot service.`,
        whyFlagged: 'Direct engagement with non-production decoy systems.',
        riskLevel: 'High',
        recommendations: [
          'Capture malware payload for reverse engineering.',
          'Update IOCs in primary defense systems.',
          'Maintain honeypot engagement to gather C2 server data.'
        ]
      }
    });
  });

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function generateMixedAttack(): LogEntry[] {
  const logs = [
    ...generateNormalActivity(30),
    ...generatePortScan(),
    ...generateSshBruteForce(15),
    ...generateHoneypotInteraction()
  ];
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
