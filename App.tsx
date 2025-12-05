
import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  PanelLeftClose, MessageSquare
} from 'lucide-react';

// Custom Vicky AI Logo Component
const VickyLogo = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5"/>
    <path d="M7.5 9L12 17L16.5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 17V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 2"/>
    <circle cx="12" cy="17" r="2" className="fill-current" />
    <circle cx="7.5" cy="9" r="1.5" className="fill-current" />
    <circle cx="16.5" cy="9" r="1.5" className="fill-current" />
    <circle cx="12" cy="12" r="1" className="fill-current" fillOpacity="0.5" />
  </svg>
);

const App: React.FC = () => {
  const [input, setInput] = useState('');
  
  // Theme State
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(DEFAULT_DARK_THEME);
  const [showThemePanel, setShowThemePanel] = useState(false);
  
  // Sidebar State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);

  // Chat Auto Scroll
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
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
    { role: 'vicky', content: 'vickymosafan ONLINE. SYSTEM READY.', timestamp: Date.now() }
  ]);
  
  // MAIN VIEW STATE
  const [activeTab, setActiveTab] = useState<'overview' | 'topology' | 'code' | 'console' | 'settings'>('overview');
  const [codeSubTab, setCodeSubTab] = useState<'infrastructure' | 'requirements' | 'frontend' | 'backend' | 'database'>('infrastructure');
  
  // Interactions
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [techFilter, setTechFilter] = useState<string | null>(null);
  const [showGitModal, setShowGitModal] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Auto Scroll Chat
  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages]);

  // --- 1. LOCAL STORAGE PERSISTENCE ---
  useEffect(() => {
    const saved = localStorage.getItem('vicky_blueprints_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBlueprintHistory(parsed);
          setCurrentHistoryIndex(parsed.length - 1);
          setMessages(prev => [...prev, { role: 'vicky', content: 'Core Memory Restored. Resuming previous session.', timestamp: Date.now() }]);
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
    setMessages([{ role: 'vicky', content: 'System Reset. Initializing New Project.', timestamp: Date.now() }]);
    setInput('');
    setSelectedNode(null);
    setActiveTab('console');
  };

  const handleLoadProject = (index: number) => {
    setCurrentHistoryIndex(index);
    setMessages([{ role: 'vicky', content: `Loading Blueprint: ${blueprintHistory[index].name}`, timestamp: Date.now() }]);
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
      "Initializing Neural Link...",
      "Pattern Analysis in Progress...",
      "Running 1M User Stress Simulation...",
      "Synthesizing Requirements...",
      "Validating Zero Trust Protocols...",
      "Finalizing Clean Architecture..."
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
         return [...clean, { role: 'vicky', content: `Analysis Complete. Blueprint '${result.name}' generated successfully.`, timestamp: Date.now() }];
      });
      
      // Auto switch to overview after generation
      setActiveTab('overview');

    } catch (error) {
      clearInterval(interval);
      setMessages(prev => [...prev, { role: 'vicky', content: 'ERROR: Singularity Failure. Please retry.', timestamp: Date.now() }]);
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
      case 'sm': return 'w-[640px] h-[90%] rounded-2xl border border-white/10 shadow-2xl overflow-hidden';
      case 'md': return 'w-[768px] h-[90%] rounded-2xl border border-white/10 shadow-2xl overflow-hidden';
      case 'lg': return 'w-[1024px] h-[90%] rounded-2xl border border-white/10 shadow-2xl overflow-hidden';
      case 'xl': return 'w-[1280px] h-[90%] rounded-2xl border border-white/10 shadow-2xl overflow-hidden';
      case '2xl': return 'w-[1536px] h-[90%] rounded-2xl border border-white/10 shadow-2xl overflow-hidden';
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
          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group relative overflow-hidden
          ${isActive 
            ? 'bg-primary/10 text-primary font-medium shadow-[inset_0_0_0_1px_rgba(var(--primary),0.2)]' 
            : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}
        `}
        title={isSidebarCollapsed ? label : ''}
      >
        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]"></div>}
        
        <div className={`relative flex items-center justify-center ${isSidebarCollapsed ? 'mx-auto' : ''}`}>
           <Icon size={18} className={`${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'} transition-colors`} />
           {hasBadge && (
             <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
             </span>
           )}
        </div>
        
        {!isSidebarCollapsed && (
           <span className="truncate flex-1 text-left text-sm tracking-wide">{label}</span>
        )}
      </button>
    );
  };

  return (
    <div className={`flex h-screen w-screen bg-black overflow-hidden font-sans selection:bg-primary/30 selection:text-primary justify-center items-end ${isSimulated ? 'pt-10' : ''}`}>
      
      {/* GIT SYNC MODAL */}
      {showGitModal && (
        <div className="absolute inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border p-8 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden text-card-foreground ring-1 ring-white/10">
             <div className="absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_15px_var(--primary)]"></div>
             <button onClick={() => setShowGitModal(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-transform hover:rotate-90"><X size={24}/></button>
             <h2 className="text-2xl font-bold mb-2 flex items-center gap-3 font-mono"><GitBranch className="text-primary" size={28}/> VICKY GIT SYNC</h2>
             <p className="text-muted-foreground text-sm mb-6">Push architecture specs to remote repository.</p>
             <button onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); setShowGitModal(false); setMessages(prev => [...prev, {role: 'vicky', content: 'GIT SYNC SUCCESS: Artifacts pushed to remote.', timestamp: Date.now()}]) }, 1500); }} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-bold transition-all shadow-lg shadow-primary/20">PUSH CHANGES</button>
          </div>
        </div>
      )}

      {/* APP CONTAINER */}
      <div className={`relative flex bg-background transition-all duration-300 ${getViewportStyle()}`}>
          
          {/* MOBILE OVERLAY */}
          {isMobileMenuOpen && (
             <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          )}

          {/* SIDEBAR NAVIGATION (LEFT) */}
          <div className={`
            border-r border-white/5 flex flex-col bg-background/80 backdrop-blur-xl relative z-50 transition-all duration-300 ease-out
            ${isSidebarCollapsed ? 'w-[72px]' : 'w-[280px]'}
            fixed md:relative inset-y-0 left-0
            ${isMobileMenuOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full md:translate-x-0'}
          `}>
             {/* Sidebar Header */}
             <div className={`h-16 flex items-center border-b border-white/5 px-5 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
                {!isSidebarCollapsed ? (
                   <div className="flex items-center gap-3 overflow-hidden group cursor-default">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary shadow-[0_0_10px_rgba(var(--primary),0.3)] shrink-0 border border-primary/20 group-hover:border-primary/50 transition-colors">
                         <VickyLogo size={20} />
                      </div>
                      <div className="flex flex-col min-w-0">
                         <h1 className="text-sm font-bold tracking-tight text-foreground truncate font-mono">vickymosafan</h1>
                         <div className="text-[10px] text-muted-foreground truncate tracking-widest uppercase">Architect AI v4.2</div>
                      </div>
                   </div>
                ) : (
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary shadow-[0_0_10px_rgba(var(--primary),0.3)] border border-primary/20">
                      <VickyLogo size={22} />
                  </div>
                )}
                
                {/* Desktop Toggle Button */}
                <button 
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className={`hidden md:flex p-1.5 rounded-full text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all ${isSidebarCollapsed ? 'absolute -right-3 top-6 bg-card border border-border shadow-lg z-50' : ''}`}
                >
                  {isSidebarCollapsed ? <ChevronRight size={14} /> : <PanelLeftClose size={16} />}
                </button>

                <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-muted-foreground">
                  <X size={20} />
                </button>
             </div>

             {/* Navigation Links */}
             <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar flex flex-col">
                
                <div className="space-y-1">
                  <NavItem id="overview" icon={LayoutDashboard} label="Dashboard" />
                  <NavItem id="topology" icon={Network} label="Topology Map" />
                  <NavItem id="code" icon={FileCode} label="Code Specs" />
                  <NavItem id="console" icon={Terminal} label="Console AI" hasBadge={true} />
                </div>

                <div className="my-6 border-t border-white/5 mx-2"></div>

                {/* Collapsible History Section */}
                <div className="space-y-1">
                   {!isSidebarCollapsed ? (
                     <>
                        <button 
                          onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
                          className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest hover:text-foreground transition-colors group"
                        >
                           <span>Project History</span>
                           <ChevronDown size={12} className={`transition-transform duration-200 ${isProjectsExpanded ? '' : '-rotate-90'}`} />
                        </button>
                        
                        <div className={`space-y-0.5 overflow-hidden transition-all duration-300 ${isProjectsExpanded ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                           {blueprintHistory.map((bp, i) => (
                              <button 
                                 key={i} 
                                 onClick={() => handleLoadProject(i)}
                                 className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all group ${i === currentHistoryIndex ? 'text-foreground bg-white/5 border border-white/5' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent'}`}
                              >
                                 <span className="truncate flex-1 text-left font-mono text-xs">{bp.name}</span>
                              </button>
                           ))}
                           <button onClick={handleNewProject} className="w-full flex items-center gap-3 px-3 py-2 text-xs text-primary hover:text-primary-foreground hover:bg-primary/20 border border-transparent hover:border-primary/20 rounded-lg transition-all mt-3">
                              <Plus size={14} /> 
                              <span>Initialize New</span>
                           </button>
                        </div>
                     </>
                   ) : (
                     // Collapsed History Icons
                     <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-[1px] bg-white/10 mb-2"></div>
                        <button onClick={handleNewProject} className="p-2 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors" title="New Project">
                           <Plus size={18} />
                        </button>
                     </div>
                   )}
                </div>

                <div className="mt-auto pt-6">
                   <button 
                      onClick={() => setShowThemePanel(!showThemePanel)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                        ${showThemePanel 
                          ? 'bg-white/10 text-foreground font-medium shadow-sm' 
                          : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}
                      `}
                   >
                      <div className={`relative flex items-center justify-center ${isSidebarCollapsed ? 'mx-auto' : ''}`}>
                         <Settings size={18} className={`${showThemePanel ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'} transition-colors`} />
                      </div>
                      
                      {!isSidebarCollapsed && (
                         <span className="truncate flex-1 text-left text-sm">System Config</span>
                      )}
                   </button>
                </div>
             </div>

             {/* User Profile */}
             <div className="p-4 border-t border-white/5 bg-black/20">
                <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                   <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center shrink-0 relative overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors shadow-lg">
                      <User size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                   </div>
                   
                   {!isSidebarCollapsed && (
                     <div className="flex-1 min-w-0 flex items-center justify-between">
                        <div className="overflow-hidden">
                           <div className="text-xs font-bold text-foreground truncate">Admin</div>
                           <div className="text-[10px] text-muted-foreground truncate font-mono">root@vicky.ai</div>
                        </div>
                        <button className="text-muted-foreground hover:text-destructive transition-colors p-1 hover:bg-white/5 rounded">
                           <LogOut size={14} />
                        </button>
                     </div>
                   )}
                </div>
             </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 flex flex-col h-full bg-background/50 relative overflow-hidden">
             
             {/* Top Header */}
             <div className="h-16 border-b border-white/5 bg-background/40 flex items-center justify-between px-6 backdrop-blur-md z-30 sticky top-0">
                 <div className="flex items-center gap-4">
                     <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-muted-foreground hover:text-foreground transition-colors"><Menu size={24}/></button>
                     <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="hover:text-foreground cursor-pointer font-medium transition-colors">vickymosafan</span>
                        <ChevronRight size={14} className="opacity-50" />
                        <span className="font-semibold text-foreground capitalize bg-white/5 px-2 py-0.5 rounded text-xs border border-white/5">{activeTab}</span>
                     </nav>
                 </div>
                 <div className="flex items-center gap-4">
                     <div className="relative hidden sm:block group">
                        <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"/>
                        <input type="text" placeholder="Search architecture nodes..." className="h-9 w-64 bg-black/20 border border-white/10 rounded-full pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50 text-foreground"/>
                     </div>
                     <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors hover:bg-white/5 rounded-full">
                        <Bell size={18} />
                        {currentBlueprint?.securityReport.some(s => s.severity === 'critical') && (
                           <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border border-background animate-pulse shadow-[0_0_8px_var(--destructive)]"></span>
                        )}
                     </button>
                     <button onClick={() => setShowGitModal(true)} className="hidden sm:flex items-center gap-2 h-9 px-4 bg-primary text-primary-foreground text-xs font-bold rounded-lg shadow-lg hover:bg-primary/90 transition-all active:scale-95 border border-white/10">
                        <GitBranch size={14} /> <span>Sync Repo</span>
                     </button>
                 </div>
             </div>

             {/* Content Workspace */}
             <div className="flex-1 overflow-auto custom-scrollbar p-6 relative">
                
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex items-center justify-between">
                           <div>
                              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl font-sans">System Dashboard</h2>
                              <p className="text-muted-foreground text-sm mt-1 font-mono">Real-time architecture metrics and system health analysis.</p>
                           </div>
                           <div className="flex items-center gap-1 bg-black/20 p-1 rounded-lg border border-white/10">
                              <button className="px-4 py-1.5 text-xs font-medium bg-white/10 shadow-sm rounded-md text-foreground transition-all border border-white/5">Overview</button>
                              <button className="px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Analytics</button>
                           </div>
                        </div>

                        {!currentBlueprint ? (
                           <div className="flex flex-col items-center justify-center py-24 border border-dashed border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                              <div className="p-4 bg-primary/10 rounded-full mb-4 ring-1 ring-primary/30">
                                <Command size={48} className="text-primary opacity-80"/>
                              </div>
                              <h3 className="text-xl font-bold text-foreground mb-2">No Active Blueprint</h3>
                              <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto text-center">Your architecture workspace is empty. Initialize the singularity engine to generate a new system blueprint.</p>
                              <button onClick={() => setActiveTab('console')} className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2">
                                <Terminal size={16}/> Launch Console AI
                              </button>
                           </div>
                        ) : (
                           <>
                              {/* Metrics Row */}
                              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                 <MetricCard title="Total Nodes" value={metrics?.nodeCount || 0} change="+2" icon={Activity} />
                                 <MetricCard title="Avg Latency" value={`${metrics?.avgLatency}ms`} change="-12ms" trend="down" icon={Network} />
                                 <MetricCard title="Error Rate" value={`${metrics?.avgErrors}%`} change="+0.1%" trend="up" icon={ShieldAlert} />
                                 <MetricCard title="Security Risks" value={metrics?.securityIssues || 0} change="Critical" trend="down" icon={LogOut} />
                              </div>

                              {/* Charts & Lists */}
                              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 h-[400px]">
                                 {/* Main Chart */}
                                 <div className="col-span-4 bg-card/40 backdrop-blur-md border border-border/50 rounded-xl shadow-sm p-6 flex flex-col">
                                    <div className="flex items-center justify-between mb-6">
                                       <div>
                                          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Load vs Latency</h3>
                                          <p className="text-[10px] text-muted-foreground font-mono">Real-time Simulation Data</p>
                                       </div>
                                       <button className="text-xs text-primary hover:text-primary/80 transition-colors font-mono">[EXPAND]</button>
                                    </div>
                                    <div className="flex-1 w-full min-h-0">
                                       <SimulationHub data={currentBlueprint.simulationData} />
                                    </div>
                                 </div>

                                 {/* Recent Activity / Security */}
                                 <div className="col-span-3 bg-card/40 backdrop-blur-md border border-border/50 rounded-xl shadow-sm p-6 flex flex-col">
                                    <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
                                      <ShieldAlert size={14} className="text-primary"/> Security Report
                                    </h3>
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
                    <div className="h-full w-full bg-black/40 border border-white/10 rounded-xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-500 backdrop-blur-sm">
                       <div className="absolute top-4 left-4 z-20 flex gap-2">
                          <div className="relative">
                            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                            <select 
                              className="pl-9 bg-background/60 border border-white/10 rounded-lg pr-4 py-2 text-xs focus:outline-none backdrop-blur-md shadow-lg hover:border-primary/50 transition-colors text-foreground appearance-none min-w-[150px]"
                              onChange={(e) => setTechFilter(e.target.value || null)}
                            >
                              <option value="">All Technologies</option>
                              {currentBlueprint && Array.from(new Set(currentBlueprint.nodes.map(n => n.tech))).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"/>
                          </div>
                       </div>
                       <NodeCanvas blueprint={currentBlueprint} onNodeSelect={setSelectedNode} techFilter={techFilter} />
                    </div>
                )}

                {/* CODE TAB */}
                {activeTab === 'code' && currentBlueprint && (
                   <div className="h-full flex flex-col bg-card/30 backdrop-blur-md border border-border/50 rounded-xl shadow-lg overflow-hidden animate-in fade-in duration-300">
                      <div className="flex border-b border-border/50 bg-black/20">
                         {['infrastructure', 'requirements', 'frontend', 'backend', 'database'].map((sub) => (
                            <button
                               key={sub}
                               onClick={() => setCodeSubTab(sub as any)}
                               className={`px-6 py-3 text-[10px] md:text-xs font-mono font-bold border-r border-border/30 transition-all uppercase relative overflow-hidden tracking-wider ${codeSubTab === sub ? 'bg-white/5 text-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}`}
                            >
                               {codeSubTab === sub && <div className="absolute top-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_8px_var(--primary)]"></div>}
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
                              className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-white/10 rounded-md"
                              title="Copy to Clipboard"
                            >
                               {copiedSection === codeSubTab ? <Check size={16} className="text-emerald-500"/> : <Copy size={16}/>}
                            </button>
                         </div>
                      </div>
                      <div className="flex-1 overflow-auto p-8 md:p-12 bg-black/40 relative">
                        <div className="max-w-5xl mx-auto pb-20">
                           <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                 h1: ({node, ...props}) => <h1 className="text-3xl font-bold tracking-tight text-primary border-b border-primary/20 pb-4 mt-8 mb-6 first:mt-0 font-sans uppercase" {...props} />,
                                 h2: ({node, ...props}) => <h2 className="text-2xl font-bold tracking-tight text-foreground mt-10 mb-4 font-sans flex items-center gap-2 before:content-['#'] before:text-primary/50" {...props} />,
                                 h3: ({node, ...props}) => <h3 className="text-xl font-bold tracking-tight text-foreground mt-8 mb-3 font-sans" {...props} />,
                                 p: ({node, ...props}) => <p className="leading-7 mb-4 text-sm text-muted-foreground/90 font-sans" {...props} />,
                                 ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 text-sm text-muted-foreground space-y-1 marker:text-primary" {...props} />,
                                 ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 text-sm text-muted-foreground space-y-1 marker:text-primary" {...props} />,
                                 blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground mb-6 bg-white/5 p-4 rounded-r-lg" {...props} />,
                                 code: ({node, className, children, ...props}: any) => {
                                    const match = /language-(\w+)/.exec(className || '');
                                    const isInline = !match && !String(children).includes('\n');
                                    
                                    if (isInline) {
                                       return (
                                          <code className="bg-primary/10 px-1.5 py-0.5 rounded text-xs font-mono text-primary border border-primary/20" {...props}>
                                             {children}
                                          </code>
                                       );
                                    }

                                    return (
                                       <div className="relative rounded-xl border border-white/10 bg-black/50 my-6 group overflow-hidden shadow-2xl">
                                          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5">
                                             <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                                <Code size={12} className="text-primary"/> {match?.[1] || 'text'}
                                             </span>
                                             <div className="flex gap-1.5 opacity-50">
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
                   <div className="h-full flex flex-col max-w-5xl mx-auto animate-in fade-in duration-500 relative bg-black/20 rounded-t-2xl border-x border-t border-white/5 backdrop-blur-sm shadow-2xl">
                      {/* Console Header */}
                      <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 justify-between rounded-t-2xl">
                         <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                            <Terminal size={12} />
                            <span>vicky_terminal_v4.2</span>
                         </div>
                         <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-white/20"></div>
                            <div className="w-2 h-2 rounded-full bg-white/20"></div>
                         </div>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-6 pb-32 p-6 custom-scrollbar" ref={chatContainerRef}>
                         {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-lg border ${msg.role === 'vicky' ? 'bg-black/40 border-primary/30 text-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]' : 'bg-white/10 border-white/10 text-foreground'}`}>
                                  {msg.role === 'vicky' ? <VickyLogo size={18} /> : <User size={16} />}
                               </div>
                               <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                  <div className={`
                                     relative p-5 rounded-2xl text-sm border shadow-md backdrop-blur-md
                                     ${msg.role === 'user' 
                                       ? 'bg-primary/10 border-primary/20 text-foreground rounded-tr-sm' 
                                       : 'bg-card/60 border-white/10 text-foreground rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.3)]'}
                                  `}>
                                     {msg.role === 'vicky' && (
                                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                                           <span className="text-[10px] font-bold text-primary tracking-widest uppercase">VICKY AI</span>
                                           <span className="text-[10px] font-mono text-muted-foreground">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                     )}
                                     <p className="whitespace-pre-wrap font-mono leading-relaxed text-[13px]">{msg.content}</p>
                                     {msg.role === 'vicky' && <div className="absolute -left-1 top-4 w-1 h-8 bg-primary/50 rounded-r"></div>}
                                  </div>
                                  {msg.role === 'user' && <span className="text-[10px] text-muted-foreground mt-1 px-1 opacity-50">{new Date(msg.timestamp).toLocaleTimeString()}</span>}
                               </div>
                            </div>
                         ))}
                         {loading && (
                            <div className="flex items-center gap-3 text-primary text-xs font-mono ml-14 p-3 bg-primary/5 border border-primary/10 rounded-lg w-fit animate-pulse">
                               <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                               </span>
                               PROCESSING NEURAL ARCHITECTURE...
                            </div>
                         )}
                      </div>
                      
                      {/* Floating Input Area */}
                      <div className="absolute bottom-6 left-6 right-6 z-20">
                         <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-600/50 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                            <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl flex flex-col shadow-2xl">
                                <textarea
                                   value={input}
                                   onChange={(e) => setInput(e.target.value)}
                                   onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                                   placeholder="Describe your architectural requirements (e.g. 'Microservices for E-Commerce using Go and gRPC')..."
                                   className="w-full bg-transparent p-4 pr-16 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none min-h-[60px] max-h-[200px] resize-none font-mono"
                                />
                                <div className="flex items-center justify-between px-4 pb-3 pt-1 border-t border-white/5 bg-white/5 rounded-b-xl">
                                    <div className="flex gap-3 text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                                       <span className="flex items-center gap-1.5 hover:text-primary cursor-pointer transition-colors"><Terminal size={10}/> Command Mode</span>
                                       <span className="flex items-center gap-1.5 hover:text-primary cursor-pointer transition-colors"><Code size={10}/> RAW Input</span>
                                    </div>
                                    <button 
                                      onClick={handleSend}
                                      disabled={loading || !input.trim()}
                                      className="p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all disabled:opacity-50 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                                    >
                                       <Send size={16} />
                                    </button>
                                </div>
                            </div>
                         </div>
                      </div>
                   </div>
                )}
             </div>

          </div>

          {/* Theme Editor (Absolute Overlay) */}
          {showThemePanel && (
            <div className={`absolute top-0 bottom-0 right-0 w-[340px] bg-card/95 backdrop-blur-xl border-l border-border z-[70] shadow-2xl animate-in slide-in-from-right duration-300`}>
                <button onClick={() => setShowThemePanel(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground hover:rotate-90 transition-all"><X size={18}/></button>
                <ThemeEditor config={themeConfig} onChange={setThemeConfig} />
            </div>
          )}

          {/* Node Details (Absolute Overlay) */}
          {selectedNode && (
            <div className="absolute right-6 top-20 bottom-6 w-[320px] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 z-[60] shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-300 overflow-y-auto ring-1 ring-white/5">
              <button onClick={() => setSelectedNode(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={20}/></button>
              
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                    <Activity className="text-primary" size={24}/>
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-foreground leading-none">{selectedNode.label}</h3>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase mt-1 block">{selectedNode.type}</span>
                 </div>
              </div>

              <div className="space-y-6">
                  <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <label className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2 block">Technology</label>
                    <div className="text-sm font-mono text-primary font-bold">{selectedNode.tech}</div>
                  </div>

                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2 block">System Status</label>
                    <div className={`flex items-center gap-3 p-3 rounded-lg border bg-opacity-10 ${
                       selectedNode.status === 'optimal' ? 'bg-emerald-500 border-emerald-500/20 text-emerald-500' : 
                       selectedNode.status === 'warning' ? 'bg-yellow-500 border-yellow-500/20 text-yellow-500' : 
                       'bg-destructive border-destructive/20 text-destructive'
                    }`}>
                        <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                           selectedNode.status === 'optimal' ? 'bg-emerald-500' : 
                           selectedNode.status === 'warning' ? 'bg-yellow-500' : 
                           'bg-destructive'
                        }`}></div>
                        <span className="text-xs font-bold uppercase">{selectedNode.status}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2 block">Deep Analysis</label>
                    <div className="text-sm text-muted-foreground leading-relaxed p-4 bg-white/5 rounded-xl border border-white/5 font-sans">
                       {selectedNode.details}
                    </div>
                  </div>
              </div>
            </div>
          )}

      </div>
    </div>
  );
};

export default App;
