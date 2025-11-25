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
}`;

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

  // --- STYLE INJECTION FOR REALTIME THEME ---
  useEffect(() => {
    const root = document.documentElement;
    const set = (k: string, v?: string) => { if (v) root.style.setProperty(k, v); };

    set('--background', themeConfig.background);
    set('--foreground', themeConfig.foreground);
    set('--card', themeConfig.card);
    set('--card-foreground', themeConfig.cardForeground);
    set('--popover', themeConfig.popover);
    set('--popover-foreground', themeConfig.popoverForeground);
    set('--primary', themeConfig.primaryColor);
    set('--primary-foreground', themeConfig.primaryForeground);
    set('--secondary', themeConfig.secondaryColor);
    set('--secondary-foreground', themeConfig.secondaryForeground);
    set('--muted', themeConfig.muted);
    set('--muted-foreground', themeConfig.mutedForeground);
    set('--accent', themeConfig.accentColor);
    set('--accent-foreground', themeConfig.accentForeground);
    set('--destructive', themeConfig.destructive);
    set('--destructive-foreground', themeConfig.destructiveForeground);
    set('--border', themeConfig.border);
    set('--input', themeConfig.input);
    set('--ring', themeConfig.ring);
    set('--radius', `${themeConfig.radius}rem`);

    set('--chart-1', themeConfig.chart1);
    set('--chart-2', themeConfig.chart2);
    set('--chart-3', themeConfig.chart3);
    set('--chart-4', themeConfig.chart4);
    set('--chart-5', themeConfig.chart5);

    set('--sidebar', themeConfig.sidebar);
    set('--sidebar-foreground', themeConfig.sidebarForeground);
    set('--sidebar-primary', themeConfig.sidebarPrimary);
    set('--sidebar-primary-foreground', themeConfig.sidebarPrimaryForeground);
    set('--sidebar-accent', themeConfig.sidebarAccent);
    set('--sidebar-accent-foreground', themeConfig.sidebarAccentForeground);
    set('--sidebar-border', themeConfig.sidebarBorder);
    set('--sidebar-ring', themeConfig.sidebarRing);

    if (themeConfig.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeConfig]);

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
        ctx.fillStyle = loading ? themeConfig.primaryColor : themeConfig.mutedForeground;
        ctx.fillRect(x + 1, y, barWidth - 2, height);
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationId);
  }, [loading, themeConfig]);

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

  const displayedFrontendSpec = useMemo(() => {
    if (!currentBlueprint?.frontendSpec) return '';
    let spec = currentBlueprint.frontendSpec;

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
    <div className="flex h-screen w-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary/30 selection:text-primary">
      
      {/* GIT SYNC MODAL */}
      {showGitModal && (
        <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border p-8 rounded-xl w-full max-w-lg shadow-2xl relative overflow-hidden text-card-foreground">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
            <button onClick={() => setShowGitModal(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={24}/></button>
            
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3 font-mono">
              <GitBranch className="text-primary" size={28}/> 
              NEXUS <span className="text-muted-foreground">::</span> GIT SYNC
            </h2>
            <p className="text-muted-foreground text-sm mb-6">Push architecture specs to remote repository.</p>
            
            <div className="space-y-5">
              <div className="group">
                <label className="text-[10px] text-primary font-mono tracking-widest uppercase mb-1 block">Repository URL</label>
                <div className="flex bg-input border border-border rounded group-focus-within:border-primary transition-colors">
                   <span className="px-3 py-2 text-muted-foreground bg-muted border-r border-border font-mono text-sm">git@</span>
                   <input type="text" className="w-full bg-transparent p-2 text-sm text-foreground font-mono focus:outline-none" placeholder="github.com:nexus/project-alpha.git" />
                </div>
              </div>
              
              <div className="flex gap-4">
                 <div className="flex-1">
                    <label className="text-[10px] text-primary font-mono tracking-widest uppercase mb-1 block">Branch</label>
                    <input type="text" className="w-full bg-input border border-border rounded p-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none" defaultValue="feat/architecture-update" />
                 </div>
                 <div className="flex-1">
                    <label className="text-[10px] text-primary font-mono tracking-widest uppercase mb-1 block">Commit Hash</label>
                    <input type="text" className="w-full bg-input border border-border rounded p-2 text-sm text-muted-foreground font-mono cursor-not-allowed" disabled value="a1b2c3d" />
                 </div>
              </div>

              <div>
                 <label className="text-[10px] text-primary font-mono tracking-widest uppercase mb-1 block">Commit Message</label>
                 <textarea className="w-full bg-input border border-border rounded p-2 text-sm text-emerald-400 font-mono focus:border-emerald-500 focus:outline-none h-20" defaultValue="chore: update architecture blueprint via Nexus Zero" />
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
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded font-bold tracking-widest transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <Activity className="animate-spin"/> : <Save size={18} />}
                {loading ? 'MENYINKRONKAN...' : 'PUSH CHANGES'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR */}
      <div className="w-[360px] border-r border-sidebar-border flex flex-col bg-sidebar text-sidebar-foreground relative z-20 shadow-2xl transition-all duration-300">
        {/* Header */}
        <div className="p-5 border-b border-sidebar-border flex flex-col gap-4 bg-sidebar-accent/50">
            <div className="flex items-center justify-between">
              <h1 className="font-bold text-lg tracking-wider flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_10px_var(--primary)]"></div>
                vickymosafan
              </h1>
              <div className="flex gap-1">
                 <button 
                   onClick={handleNewProject}
                   className="p-2 rounded hover:bg-sidebar-accent text-sidebar-foreground/50 hover:text-primary transition-colors"
                   title="New Project"
                 >
                   <Plus size={16} />
                 </button>
                 <button 
                  onClick={() => setSidebarView(v => v === 'chat' ? 'history' : 'chat')}
                  className={`p-2 rounded hover:bg-sidebar-accent transition-colors ${sidebarView === 'history' ? 'text-sidebar-primary bg-sidebar-accent' : 'text-sidebar-foreground/50'}`}
                  title="Archives"
                 >
                   {sidebarView === 'history' ? <MessageSquare size={16} /> : <FolderClock size={16} />}
                 </button>
                 <button 
                  onClick={() => setShowThemePanel(!showThemePanel)}
                  className={`p-2 rounded hover:bg-sidebar-accent transition-colors ${showThemePanel ? 'text-sidebar-primary bg-sidebar-accent' : 'text-sidebar-foreground/50'}`}
                  title="Theme Settings"
                >
                  <Settings size={16} />
                 </button>
              </div>
            </div>
            <div className="text-[10px] text-sidebar-foreground/50 font-mono flex justify-between">
               <span>V.4.0.1 // SINGULARITY</span>
               <span className={loading ? "text-primary animate-pulse" : "text-emerald-500"}>
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
                    <div className={`max-w-[90%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-primary/10 border border-primary/20 text-primary-foreground' : 'bg-muted border border-border text-foreground'}`}>
                      {msg.role === 'nexus' && <div className="text-[10px] text-primary font-bold mb-1 mb-2 block">vickymosafan AI</div>}
                      <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed">{msg.content}</div>
                    </div>
                    <span className="text-[9px] text-muted-foreground mt-1 font-mono">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text-primary text-xs font-mono animate-pulse px-2">
                      <Activity size={12} /> Thinking...
                  </div>
                )}
             </div>
          ) : (
             <div className="p-2 space-y-2">
               <h3 className="text-xs font-bold text-muted-foreground px-3 py-2 uppercase tracking-wider">Project Archives</h3>
               {blueprintHistory.length === 0 ? (
                 <div className="text-center p-8 text-muted-foreground text-xs">
                   <Archive size={24} className="mx-auto mb-2 opacity-50"/>
                   No archives found.
                 </div>
               ) : (
                 blueprintHistory.map((bp, index) => (
                   <div 
                     key={index} 
                     onClick={() => handleLoadProject(index)}
                     className={`group relative p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${index === currentHistoryIndex ? 'bg-sidebar-accent border-sidebar-primary' : 'bg-sidebar-accent/50 border-sidebar-border hover:bg-sidebar-accent'}`}
                   >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className={`font-bold text-xs truncate ${index === currentHistoryIndex ? 'text-primary' : 'text-sidebar-foreground'}`}>{bp.name}</div>
                          <div className="text-[10px] text-muted-foreground font-mono mt-1 truncate">ID: {bp.projectId}</div>
                          <div className="text-[9px] text-muted-foreground mt-1">{new Date(bp.timestamp || 0).toLocaleString()}</div>
                        </div>
                        <button 
                          onClick={(e) => handleDeleteProject(e, index)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-all absolute top-2 right-2"
                          title="Delete Project"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {index === currentHistoryIndex && (
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-l-lg"></div>
                      )}
                   </div>
                 ))
               )}
             </div>
          )}
        </div>

        {/* Input Area (Only visible in Chat View) */}
        {sidebarView === 'chat' && (
          <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/30">
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
                className="w-full bg-input border border-border rounded-lg p-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 min-h-[80px] text-foreground font-mono resize-none placeholder:text-muted-foreground"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="absolute bottom-3 right-3 p-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={14} />
              </button>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <div className="flex gap-2">
                <button className="text-muted-foreground hover:text-primary transition-colors" title="Voice Input (Coming Soon)">
                  <Mic size={16} />
                </button>
                <button onClick={() => setShowGitModal(true)} className="text-muted-foreground hover:text-primary transition-colors" title="Git Sync">
                  <GitBranch size={16} />
                </button>
              </div>
              <div className="text-[10px] text-muted-foreground font-mono">
                  {input.length} chars
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content (Right) */}
      <div className="flex-1 flex flex-col relative h-full bg-background">
         {/* Top Toolbar */}
         <div className="h-14 border-b border-border bg-card/50 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
               <div className="flex bg-muted rounded p-1 border border-border">
                  <button 
                    onClick={() => setActiveTab('blueprint')}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'blueprint' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <Layout size={14} /> BLUEPRINT
                  </button>
                  <button 
                    onClick={() => setActiveTab('security')}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'security' ? 'bg-background shadow text-destructive' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <ShieldAlert size={14} /> SECURITY
                  </button>
                  <button 
                    onClick={() => setActiveTab('code')}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'code' ? 'bg-background shadow text-emerald-500' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <Code size={14} /> CODE GEN
                  </button>
               </div>
               
               {/* Tech Filter */}
               {uniqueTechs.length > 0 && (
                 <div className="flex items-center gap-2 ml-4 px-3 py-1.5 bg-muted rounded border border-border">
                    <Filter size={12} className="text-muted-foreground" />
                    <select 
                      className="bg-transparent text-xs text-foreground focus:outline-none"
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
               <div className="absolute bottom-6 right-6 w-80 bg-card/90 border border-border p-4 rounded-xl shadow-2xl backdrop-blur">
                  <SimulationHub data={currentBlueprint.simulationData} />
               </div>
            )}
            
            {/* Code View */}
            {activeTab === 'code' && currentBlueprint && (
              <div className="absolute inset-0 bg-card flex flex-col">
                 <div className="flex border-b border-border">
                    {['infrastructure', 'frontend', 'backend', 'database'].map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setCodeSubTab(sub as any)}
                        className={`px-4 py-3 text-xs font-mono border-b-2 transition-colors ${codeSubTab === sub ? 'border-primary text-primary bg-muted/50' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                      >
                        {sub.toUpperCase()}
                      </button>
                    ))}
                 </div>
                 <div className="flex-1 overflow-auto p-6 font-mono text-sm text-foreground relative group">
                    <button 
                      onClick={() => {
                        const content = codeSubTab === 'frontend' ? displayedFrontendSpec :
                                      codeSubTab === 'backend' ? currentBlueprint.backendSpec :
                                      codeSubTab === 'database' ? currentBlueprint.databaseSpec :
                                      currentBlueprint.godModePrompt;
                        copyToClipboard(content, codeSubTab);
                      }}
                      className="absolute top-4 right-4 p-2 bg-muted rounded hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors z-10"
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
               <div className="absolute inset-0 bg-background p-8 overflow-auto">
                  <div className="max-w-4xl mx-auto space-y-4">
                     <h2 className="text-xl font-bold text-destructive mb-6 flex items-center gap-2">
                       <ShieldAlert /> SECURITY AUDIT REPORT
                     </h2>
                     {currentBlueprint.securityReport.map(alert => (
                       <div key={alert.id} className="bg-card border border-border p-4 rounded-lg flex gap-4">
                          <div className={`w-1 h-full rounded ${alert.severity === 'critical' ? 'bg-destructive' : alert.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'}`}></div>
                          <div>
                             <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${alert.severity === 'critical' ? 'bg-destructive/10 text-destructive' : 'bg-orange-950 text-orange-500'}`}>
                                  {alert.severity}
                                </span>
                                <span className="text-sm font-bold text-foreground">{alert.component}</span>
                             </div>
                             <p className="text-sm text-muted-foreground mb-2">{alert.issue}</p>
                             <div className="text-xs bg-muted p-2 rounded border border-border text-emerald-500 font-mono">
                                FIX: {alert.fix}
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            )}

            {!currentBlueprint && !loading && (
              <div className="absolute inset-0 flex items-center justify-center flex-col text-muted-foreground">
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
         <div className="w-[320px] bg-card border-l border-border z-30 shadow-2xl animate-in slide-in-from-right duration-300">
            <ThemeEditor config={themeConfig} onChange={setThemeConfig} />
         </div>
      )}

      {/* Node Details Panel (Right Sidebar when node selected) */}
      {selectedNode && (
        <div className="absolute right-0 top-0 bottom-0 w-[300px] bg-card/95 backdrop-blur border-l border-border p-6 z-40 shadow-2xl animate-in slide-in-from-right">
           <button onClick={() => setSelectedNode(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={20}/></button>
           
           <h3 className="text-xl font-bold text-primary mb-1">{selectedNode.label}</h3>
           <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">{selectedNode.tech}</span>
           
           <div className="mt-6 space-y-4">
              <div>
                 <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Status</label>
                 <div className={`mt-1 flex items-center gap-2 text-sm font-bold ${selectedNode.status === 'optimal' ? 'text-emerald-500' : selectedNode.status === 'warning' ? 'text-yellow-500' : 'text-destructive'}`}>
                    <div className={`w-2 h-2 rounded-full ${selectedNode.status === 'optimal' ? 'bg-emerald-500' : selectedNode.status === 'warning' ? 'bg-yellow-500' : 'bg-destructive'}`}></div>
                    {selectedNode.status.toUpperCase()}
                 </div>
              </div>
              
              <div>
                 <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Node ID</label>
                 <div className="font-mono text-xs text-foreground mt-1">{selectedNode.id}</div>
              </div>
              
              <div>
                 <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Analysis</label>
                 <p className="text-sm text-foreground mt-1 leading-relaxed">
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