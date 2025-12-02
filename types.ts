

export enum NodeType {
  SERVICE = 'SERVICE',
  DATABASE = 'DATABASE',
  GATEWAY = 'GATEWAY',
  QUEUE = 'QUEUE',
  CACHE = 'CACHE',
  CLIENT = 'CLIENT'
}

export interface NodeData {
  id: string;
  label: string;
  type: NodeType;
  tech: string;
  status: 'optimal' | 'warning' | 'critical';
  details?: string; // Additional details for the node
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface EdgeData {
  source: string;
  target: string;
  protocol: string; // e.g., gRPC, REST, TCP
  latency: number; // Simulated latency in ms
}

export interface SecurityAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  component: string;
  issue: string;
  fix: string;
}

export interface SimulationMetric {
  time: string; // 00:00
  load: number; // concurrent users
  latency: number; // ms
  errors: number; // error rate %
}

export interface VickyBlueprint {
  projectId: string;
  name: string;
  timestamp?: number; // Created at timestamp
  nodes: NodeData[];
  edges: EdgeData[];
  securityReport: SecurityAlert[];
  simulationData: SimulationMetric[];
  // Context & General
  godModePrompt: string; 
  // Specific Domain Specifications
  requirementsSpec: string; // New: Product Requirements Document (PRD)
  frontendSpec: string;
  backendSpec: string;
  databaseSpec: string;
}

export interface ChatMessage {
  role: 'user' | 'vicky';
  content: string;
  timestamp: number;
}

export interface ThemeConfig {
  primaryColor: string;
  primaryForeground?: string;

  secondaryColor?: string;
  secondaryForeground?: string;

  accentColor?: string;
  accentForeground?: string;

  // Base
  background?: string;
  foreground?: string;

  // Card
  card?: string;
  cardForeground?: string;

  // Popover
  popover?: string;
  popoverForeground?: string;

  // Muted
  muted?: string;
  mutedForeground?: string;

  // Destructive
  destructive?: string;
  destructiveForeground?: string;

  // Border & Input
  border?: string;
  input?: string;
  ring?: string;

  // Charts
  chart1?: string;
  chart2?: string;
  chart3?: string;
  chart4?: string;
  chart5?: string;

  // Sidebar
  sidebar?: string;
  sidebarForeground?: string;
  sidebarPrimary?: string;
  sidebarPrimaryForeground?: string;
  sidebarAccent?: string;
  sidebarAccentForeground?: string;
  sidebarBorder?: string;
  sidebarRing?: string;
  
  // Typography
  fontSans: string;
  fontSerif: string;
  fontMono: string;
  letterSpacing: number; // in em

  radius: number; // in rem equivalent usually, e.g. 0.5
  spacing: number; // in rem
  
  // Shadow
  shadowColor: string;
  shadowOpacity: number;
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  shadowSpread: number;

  style: 'default' | 'new-york' | 'flat';
  mode: 'light' | 'dark';
  
  // Responsive Simulation
  viewport: 'responsive' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}