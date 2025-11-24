
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { analyzeArchitecture } from './services/nexusAi';
import { NexusBlueprint, ChatMessage, NodeData, ThemeConfig } from './types';
import { NodeCanvas } from './components/NodeCanvas';
import { SimulationHub } from './components/SimulationHub';
import { ThemeEditor } from './components/ThemeEditor';
import { 
  Mic, Send, ShieldAlert, Terminal, Activity, Code, Save, 
  GitBranch, Filter, X, Copy, Check, Layout, Settings,
  Plus, FolderClock, MessageSquare, Trash2, Archive
} from 'lucide-react';

const DEFAULT_CSS_TEMPLATE = `[CSS_VARS]
:root {
  --background: {{BACKGROUND}};
  --foreground: {{FOREGROUND}};
  --card: {{CARD}};
  --card-foreground: {{CARD_FOREGROUND}};
  --popover: {{POPOVER}};
  --popover-foreground: {{POPOVER_FOREGROUND}};
  --primary: {{PRIMARY_COLOR}};
  --primary-foreground: {{PRIMARY_FOREGROUND}};
  --secondary: {{SECONDARY_COLOR}};
  --secondary-foreground: {{SECONDARY_FOREGROUND}};
  --muted: {{MUTED}};
  --muted-foreground: {{MUTED_FOREGROUND}};
  --accent: {{ACCENT_COLOR}};
  --accent-foreground: {{ACCENT_FOREGROUND}};
  --destructive: {{DESTRUCTIVE}};
  --destructive-foreground: {{DESTRUCTIVE_FOREGROUND}};
  --border: {{BORDER}};
  --input: {{INPUT}};
  --ring: {{RING}};
  --chart-1: {{CHART_1}};
  --chart-2: {{CHART_2}};
  --chart-3: {{CHART_3}};
  --chart-4: {{CHART_4}};
  --chart-5: {{CHART_5}};
  --sidebar: {{SIDEBAR}};
  --sidebar-foreground: {{SIDEBAR_FOREGROUND}};
  --sidebar-primary: {{SIDEBAR_PRIMARY}};
  --sidebar-primary-foreground: {{SIDEBAR_PRIMARY_FOREGROUND}};
  --sidebar-accent: {{SIDEBAR_ACCENT}};
  --sidebar-accent-foreground: {{SIDEBAR_ACCENT_FOREGROUND}};
  --sidebar-border: {{SIDEBAR_BORDER}};
  --sidebar-ring: {{SIDEBAR_RING}};
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --radius: {{RADIUS}}rem;
  --shadow-x: 0;
  --shadow-y: 1px;
  --shadow-blur: 3px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.1;
  --shadow-color: oklch(0 0 0);
  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
  --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
  --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10);
  --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10);
  --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10);
  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
}

.dark {
  --background: {{BACKGROUND}};
  --foreground: {{FOREGROUND}};
  --card: {{CARD}};
  --card-foreground: {{CARD_FOREGROUND}};
  --popover: {{POPOVER}};
  --popover-foreground: {{POPOVER_FOREGROUND}};
  --primary: {{PRIMARY_COLOR}};
  --primary-foreground: {{PRIMARY_FOREGROUND}};
  --secondary: {{SECONDARY_COLOR}};
  --secondary-foreground: {{SECONDARY_FOREGROUND}};
  --muted: {{MUTED}};
  --muted-foreground: {{MUTED_FOREGROUND}};
  --accent: {{ACCENT_COLOR}};
  --accent-foreground: {{ACCENT_FOREGROUND}};
  --destructive: {{DESTRUCTIVE}};
  --destructive-foreground: {{DESTRUCTIVE_FOREGROUND}};
  --border: {{BORDER}};
  --input: {{INPUT}};
  --ring: {{RING}};
  --chart-1: {{CHART_1}};
  --chart-2: {{CHART_2}};
  --chart-3: {{CHART_3}};
  --chart-4: {{CHART_4}};
  --chart-5: {{CHART_5}};
  --sidebar: {{SIDEBAR}};
  --sidebar-foreground: {{SIDEBAR_FOREGROUND}};
  --sidebar-primary: {{SIDEBAR_PRIMARY}};
  --sidebar-primary-foreground: {{SIDEBAR_PRIMARY_FOREGROUND}};
  --sidebar-accent: {{SIDEBAR_ACCENT}};
  --sidebar-accent-foreground: {{SIDEBAR_ACCENT_FOREGROUND}};
  --sidebar-border: {{SIDEBAR_BORDER}};
  --sidebar-ring: {{SIDEBAR_RING}};
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --radius: {{RADIUS}}rem;
  --shadow-x: 0;
  --shadow-y: 1px;
  --shadow-blur: 3px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.1;
  --shadow-color: oklch(0 0 0);
  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
  --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
  --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10);
  --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10);
  --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10);
  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);
}
[/CSS_VARS]`;

const App: React.FC = () => {
  const [input, setInput] = useState('');
  
  // Theme State
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
    primaryColor: '#fafafa', 
    primaryForeground: '#18181b',
    secondaryColor: '#27272a',
    secondaryForeground: '#fafafa',
    accentColor: '#3f3f46',
    accentForeground: '#fafafa',
    // Base defaults
    background: '#09090b',
    foreground: '#fafafa',
    // Card defaults
    card: '#09090b',
    cardForeground: '#fafafa',
    // Popover defaults
    popover: '#09090b',
    popoverForeground: '#fafafa',
    // Muted defaults
    muted: '#27272a',
    mutedForeground: '#a1a1aa',
    // Destructive defaults
    destructive: '#7f1d1d',
    destructiveForeground: '#fafafa',
    // Border & Input defaults
    border: '#27272a',
    input: '#27272a',
    ring: '#a1a1aa',
    
    // Chart defaults
    chart1: '#91c5ff',
    chart2: '#3a81f6',
    chart3: '#2563ef',
    chart4: '#1a4eda',
    chart5: '#1f3fad',

    // Sidebar defaults
    sidebar: '#18181b',
    sidebarForeground: '#fafafa',
    sidebarPrimary: '#3f3f46',
    sidebarPrimaryForeground: '#fafafa',
    sidebarAccent: '#27272a',
    sidebarAccentForeground: '#fafafa',
    sidebarBorder: '#27272a',
    sidebarRing: '#a1a1aa',
    
    radius: 0.625,
    mode: 'dark',
    style: 'default'
  });
  const [showThemePanel, setShowThemePanel] = useState(false);

  // State: Blueprint History & Persistence
  const [blueprintHistory, setBlueprintHistory] = useState<NexusBlueprint[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);
  const [sidebarView, setSidebarView] = useState<'chat' | 'history'>('chat');

  const currentBlueprint = currentHistoryIndex >= 0 && blueprintHistory.length > 0 
    ? blueprintHistory[currentHistoryIndex] 
    : null;

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'nexus', content: 'vickymosafan ONLINE. SIAP MENERIMA INPUT ARSITEKTUR.', timestamp: Date.now() }
  ]);
  
  // UI Tabs
  const [activeTab, setActiveTab] = useState<'blueprint' | 'security' | 'code'>('blueprint');
  const [codeSubTab, setCodeSubTab] = useState<'infrastructure' | 'frontend' | 'backend' | 'database'>('infrastructure');
  
  // Interactions
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [techFilter, setTechFilter] = useState<string | null>(null);
  const [showGitModal, setShowGitModal] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- 1. LOCAL STORAGE PERSISTENCE ---
  useEffect(() => {
    const saved = localStorage.getItem('nexus_blueprints_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBlueprintHistory(parsed);
          setCurrentHistoryIndex(parsed.length - 1);
          setMessages(prev => [...prev, { role: 'nexus', content: 'Memori Inti dipulihkan. Melanjutkan sesi sebelumnya.', timestamp: Date.now() }]);
        }
      } catch (e) {
        console.error("Core Dump Corrupted:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (blueprintHistory.length > 0) {
      localStorage.setItem('nexus_blueprints_v2', JSON.stringify(blueprintHistory));
    } else {
      localStorage.removeItem('nexus_blueprints_v2');
    }
  }, [blueprintHistory]);

  // Audio Visualizer Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 30;
      const barWidth = canvas.width / bars;
      for (let i = 0; i < bars; i++) {
        const height = Math.random() * canvas.height * (loading ? 0.8 : 0.2);
        const x = i * barWidth;
        const y = (canvas.height - height) / 2;
        ctx.fillStyle = loading ? '#0ea5e9' : '#1e293b';
        ctx.fillRect(x + 1, y, barWidth - 2, height);
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationId);
  }, [loading]);

  const handleNewProject = () => {
    setCurrentHistoryIndex(-1);
    setMessages([{ role: 'nexus', content: 'Sistem Direset. Memulai Proyek Baru.', timestamp: Date.now() }]);
    setInput('');
    setSelectedNode(null);
    setSidebarView('chat');
  };

  const handleLoadProject = (index: number) => {
    setCurrentHistoryIndex(index);
    setMessages([{ role: 'nexus', content: `Memuat cetak biru: ${blueprintHistory[index].name}`, timestamp: Date.now() }]);
    setSidebarView('chat');
    setSelectedNode(null);
  };

  const handleDeleteProject = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const newHistory = [...blueprintHistory];
    newHistory.splice(index, 1);
    setBlueprintHistory(newHistory);

    // Logic update index after deletion
    if (index === currentHistoryIndex) {
        handleNewProject();
    } else if (index < currentHistoryIndex) {
        setCurrentHistoryIndex(prev => prev - 1);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const thinkingSteps = [
      "Inisialisasi Neural Link...",
      "Analisis Pola Arsitektur...",
      "Simulasi Stress Test 1 Juta User...",
      "Validasi Keamanan Zero Trust...",
      "Menyusun Spesifikasi Clean Architecture..."
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < thinkingSteps.length) {
         setMessages(prev => {
            const clean = prev.filter(m => !m.content.startsWith("STATUS:"));
            return [...clean, { role: 'nexus', content: `STATUS: ${thinkingSteps[stepIndex]}`, timestamp: Date.now() }];
         });
         stepIndex++;
      }
    }, 1200);

    try {
      const result = await analyzeArchitecture(userMsg.content, themeConfig);
      clearInterval(interval);
      
      const newHistory = [...blueprintHistory, result];
      setBlueprintHistory(newHistory);
      setCurrentHistoryIndex(newHistory.length - 1);

      setMessages(prev => {
         const clean = prev.filter(m => !m.content.startsWith("STATUS:"));
         return [...clean, { role: 'nexus', content: `Analisis Selesai. Cetak biru '${result.name}' telah dibuat dengan ${result.nodes.length} komponen microservices.`, timestamp: Date.now() }];
      });
    } catch (error) {
      clearInterval(interval);
      setMessages(prev => [...prev, { role: 'nexus', content: 'ERROR: Kegagalan Singularitas. Coba lagi.', timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // --- REAL-TIME SPEC UPDATER ---
  const displayedFrontendSpec = useMemo(() => {
    if (!currentBlueprint?.frontendSpec) return '';
    let spec = currentBlueprint.frontendSpec;

    // 1. UPDATE THEME CONFIG BLOCK
    const newConfigBlock = `[THEME_CONFIG]
Primary Color: ${themeConfig.primaryColor}
Radius: ${themeConfig.radius}rem
Style: Default (System)
Mode: Dual (Light/Dark)
[/THEME_CONFIG]`;
    
    const configRegex = /\[THEME_CONFIG\][\s\S]*?\[\/THEME_CONFIG\]/g;
    if (configRegex.test(spec)) {
      spec = spec.replace(configRegex, newConfigBlock);
    } else {
      spec = `${newConfigBlock}\n\n${spec}`;
    }

    // 2. UPDATE CSS VARIABLES BLOCK (Real-Time Injection)
    // Always inject the Dual-Mode Template
    const cssRegex = /\[CSS_VARS\][\s\S]*?\[\/CSS_VARS\]/g;
    const dynamicCss = DEFAULT_CSS_TEMPLATE
      .replace(/{{BACKGROUND}}/g, themeConfig.background || '#09090b')
      .replace(/{{FOREGROUND}}/g, themeConfig.foreground || '#fafafa')
      .replace(/{{CARD}}/g, themeConfig.card || '#09090b')
      .replace(/{{CARD_FOREGROUND}}/g, themeConfig.cardForeground || '#fafafa')
      .replace(/{{POPOVER}}/g, themeConfig.popover || '#09090b')
      .replace(/{{POPOVER_FOREGROUND}}/g, themeConfig.popoverForeground || '#fafafa')
      .replace(/{{PRIMARY_COLOR}}/g, themeConfig.primaryColor)
      .replace(/{{PRIMARY_FOREGROUND}}/g, themeConfig.primaryForeground || '#fafafa')
      .replace(/{{SECONDARY_COLOR}}/g, themeConfig.secondaryColor || '#27272a')
      .replace(/{{SECONDARY_FOREGROUND}}/g, themeConfig.secondaryForeground || '#fafafa')
      .replace(/{{MUTED}}/g, themeConfig.muted || '#27272a')
      .replace(/{{MUTED_FOREGROUND}}/g, themeConfig.mutedForeground || '#a1a1aa')
      .replace(/{{ACCENT_COLOR}}/g, themeConfig.accentColor || '#3f3f46')
      .replace(/{{ACCENT_FOREGROUND}}/g, themeConfig.accentForeground || '#fafafa')
      .replace(/{{DESTRUCTIVE}}/g, themeConfig.destructive || '#7f1d1d')
      .replace(/{{DESTRUCTIVE_FOREGROUND}}/g, themeConfig.destructiveForeground || '#fafafa')
      .replace(/{{BORDER}}/g, themeConfig.border || '#27272a')
      .replace(/{{INPUT}}/g, themeConfig.input || '#27272a')
      .replace(/{{RING}}/g, themeConfig.ring || '#a1a1aa')
      .replace(/{{CHART_1}}/g, themeConfig.chart1 || '#91c5ff')
      .replace(/{{CHART_2}}/g, themeConfig.chart2 || '#3a81f6')
      .replace(/{{CHART_3}}/g, themeConfig.chart3 || '#2563ef')
      .replace(/{{CHART_4}}/g, themeConfig.chart4 || '#1a4eda')
      .replace(/{{CHART_5}}/g, themeConfig.chart5 || '#1f3fad')
      .replace(/{{SIDEBAR}}/g, themeConfig.sidebar || '#18181b')
      .replace(/{{SIDEBAR_FOREGROUND}}/g, themeConfig.sidebarForeground || '#fafafa')
      .replace(/{{SIDEBAR_PRIMARY}}/g, themeConfig.sidebarPrimary || '#3f3f46')
      .replace(/{{SIDEBAR_PRIMARY_FOREGROUND}}/g, themeConfig.sidebarPrimaryForeground || '#fafafa')
      .replace(/{{SIDEBAR_ACCENT}}/g, themeConfig.sidebarAccent || '#27272a')
      .replace(/{{SIDEBAR_ACCENT_FOREGROUND}}/g, themeConfig.sidebarAccentForeground || '#fafafa')
      .replace(/{{SIDEBAR_BORDER}}/g, themeConfig.sidebarBorder || '#27272a')
      .replace(/{{SIDEBAR_RING}}/g, themeConfig.sidebarRing || '#a1a1aa')
      .replace(/{{RADIUS}}/g, themeConfig.radius.toString());

    if (cssRegex.test(spec)) {
      spec = spec.replace(cssRegex, dynamicCss);
    } else {
      spec = spec.replace('[/THEME_CONFIG]', `[/THEME_CONFIG]\n\n${dynamicCss}`);
    }

    return spec;
  }, [currentBlueprint, themeConfig]);

  const uniqueTechs = Array.from(new Set(currentBlueprint?.nodes.map(n => n.tech) || []));

  return (
    <div className="flex h-screen w-screen bg-black text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* GIT SYNC MODAL */}
      {showGitModal && (
        <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-xl w-full max-w-lg shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>
            <button onClick={() => setShowGitModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={24}/></button>
            
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3 font-mono">
              <GitBranch className="text-cyan-400" size={28}/> 
              NEXUS <span className="text-slate-600">::</span> GIT SYNC
            </h2>
            <p className="text-slate-400 text-sm mb-6">Dorong spesifikasi arsitektur saat ini ke repositori jarak jauh.</p>
            
            <div className="space-y-5">
              <div className="group">
                <label className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase mb-1 block">Repository URL</label>
                <div className="flex bg-slate-950 border border-slate-800 rounded group-focus-within:border-cyan-500 transition-colors">
                   <span className="px-3 py-2 text-slate-500 bg-slate-900 border-r border-slate-800 font-mono text-sm">git@</span>
                   <input type="text" className="w-full bg-transparent p-2 text-sm text-white font-mono focus:outline-none" placeholder="github.com:nexus/project-alpha.git" />
                </div>
              </div>
              
              <div className="flex gap-4">
                 <div className="flex-1">
                    <label className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase mb-1 block">Branch</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white font-mono focus:border-cyan-500 focus:outline-none" defaultValue="feat/architecture-update" />
                 </div>
                 <div className="flex-1">
                    <label className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase mb-1 block">Commit Hash</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-slate-500 font-mono cursor-not-allowed" disabled value="a1b2c3d" />
                 </div>
              </div>

              <div>
                 <label className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase mb-1 block">Commit Message</label>
                 <textarea className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-emerald-400 font-mono focus:border-emerald-500 focus:outline-none h-20" defaultValue="chore: update architecture blueprint via Nexus Zero" />
              </div>

              <button 
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                    setShowGitModal(false);
                    setMessages(prev => [...prev, {role: 'nexus', content: 'GIT SYNC BERHASIL: Artifacts pushed to origin/main.', timestamp: Date.now()}])
                  }, 1500);
                }}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded font-bold tracking-widest transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <Activity className="animate-spin"/> : <Save size={18} />}
                {loading ? 'MENYINKRONKAN...' : 'PUSH CHANGES'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR */}
      <div className="w-[360px] border-r border-slate-800 flex flex-col bg-slate-950 relative z-20 shadow-2xl transition-all duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex flex-col gap-4 bg-slate-900/50">
            <div className="flex items-center justify-between">
              <h1 className="font-bold text-lg text-white tracking-wider flex items-center gap-2">
                <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_#06b6d4]"></div>
                vickymosafan
              </h1>
              <div className="flex gap-1">
                 <button 
                   onClick={handleNewProject}
                   className="p-2 rounded hover:bg-slate-800 text-slate-500 hover:text-emerald-400 transition-colors"
                   title="New Project"
                 >
                   <Plus size={16} />
                 </button>
                 <button 
                  onClick={() => setSidebarView(v => v === 'chat' ? 'history' : 'chat')}
                  className={`p-2 rounded hover:bg-slate-800 transition-colors ${sidebarView === 'history' ? 'text-amber-400 bg-slate-800' : 'text-slate-500'}`}
                  title="Archives"
                 >
                   {sidebarView === 'history' ? <MessageSquare size={16} /> : <FolderClock size={16} />}
                 </button>
                 <button 
                  onClick={() => setShowThemePanel(!showThemePanel)}
                  className={`p-2 rounded hover:bg-slate-800 transition-colors ${showThemePanel ? 'text-cyan-400 bg-slate-800' : 'text-slate-500'}`}
                  title="Theme Settings"
                >
                  <Settings size={16} />
                 </button>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 font-mono flex justify-between">
               <span>V.4.0.1 // SINGULARITY</span>
               <span className={loading ? "text-cyan-400 animate-pulse" : "text-emerald-500"}>
                 {loading ? 'PROCESSING...' : 'SYSTEM OPTIMAL'}
               </span>
            </div>
        </div>

        {/* Content Area: Chat or History */}
        <div className="flex-1 overflow-y-auto relative custom-scrollbar">
          {sidebarView === 'chat' ? (
             <div className="p-4 space-y-4 min-h-full pb-20">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[90%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-cyan-950/30 border border-cyan-800/50 text-cyan-100' : 'bg-slate-900 border border-slate-800 text-slate-300'}`}>
                      {msg.role === 'nexus' && <div className="text-[10px] text-cyan-500 font-bold mb-1 mb-2 block">vickymosafan AI</div>}
                      <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed">{msg.content}</div>
                    </div>
                    <span className="text-[9px] text-slate-600 mt-1 font-mono">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text-cyan-500 text-xs font-mono animate-pulse px-2">
                      <Activity size={12} /> Thinking...
                  </div>
                )}
             </div>
          ) : (
             <div className="p-2 space-y-2">
               <h3 className="text-xs font-bold text-slate-500 px-3 py-2 uppercase tracking-wider">Project Archives</h3>
               {blueprintHistory.length === 0 ? (
                 <div className="text-center p-8 text-slate-600 text-xs">
                   <Archive size={24} className="mx-auto mb-2 opacity-50"/>
                   No archives found.
                 </div>
               ) : (
                 blueprintHistory.map((bp, index) => (
                   <div 
                     key={index} 
                     onClick={() => handleLoadProject(index)}
                     className={`group relative p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${index === currentHistoryIndex ? 'bg-slate-800 border-cyan-900/50' : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800 hover:border-slate-700'}`}
                   >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className={`font-bold text-xs truncate ${index === currentHistoryIndex ? 'text-cyan-400' : 'text-slate-300'}`}>{bp.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-1 truncate">ID: {bp.projectId}</div>
                          <div className="text-[9px] text-slate-600 mt-1">{new Date(bp.timestamp || 0).toLocaleString()}</div>
                        </div>
                        <button 
                          onClick={(e) => handleDeleteProject(e, index)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-950 rounded transition-all absolute top-2 right-2"
                          title="Delete Project"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {index === currentHistoryIndex && (
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-cyan-500 rounded-l-lg"></div>
                      )}
                   </div>
                 ))
               )}
             </div>
          )}
        </div>

        {/* Input Area (Only visible in Chat View) */}
        {sidebarView === 'chat' && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/50">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Describe your architecture..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 pr-10 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 min-h-[80px] text-slate-200 font-mono resize-none"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="absolute bottom-3 right-3 p-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={14} />
              </button>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <div className="flex gap-2">
                <button className="text-slate-500 hover:text-cyan-400 transition-colors" title="Voice Input (Coming Soon)">
                  <Mic size={16} />
                </button>
                <button onClick={() => setShowGitModal(true)} className="text-slate-500 hover:text-cyan-400 transition-colors" title="Git Sync">
                  <GitBranch size={16} />
                </button>
              </div>
              <div className="text-[10px] text-slate-600 font-mono">
                  {input.length} chars
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content (Right) */}
      <div className="flex-1 flex flex-col relative h-full bg-black">
         {/* Top Toolbar */}
         <div className="h-14 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
               <div className="flex bg-slate-900 rounded p-1 border border-slate-800">
                  <button 
                    onClick={() => setActiveTab('blueprint')}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'blueprint' ? 'bg-cyan-900/30 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <Layout size={14} /> BLUEPRINT
                  </button>
                  <button 
                    onClick={() => setActiveTab('security')}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'security' ? 'bg-red-900/30 text-red-400' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <ShieldAlert size={14} /> SECURITY
                  </button>
                  <button 
                    onClick={() => setActiveTab('code')}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'code' ? 'bg-emerald-900/30 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <Code size={14} /> CODE GEN
                  </button>
               </div>
               
               {/* Tech Filter */}
               {uniqueTechs.length > 0 && (
                 <div className="flex items-center gap-2 ml-4 px-3 py-1.5 bg-slate-900 rounded border border-slate-800">
                    <Filter size={12} className="text-slate-500" />
                    <select 
                      className="bg-transparent text-xs text-slate-300 focus:outline-none"
                      onChange={(e) => setTechFilter(e.target.value || null)}
                      value={techFilter || ''}
                    >
                      <option value="">All Technologies</option>
                      {uniqueTechs.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                 </div>
               )}
            </div>

            <div className="flex items-center gap-4">
               {/* Audio Viz Canvas */}
               <canvas ref={canvasRef} width={100} height={30} className="opacity-50" />
            </div>
         </div>

         {/* Workspace */}
         <div className="flex-1 relative overflow-hidden">
            {activeTab === 'blueprint' && (
              <NodeCanvas 
                blueprint={currentBlueprint} 
                onNodeSelect={setSelectedNode}
                techFilter={techFilter}
              />
            )}

            {/* Simulation Overlay (Bottom Right) */}
            {currentBlueprint && activeTab === 'blueprint' && (
               <div className="absolute bottom-6 right-6 w-80 bg-slate-950/90 border border-slate-800 p-4 rounded-xl shadow-2xl backdrop-blur">
                  <SimulationHub data={currentBlueprint.simulationData} />
               </div>
            )}
            
            {/* Code View */}
            {activeTab === 'code' && currentBlueprint && (
              <div className="absolute inset-0 bg-[#0d1117] flex flex-col">
                 <div className="flex border-b border-slate-800">
                    {['infrastructure', 'frontend', 'backend', 'database'].map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setCodeSubTab(sub as any)}
                        className={`px-4 py-3 text-xs font-mono border-b-2 transition-colors ${codeSubTab === sub ? 'border-cyan-500 text-cyan-400 bg-slate-900' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                      >
                        {sub.toUpperCase()}
                      </button>
                    ))}
                 </div>
                 <div className="flex-1 overflow-auto p-6 font-mono text-sm text-slate-300 relative group">
                    <button 
                      onClick={() => {
                        const content = codeSubTab === 'frontend' ? displayedFrontendSpec :
                                      codeSubTab === 'backend' ? currentBlueprint.backendSpec :
                                      codeSubTab === 'database' ? currentBlueprint.databaseSpec :
                                      currentBlueprint.godModePrompt;
                        copyToClipboard(content, codeSubTab);
                      }}
                      className="absolute top-4 right-4 p-2 bg-slate-800 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors z-10"
                    >
                       {copiedSection === codeSubTab ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                    <pre className="whitespace-pre-wrap max-w-4xl mx-auto">
                       {codeSubTab === 'frontend' && displayedFrontendSpec}
                       {codeSubTab === 'backend' && currentBlueprint.backendSpec}
                       {codeSubTab === 'database' && currentBlueprint.databaseSpec}
                       {codeSubTab === 'infrastructure' && currentBlueprint.godModePrompt}
                    </pre>
                 </div>
              </div>
            )}

            {/* Security View */}
            {activeTab === 'security' && currentBlueprint && (
               <div className="absolute inset-0 bg-slate-950 p-8 overflow-auto">
                  <div className="max-w-4xl mx-auto space-y-4">
                     <h2 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2">
                       <ShieldAlert /> SECURITY AUDIT REPORT
                     </h2>
                     {currentBlueprint.securityReport.map(alert => (
                       <div key={alert.id} className="bg-slate-900 border border-red-900/30 p-4 rounded-lg flex gap-4">
                          <div className={`w-1 h-full rounded ${alert.severity === 'critical' ? 'bg-red-600' : alert.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'}`}></div>
                          <div>
                             <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${alert.severity === 'critical' ? 'bg-red-950 text-red-500' : 'bg-orange-950 text-orange-500'}`}>
                                  {alert.severity}
                                </span>
                                <span className="text-sm font-bold text-slate-200">{alert.component}</span>
                             </div>
                             <p className="text-sm text-slate-400 mb-2">{alert.issue}</p>
                             <div className="text-xs bg-slate-950 p-2 rounded border border-slate-800 text-emerald-400 font-mono">
                                FIX: {alert.fix}
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            )}

            {!currentBlueprint && !loading && (
              <div className="absolute inset-0 flex items-center justify-center flex-col text-slate-600">
                <Terminal size={48} className="mb-4 opacity-50"/>
                <p className="text-lg font-mono">AWAITING ARCHITECTURAL INPUT</p>
                <p className="text-xs mt-2 max-w-md text-center">
                  Describe your project idea (e.g., "Netflix clone with microservices"). vickymosafan will generate the entire engineering blueprint.
                </p>
              </div>
            )}
         </div>
      </div>

      {/* Theme Editor Panel */}
      {showThemePanel && (
         <div className="w-[320px] bg-slate-950 border-l border-slate-800 z-30 shadow-2xl animate-in slide-in-from-right duration-300">
            <ThemeEditor config={themeConfig} onChange={setThemeConfig} />
         </div>
      )}

      {/* Node Details Panel (Right Sidebar when node selected) */}
      {selectedNode && (
        <div className="absolute right-0 top-0 bottom-0 w-[300px] bg-slate-900/95 backdrop-blur border-l border-slate-700 p-6 z-40 shadow-2xl animate-in slide-in-from-right">
           <button onClick={() => setSelectedNode(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20}/></button>
           
           <h3 className="text-xl font-bold text-cyan-400 mb-1">{selectedNode.label}</h3>
           <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-slate-300">{selectedNode.tech}</span>
           
           <div className="mt-6 space-y-4">
              <div>
                 <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Status</label>
                 <div className={`mt-1 flex items-center gap-2 text-sm font-bold ${selectedNode.status === 'optimal' ? 'text-emerald-400' : selectedNode.status === 'warning' ? 'text-yellow-400' : 'text-red-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${selectedNode.status === 'optimal' ? 'bg-emerald-400' : selectedNode.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                    {selectedNode.status.toUpperCase()}
                 </div>
              </div>
              
              <div>
                 <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Node ID</label>
                 <div className="font-mono text-xs text-slate-400 mt-1">{selectedNode.id}</div>
              </div>
              
              <div>
                 <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Analysis</label>
                 <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                   {selectedNode.details || "No specific details available for this node."}
                 </p>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default App;
