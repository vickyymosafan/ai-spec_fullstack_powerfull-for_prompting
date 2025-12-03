

import React, { useState, useEffect, useMemo } from 'react';
import { analyzeArchitecture } from './services/nexusAi';
import { VickyBlueprint, ChatMessage, NodeData, ThemeConfig } from './types';
import { NodeCanvas } from './components/NodeCanvas';
import { SimulationHub } from './components/SimulationHub';
import { ThemeEditor } from './components/ThemeEditor';
import { MetricCard } from './components/MetricCard';
import { RecentActivity } from './components/RecentActivity';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DEFAULT_DARK_THEME, applyThemeToDocument, generateCssVariables } from './lib/theme';
import { 
  Send, ShieldAlert, Terminal, Activity, Code, Save, 
  GitBranch, Filter, X, Copy, Check, Layout, Settings,
  Plus, Menu, LayoutDashboard, Network, FileCode, Command, ChevronDown,
  Bell, Search as SearchIcon, User, LogOut, ChevronRight,
  PanelLeftClose
} from 'lucide-react';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  
  // Theme State
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(DEFAULT_DARK_THEME);
  const [showThemePanel, setShowThemePanel] = useState(false);
  
  // Sidebar State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);

  // --- STYLE INJECTION FOR REALTIME THEME ---
  useEffect(() => {
    applyThemeToDocument(themeConfig);
  }, [themeConfig]);

  // State: Blueprint History & Persistence
  const [blueprintHistory, setBlueprintHistory] = useState<VickyBlueprint[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);

  const currentBlueprint = currentHistoryIndex >= 0 && blueprintHistory.length > 0 
    ? blueprintHistory[currentHistoryIndex] 
    : null;

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'vicky', content: 'vickymosafan ONLINE. SIAP MENERIMA INPUT ARSITEKTUR.', timestamp: Date.now() }
  ]);
  
  // MAIN VIEW STATE
  const [activeTab, setActiveTab] = useState<'overview' | 'topology' | 'code' | 'console' | 'settings'>('overview');
  const [codeSubTab, setCodeSubTab] = useState<'infrastructure' | 'requirements' | 'frontend' | 'backend' | 'database'>('infrastructure');
  
  // Interactions
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [techFilter, setTechFilter] = useState<string | null>(null);
  const [showGitModal, setShowGitModal] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // --- 1. LOCAL STORAGE PERSISTENCE ---
  useEffect(() => {
    const saved = localStorage.getItem('vicky_blueprints_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBlueprintHistory(parsed);
          setCurrentHistoryIndex(parsed.length - 1);
          setMessages(prev => [...prev, { role: 'vicky', content: 'Memori Inti dipulihkan. Melanjutkan sesi sebelumnya.', timestamp: Date.now() }]);
        }
      } catch (e) {
        console.error("Core Dump Corrupted:", e);
      }
    } else {
        // Default to Console if no data
        setActiveTab('console');
    }
  }, []);

  useEffect(() => {
    if (blueprintHistory.length > 0) {
      localStorage.setItem('vicky_blueprints_v2', JSON.stringify(blueprintHistory));
    } else {
      localStorage.removeItem('vicky_blueprints_v2');
    }
  }, [blueprintHistory]);

  const handleNewProject = () => {
    setCurrentHistoryIndex(-1);
    setMessages([{ role: 'vicky', content: 'Sistem Direset. Memulai Proyek Baru.', timestamp: Date.now() }]);
    setInput('');
    setSelectedNode(null);
    setActiveTab('console');
  };

  const handleLoadProject = (index: number) => {
    setCurrentHistoryIndex(index);
    setMessages([{ role: 'vicky', content: `Memuat cetak biru: ${blueprintHistory[index].name}`, timestamp: Date.now() }]);
    setActiveTab('overview');
    setSelectedNode(null);
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
      "Menyusun Requirements & User Stories...",
      "Validasi Keamanan Zero Trust...",
      "Menyusun Spesifikasi Clean Architecture..."
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < thinkingSteps.length) {
         setMessages(prev => {
            const clean = prev.filter(m => !m.content.startsWith("STATUS:"));
            return [...clean, { role: 'vicky', content: `STATUS: ${thinkingSteps[stepIndex]}`, timestamp: Date.now() }];
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
         return [...clean, { role: 'vicky', content: `Analisis Selesai. Cetak biru '${result.name}' telah dibuat.`, timestamp: Date.now() }];
      });
      
      // Auto switch to overview after generation
      setActiveTab('overview');

    } catch (error) {
      clearInterval(interval);
      setMessages(prev => [...prev, { role: 'vicky', content: 'ERROR: Kegagalan Singularitas. Coba lagi.', timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // --- DYNAMIC CODE DISPLAY ---
  const displayedFrontendSpec = useMemo(() => {
    if (!currentBlueprint?.frontendSpec) return '';
    let spec = currentBlueprint.frontendSpec;

    // Inject Theme Config Block
    const newConfigBlock = `[THEME_CONFIG]\nPrimary Color: ${themeConfig.primaryColor}\nRadius: ${themeConfig.radius}rem\nStyle: Default\nMode: Dual\n[/THEME_CONFIG]`;
    const configRegex = /\[THEME_CONFIG\][\s\S]*?\[\/THEME_CONFIG\]/g;
    spec = configRegex.test(spec) ? spec.replace(configRegex, newConfigBlock) : `${newConfigBlock}\n\n${spec}`;
    
    // Inject CSS Variables using shared utility
    const dynamicCss = generateCssVariables(themeConfig);
    const cssRegex = /\[CSS_VARS\][\s\S]*?\[\/CSS_VARS\]/g;

    // If tag exists, replace entire block (including tags) with clean CSS content
    // Otherwise fallback to appending clean CSS wrapped in markdown code block
    return cssRegex.test(spec) 
      ? spec.replace(cssRegex, dynamicCss) 
      : spec.replace('[/THEME_CONFIG]', `[/THEME_CONFIG]\n\n\`\`\`css\n${dynamicCss}\n\`\`\``);
  }, [currentBlueprint, themeConfig]);

  // --- METRIC CALCS ---
  const metrics = useMemo(() => {
     if (!currentBlueprint) return null;
     const sim = currentBlueprint.simulationData;
     const avgLoad = Math.round(sim.reduce((a,b) => a + b.load, 0) / sim.length);
     const avgLatency = Math.round(sim.reduce((a,b) => a + b.latency, 0) / sim.length);
     const avgErrors = (sim.reduce((a,b) => a + b.errors, 0) / sim.length).toFixed(2);
     const nodeCount = currentBlueprint.nodes.length;
     const securityIssues = currentBlueprint.securityReport.length;
     
     return { avgLoad, avgLatency, avgErrors, nodeCount, securityIssues };
  }, [currentBlueprint]);

  // --- VIEWPORT SIMULATION STYLES ---
  const getViewportStyle = () => {
    switch(themeConfig.viewport) {
      case 'sm': return 'w-[640px] h-[90%] rounded-xl border-x border-t border-border shadow-2xl overflow-hidden';
      case 'md': return 'w-[768px] h-[90%] rounded-xl border-x border-t border-border shadow-2xl overflow-hidden';
      case 'lg': return 'w-[1024px] h-[90%] rounded-xl border-x border-t border-border shadow-2xl overflow-hidden';
      case 'xl': return 'w-[1280px] h-[90%] rounded-xl border-x border-t border-border shadow-2xl overflow-hidden';
      case '2xl': return 'w-[1536px] h-[90%] rounded-xl border-x border-t border-border shadow-2xl overflow-hidden';
      default: return 'w-full h-full';
    }
  };

  const isSimulated = themeConfig.viewport !== 'responsive';

  const NavItem = ({ id, icon: Icon, label, hasBadge = false }: { id: string, icon: any, label: string, hasBadge?: boolean }) => {
    const isActive = activeTab === id;
    
    return (
      <button 
        onClick={() => setActiveTab(id as any)}
        className={`
          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
          ${isActive 
            ? 'bg-sidebar-accent text-sidebar-primary-foreground font-medium shadow-sm' 
            : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'}
        `}
        title={isSidebarCollapsed ? label : ''}
      >
        <div className={`relative flex items-center justify-center ${isSidebarCollapsed ? 'mx-auto' : ''}`}>
           <Icon size={18} className={`${isActive ? 'text-sidebar-primary' : 'text-muted-foreground group-hover:text-sidebar-foreground'} transition-colors`} />
           {hasBadge && (
             <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sidebar-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sidebar-primary"></span>
             </span>
           )}
        </div>
        
        {!isSidebarCollapsed && (
           <span className="truncate flex-1 text-left text-sm">{label}</span>
        )}
        
        {isActive && !isSidebarCollapsed && (
          <div className="w-1 h-4 bg-sidebar-primary rounded-full ml-auto"></div>
        )}
      </button>
    );
  };

  return (
    <div className={`flex h-screen w-screen bg-neutral-900 overflow-hidden font-sans selection:bg-primary/30 selection:text-primary justify-center items-end ${isSimulated ? 'pt-10' : ''}`}>
      
      {/* GIT SYNC MODAL */}
      {showGitModal && (
        <div className="absolute inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border p-8 rounded-xl w-full max-w-lg shadow-2xl relative overflow-hidden text-card-foreground">
             <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
             <button onClick={() => setShowGitModal(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={24}/></button>
             <h2 className="text-2xl font-bold mb-2 flex items-center gap-3 font-mono"><GitBranch className="text-primary" size={28}/> VICKY GIT SYNC</h2>
             <p className="text-muted-foreground text-sm mb-6">Push architecture specs to remote repository.</p>
             <button onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); setShowGitModal(false); setMessages(prev => [...prev, {role: 'vicky', content: 'GIT SYNC BERHASIL: Artifacts pushed.', timestamp: Date.now()}]) }, 1500); }} className="w-full bg-primary text-primary-foreground py-3 rounded font-bold">PUSH CHANGES</button>
          </div>
        </div>
      )}

      {/* APP CONTAINER */}
      <div className={`relative flex bg-background transition-all duration-300 ${getViewportStyle()}`}>
          
          {/* MOBILE OVERLAY */}
          {isMobileMenuOpen && (
             <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          )}

          {/* SIDEBAR NAVIGATION (LEFT) */}
          <div className={`
            border-r border-sidebar-border flex flex-col bg-sidebar text-sidebar-foreground relative z-50 shadow-xl transition-all duration-300 ease-in-out
            ${isSidebarCollapsed ? 'w-[72px]' : 'w-[260px]'}
            fixed md:relative inset-y-0 left-0
            ${isMobileMenuOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full md:translate-x-0'}
          `}>
             {/* Sidebar Header */}
             <div className={`h-16 flex items-center border-b border-sidebar-border px-4 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
                {!isSidebarCollapsed ? (
                   <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center text-sidebar-primary-foreground shadow-sm shrink-0">
                         <Activity size={18} />
                      </div>
                      <div className="flex flex-col min-w-0">
                         <h1 className="text-sm font-bold tracking-tight text-sidebar-foreground truncate">vickymosafan</h1>
                         <div className="text-[10px] text-muted-foreground truncate">Architect AI v4.2</div>
                      </div>
                   </div>
                ) : (
                  <div className="w-9 h-9 bg-sidebar-primary rounded-lg flex items-center justify-center text-sidebar-primary-foreground shadow-sm">
                      <Activity size={20} />
                  </div>
                )}
                
                {/* Desktop Toggle Button */}
                <button 
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className={`hidden md:flex p-1.5 rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors ${isSidebarCollapsed ? 'absolute -right-3 top-6 bg-sidebar border border-sidebar-border shadow-md rounded-full w-6 h-6 items-center justify-center p-0 z-50' : ''}`}
                >
                  {isSidebarCollapsed ? <ChevronRight size={14} /> : <PanelLeftClose size={16} />}
                </button>

                {/* Mobile Close Button */}
                <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-muted-foreground">
                  <X size={20} />
                </button>
             </div>

             {/* Navigation Links */}
             <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar flex flex-col">
                
                <div className="space-y-1">
                  <NavItem id="overview" icon={LayoutDashboard} label="Overview" />
                  <NavItem id="topology" icon={Network} label="Topology" />
                  <NavItem id="code" icon={FileCode} label="Code Specs" />
                  <NavItem id="console" icon={Command} label="Console AI" hasBadge={true} />
                </div>

                <div className="my-6 border-t border-sidebar-border/50 mx-2"></div>

                {/* Collapsible History Section */}
                <div className="space-y-1">
                   {!isSidebarCollapsed ? (
                     <>
                        <button 
                          onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider hover:text-sidebar-foreground transition-colors group"
                        >
                           <span>History</span>
                           <ChevronDown size={12} className={`transition-transform duration-200 ${isProjectsExpanded ? '' : '-rotate-90'}`} />
                        </button>
                        
                        <div className={`space-y-0.5 overflow-hidden transition-all duration-300 ${isProjectsExpanded ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                           {blueprintHistory.map((bp, i) => (
                              <button 
                                 key={i} 
                                 onClick={() => handleLoadProject(i)}
                                 className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors group ${i === currentHistoryIndex ? 'text-sidebar-foreground bg-sidebar-accent/50' : 'text-muted-foreground hover:bg-sidebar-accent/30 hover:text-sidebar-foreground'}`}
                              >
                                 <span className="truncate flex-1 text-left">{bp.name}</span>
                              </button>
                           ))}
                           <button onClick={handleNewProject} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-sidebar-primary hover:bg-sidebar-accent/30 rounded-lg transition-colors mt-2">
                              <Plus size={14} /> 
                              <span>New Project</span>
                           </button>
                        </div>
                     </>
                   ) : (
                     // Collapsed History Icons
                     <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-[1px] bg-sidebar-border mb-2"></div>
                        <button onClick={handleNewProject} className="p-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-primary transition-colors" title="New Project">
                           <Plus size={18} />
                        </button>
                        {blueprintHistory.length > 0 && (
                           <button onClick={() => { setIsSidebarCollapsed(false); setIsProjectsExpanded(true); }} className="p-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors" title="View History">
                              <span className="text-xs font-bold">...</span>
                           </button>
                        )}
                     </div>
                   )}
                </div>

                <div className="mt-auto pt-6">
                   <button 
                      onClick={() => setShowThemePanel(!showThemePanel)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                        ${showThemePanel 
                          ? 'bg-sidebar-accent text-sidebar-primary-foreground font-medium shadow-sm' 
                          : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'}
                      `}
                      title={isSidebarCollapsed ? "Settings" : ''}
                   >
                      <div className={`relative flex items-center justify-center ${isSidebarCollapsed ? 'mx-auto' : ''}`}>
                         <Settings size={18} className={`${showThemePanel ? 'text-sidebar-primary' : 'text-muted-foreground group-hover:text-sidebar-foreground'} transition-colors`} />
                      </div>
                      
                      {!isSidebarCollapsed && (
                         <span className="truncate flex-1 text-left text-sm">Settings</span>
                      )}
                   </button>
                </div>
             </div>

             {/* User Profile */}
             <div className="p-4 border-t border-sidebar-border">
                <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                   <div className="w-9 h-9 rounded-full bg-sidebar-accent border border-sidebar-border flex items-center justify-center shrink-0 relative overflow-hidden group cursor-pointer hover:border-sidebar-primary transition-colors">
                      <User size={16} className="text-muted-foreground group-hover:text-sidebar-primary transition-colors" />
                   </div>
                   
                   {!isSidebarCollapsed && (
                     <div className="flex-1 min-w-0 flex items-center justify-between">
                        <div className="overflow-hidden">
                           <div className="text-xs font-bold text-sidebar-foreground truncate">Admin User</div>
                           <div className="text-[10px] text-muted-foreground truncate">admin@vickymosafan.ai</div>
                        </div>
                        <button className="text-muted-foreground hover:text-destructive transition-colors">
                           <LogOut size={14} />
                        </button>
                     </div>
                   )}
                </div>
             </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
             
             {/* Top Header */}
             <div className="h-16 border-b border-border bg-card/50 flex items-center justify-between px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                 <div className="flex items-center gap-4">
                     <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-muted-foreground hover:text-foreground transition-colors"><Menu size={24}/></button>
                     <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="hover:text-foreground cursor-pointer font-medium transition-colors">vickymosafan</span>
                        <ChevronRight size={14} />
                        <span className="font-semibold text-foreground capitalize">{activeTab}</span>
                     </nav>
                 </div>
                 <div className="flex items-center gap-4">
                     <div className="relative hidden sm:block group">
                        <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"/>
                        <input type="text" placeholder="Search resources..." className="h-9 w-64 bg-muted/40 border border-border rounded-full pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"/>
                     </div>
                     <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/50 rounded-full">
                        <Bell size={18} />
                        {currentBlueprint?.securityReport.some(s => s.severity === 'critical') && (
                           <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border border-background animate-pulse"></span>
                        )}
                     </button>
                     <button onClick={() => setShowGitModal(true)} className="hidden sm:flex items-center gap-2 h-9 px-4 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow hover:bg-primary/90 transition-all active:scale-95">
                        <GitBranch size={14} /> <span>Sync</span>
                     </button>
                 </div>
             </div>

             {/* Content Workspace */}
             <div className="flex-1 overflow-auto custom-scrollbar p-6">
                
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
                        <div className="flex items-center justify-between">
                           <div>
                              <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Dashboard</h2>
                              <p className="text-muted-foreground text-sm mt-1">Real-time architecture metrics and system health.</p>
                           </div>
                           <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border">
                              <button className="px-4 py-1.5 text-xs font-medium bg-background shadow-sm rounded-md text-foreground transition-all">Overview</button>
                              <button className="px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Analytics</button>
                              <button className="px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Reports</button>
                           </div>
                        </div>

                        {!currentBlueprint ? (
                           <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-card/30">
                              <Command size={48} className="mx-auto text-muted-foreground mb-4 opacity-50"/>
                              <h3 className="text-lg font-bold text-foreground">No Blueprint Active</h3>
                              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">Your architecture workspace is empty. Start by generating a new singularity blueprint in the Console.</p>
                              <button onClick={() => setActiveTab('console')} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all">Launch Console</button>
                           </div>
                        ) : (
                           <>
                              {/* Metrics Row */}
                              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                 <MetricCard title="Total Nodes" value={metrics?.nodeCount || 0} change="+2" icon={Activity} />
                                 <MetricCard title="Avg Latency" value={`${metrics?.avgLatency}ms`} change="-12ms" trend="down" icon={Network} />
                                 <MetricCard title="Error Rate" value={`${metrics?.avgErrors}%`} change="+0.1%" trend="up" icon={ShieldAlert} />
                                 <MetricCard title="Security Issues" value={metrics?.securityIssues || 0} change="Critical" trend="down" icon={LogOut} />
                              </div>

                              {/* Charts & Lists */}
                              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                                 {/* Main Chart */}
                                 <div className="col-span-4 bg-card border border-border rounded-xl shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-6">
                                       <div>
                                          <h3 className="text-sm font-bold text-foreground">Simulation Overview</h3>
                                          <p className="text-[10px] text-muted-foreground">Load vs Latency Correlation</p>
                                       </div>
                                       <button className="text-xs text-primary hover:underline">View Details</button>
                                    </div>
                                    <div className="h-[300px] w-full">
                                       <SimulationHub data={currentBlueprint.simulationData} />
                                    </div>
                                 </div>

                                 {/* Recent Activity / Security */}
                                 <div className="col-span-3 bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col">
                                    <h3 className="text-sm font-bold text-foreground mb-4">Recent Activity</h3>
                                    <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
                                       <RecentActivity report={currentBlueprint.securityReport} />
                                    </div>
                                 </div>
                              </div>
                           </>
                        )}
                    </div>
                )}

                {/* TOPOLOGY TAB */}
                {activeTab === 'topology' && (
                    <div className="h-full w-full bg-card border border-border rounded-xl overflow-hidden shadow-sm relative animate-in fade-in zoom-in-95 duration-300">
                       <div className="absolute top-4 left-4 z-10 flex gap-2">
                          <select 
                             className="bg-background/80 border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none backdrop-blur shadow-sm hover:border-primary/50 transition-colors"
                             onChange={(e) => setTechFilter(e.target.value || null)}
                          >
                             <option value="">All Technologies</option>
                             {currentBlueprint && Array.from(new Set(currentBlueprint.nodes.map(n => n.tech))).map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                       </div>
                       <NodeCanvas blueprint={currentBlueprint} onNodeSelect={setSelectedNode} techFilter={techFilter} />
                    </div>
                )}

                {/* CODE TAB */}
                {activeTab === 'code' && currentBlueprint && (
                   <div className="h-full flex flex-col bg-card border border-border rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
                      <div className="flex border-b border-border bg-muted/30">
                         {['infrastructure', 'requirements', 'frontend', 'backend', 'database'].map((sub) => (
                            <button
                               key={sub}
                               onClick={() => setCodeSubTab(sub as any)}
                               className={`px-6 py-3 text-xs font-mono font-bold border-r border-border transition-all uppercase relative overflow-hidden ${codeSubTab === sub ? 'bg-background text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                            >
                               {codeSubTab === sub && <div className="absolute top-0 left-0 w-full h-0.5 bg-primary"></div>}
                               {sub}
                            </button>
                         ))}
                         <div className="ml-auto flex items-center px-4">
                            <button 
                              onClick={() => {
                                 const content = codeSubTab === 'frontend' ? displayedFrontendSpec :
                                       codeSubTab === 'backend' ? currentBlueprint.backendSpec :
                                       codeSubTab === 'database' ? currentBlueprint.databaseSpec :
                                       codeSubTab === 'requirements' ? currentBlueprint.requirementsSpec :
                                       currentBlueprint.godModePrompt;
                                 copyToClipboard(content, codeSubTab);
                              }}
                              className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded"
                              title="Copy to Clipboard"
                            >
                               {copiedSection === codeSubTab ? <Check size={16}/> : <Copy size={16}/>}
                            </button>
                         </div>
                      </div>
                      <div className="flex-1 overflow-auto p-8 md:p-12 bg-card/50">
                        <div className="max-w-5xl mx-auto pb-20">
                           <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                 h1: ({node, ...props}) => <h1 className="text-3xl font-bold tracking-tight text-primary border-b border-border pb-2 mt-8 mb-6 first:mt-0" {...props} />,
                                 h2: ({node, ...props}) => <h2 className="text-2xl font-bold tracking-tight text-foreground mt-8 mb-4" {...props} />,
                                 h3: ({node, ...props}) => <h3 className="text-xl font-bold tracking-tight text-foreground mt-6 mb-3" {...props} />,
                                 h4: ({node, ...props}) => <h4 className="text-lg font-bold text-foreground mt-6 mb-2" {...props} />,
                                 p: ({node, ...props}) => <p className="leading-7 mb-4 text-sm text-muted-foreground" {...props} />,
                                 ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 text-sm text-muted-foreground space-y-1" {...props} />,
                                 ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 text-sm text-muted-foreground space-y-1" {...props} />,
                                 li: ({node, ...props}) => <li className="pl-1" {...props} />,
                                 blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground mb-6" {...props} />,
                                 a: ({node, ...props}) => <a className="font-medium text-primary hover:underline underline-offset-4" {...props} />,
                                 table: ({node, ...props}) => <div className="my-6 w-full overflow-y-auto rounded-lg border border-border"><table className="w-full text-sm" {...props} /></div>,
                                 thead: ({node, ...props}) => <thead className="bg-muted text-muted-foreground font-medium border-b border-border" {...props} />,
                                 th: ({node, ...props}) => <th className="px-4 py-3 text-left font-bold" {...props} />,
                                 tbody: ({node, ...props}) => <tbody className="divide-y divide-border bg-card" {...props} />,
                                 tr: ({node, ...props}) => <tr className="transition-colors hover:bg-muted/50" {...props} />,
                                 td: ({node, ...props}) => <td className="px-4 py-3 align-top" {...props} />,
                                 code: ({node, className, children, ...props}: any) => {
                                    const match = /language-(\w+)/.exec(className || '');
                                    const isInline = !match && !String(children).includes('\n');
                                    
                                    if (isInline) {
                                       return (
                                          <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-primary border border-border" {...props}>
                                             {children}
                                          </code>
                                       );
                                    }

                                    return (
                                       <div className="relative rounded-lg border border-border bg-muted/30 my-6 group">
                                          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
                                             <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{match?.[1] || 'text'}</span>
                                             <div className="flex gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/30"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/30"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/30"></div>
                                             </div>
                                          </div>
                                          <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed custom-scrollbar">
                                             <code className={className} {...props}>
                                                {children}
                                             </code>
                                          </pre>
                                       </div>
                                    );
                                 }
                              }}
                           >
                              {codeSubTab === 'frontend' ? displayedFrontendSpec :
                               codeSubTab === 'backend' ? currentBlueprint.backendSpec :
                               codeSubTab === 'database' ? currentBlueprint.databaseSpec :
                               codeSubTab === 'requirements' ? currentBlueprint.requirementsSpec :
                               currentBlueprint.godModePrompt}
                           </ReactMarkdown>
                        </div>
                      </div>
                   </div>
                )}

                {/* CONSOLE TAB (CHAT) */}
                {activeTab === 'console' && (
                   <div className="h-full flex flex-col max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-300 relative">
                      <div className="flex-1 overflow-y-auto space-y-6 pb-32 p-4 custom-scrollbar">
                         {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'vicky' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                  {msg.role === 'vicky' ? <Activity size={16} /> : <User size={16} />}
                               </div>
                               <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                  <div className={`p-4 rounded-2xl text-sm border shadow-sm ${msg.role === 'user' ? 'bg-primary/10 border-primary/20 text-foreground rounded-tr-none' : 'bg-card border-border text-foreground rounded-tl-none'}`}>
                                     {msg.role === 'vicky' && <span className="text-[10px] font-bold text-primary mb-2 block tracking-wider">VICKY AI</span>}
                                     <p className="whitespace-pre-wrap font-mono leading-relaxed">{msg.content}</p>
                                  </div>
                                  <span className="text-[10px] text-muted-foreground mt-1 px-1">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                               </div>
                            </div>
                         ))}
                         {loading && (
                            <div className="flex items-center gap-2 text-muted-foreground text-xs font-mono ml-12 p-2 bg-muted/20 rounded-lg w-fit">
                               <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                               <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-75"></span>
                               <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></span>
                               Processing Architecture...
                            </div>
                         )}
                      </div>
                      
                      {/* Input Area */}
                      <div className="p-4 bg-background/80 backdrop-blur border-t border-border absolute bottom-0 left-0 right-0 z-20">
                         <div className="relative max-w-4xl mx-auto">
                            <textarea
                               value={input}
                               onChange={(e) => setInput(e.target.value)}
                               onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                               placeholder="Describe your architectural requirements (e.g. 'Microservices for E-Commerce using Go and gRPC')..."
                               className="w-full bg-card border border-border rounded-xl p-4 pr-14 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none min-h-[60px] resize-none font-mono shadow-lg transition-all"
                            />
                            <button 
                              onClick={handleSend}
                              disabled={loading || !input.trim()}
                              className="absolute bottom-3 right-3 p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all disabled:opacity-50 hover:scale-105 active:scale-95"
                            >
                               <Send size={16} />
                            </button>
                         </div>
                         <div className="flex justify-between mt-2 px-1 max-w-4xl mx-auto">
                            <div className="flex gap-4 text-[10px] text-muted-foreground font-mono">
                               <span className="flex items-center gap-1.5 hover:text-foreground cursor-pointer transition-colors"><Terminal size={10}/> Bash Mode</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground">{input.length} chars</span>
                         </div>
                      </div>
                   </div>
                )}
             </div>

          </div>

          {/* Theme Editor (Absolute Overlay) */}
          {showThemePanel && (
            <div className={`absolute top-0 bottom-0 right-0 w-[320px] bg-card border-l border-border z-[60] shadow-2xl animate-in slide-in-from-right duration-300`}>
                <button onClick={() => setShowThemePanel(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={16}/></button>
                <ThemeEditor config={themeConfig} onChange={setThemeConfig} />
            </div>
          )}

          {/* Node Details (Absolute Overlay) */}
          {selectedNode && (
            <div className="absolute right-0 top-0 bottom-0 w-[300px] bg-card/95 backdrop-blur border-l border-border p-6 z-[55] shadow-2xl animate-in slide-in-from-right overflow-y-auto">
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
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Analysis</label>
                    <p className="text-sm text-foreground mt-1 leading-relaxed">{selectedNode.details}</p>
                  </div>
              </div>
            </div>
          )}

      </div>
    </div>
  );
};

export default App;