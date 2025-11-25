

import React, { useState, useRef, useEffect } from 'react';
import { ThemeConfig } from '../types';
import { ArrowLeft, ArrowRight, Wand2, Circle, Check, ChevronDown, Search, X, Moon, Sun, Shuffle, Type, LayoutTemplate, Palette, Smartphone, Tablet, Monitor, Maximize, Laptop } from 'lucide-react';

interface ThemeEditorProps {
  config: ThemeConfig;
  onChange: (newConfig: ThemeConfig) => void;
}

// Full Tailwind CSS Palette Map
const TAILWIND_PALETTE: Record<string, Record<string, string>> = {
  Slate: { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617' },
  Gray: { 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827', 950: '#030712' },
  Zinc: { 50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8', 400: '#a1a1aa', 500: '#71717a', 600: '#52525b', 700: '#3f3f46', 800: '#27272a', 900: '#18181b', 950: '#09090b' },
  Neutral: { 50: '#fafafa', 100: '#f5f5f5', 200: '#e5e5e5', 300: '#d4d4d4', 400: '#a3a3a3', 500: '#737373', 600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717', 950: '#0a0a0a' },
  Stone: { 50: '#fafaf9', 100: '#f5f5f4', 200: '#e7e5e4', 300: '#d6d3d1', 400: '#a8a29e', 500: '#78716c', 600: '#57534e', 700: '#44403c', 800: '#292524', 900: '#1c1917', 950: '#0c0a09' },
  Red: { 50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d', 950: '#450a0a' },
  Orange: { 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12', 950: '#431407' },
  Amber: { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f', 950: '#451a03' },
  Yellow: { 50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#eab308', 600: '#ca8a04', 700: '#a16207', 800: '#854d0e', 900: '#713f12', 950: '#422006' },
  Lime: { 50: '#f7fee7', 100: '#ecfccb', 200: '#d9f99d', 300: '#bef264', 400: '#a3e635', 500: '#84cc16', 600: '#65a30d', 700: '#4d7c0f', 800: '#3f6212', 900: '#365314', 950: '#1a2e05' },
  Green: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d', 950: '#052e16' },
  Emerald: { 50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b', 950: '#022c22' },
  Teal: { 50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4', 400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a', 950: '#042f2e' },
  Cyan: { 50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75', 900: '#164e63', 950: '#083344' },
  Sky: { 50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 800: '#075985', 900: '#0c4a6e', 950: '#082f49' },
  Blue: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554' },
  Indigo: { 50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81', 950: '#1e1b4b' },
  Violet: { 50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95', 950: '#2e1065' },
  Purple: { 50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce', 800: '#6b21a8', 900: '#581c87', 950: '#3b0764' },
  Fuchsia: { 50: '#fdf4ff', 100: '#fae8ff', 200: '#f5d0fe', 300: '#f0abfc', 400: '#e879f9', 500: '#d946ef', 600: '#c026d3', 700: '#a21caf', 800: '#86198f', 900: '#701a75', 950: '#4a044e' },
  Pink: { 50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4', 400: '#f472b6', 500: '#ec4899', 600: '#db2777', 700: '#be185d', 800: '#9d174d', 900: '#831843', 950: '#500724' },
  Rose: { 50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af', 400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c', 800: '#9f1239', 900: '#881337', 950: '#4c0519' },
};

const PRESETS: { name: string; description: string; config: Partial<ThemeConfig> }[] = [
  {
    name: 'Default',
    description: 'System Default',
    config: {
        primaryColor: '#fafafa',
        primaryForeground: '#18181b',
        secondaryColor: '#27272a',
        secondaryForeground: '#fafafa',
        accentColor: '#3f3f46',
        accentForeground: '#fafafa',
        background: '#09090b',
        foreground: '#fafafa',
        card: '#09090b',
        cardForeground: '#fafafa',
        popover: '#09090b',
        popoverForeground: '#fafafa',
        muted: '#27272a',
        mutedForeground: '#a1a1aa',
        destructive: '#7f1d1d',
        destructiveForeground: '#fafafa',
        border: '#27272a',
        input: '#27272a',
        ring: '#a1a1aa',
        chart1: '#91c5ff',
        chart2: '#3a81f6',
        chart3: '#2563ef',
        chart4: '#1a4eda',
        chart5: '#1f3fad',
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
        style: 'default',
        viewport: 'responsive'
    }
  }
];

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ config, onChange }) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'colors' | 'typography' | 'other' | 'layout'>('presets');
  const [activeColorField, setActiveColorField] = useState<keyof ThemeConfig | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    sidebar: true,
    charts: true,
    base: true,
    card: true,
    popover: true,
    muted: true,
    destructive: true,
    borderInput: true,
    primary: false,
    secondary: false,
    accent: false
  });
  const paletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(event.target as Node)) {
        setActiveColorField(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleColorSelect = (hex: string) => {
    if (activeColorField) {
      onChange({ ...config, [activeColorField]: hex });
      setActiveColorField(null);
    }
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleModeChange = (mode: 'light' | 'dark') => {
    if (config.mode === mode) return;
    
    const isDark = mode === 'dark';
    
    onChange({
        ...config,
        mode: mode,
        // Base
        background: isDark ? '#09090b' : '#ffffff',
        foreground: isDark ? '#fafafa' : '#09090b',
        // Card
        card: isDark ? '#09090b' : '#ffffff',
        cardForeground: isDark ? '#fafafa' : '#09090b',
        // Popover
        popover: isDark ? '#09090b' : '#ffffff',
        popoverForeground: isDark ? '#fafafa' : '#09090b',
        // Primary
        primaryColor: isDark ? '#fafafa' : '#18181b',
        primaryForeground: isDark ? '#18181b' : '#fafafa',
        // Secondary
        secondaryColor: isDark ? '#27272a' : '#f4f4f5',
        secondaryForeground: isDark ? '#fafafa' : '#18181b',
        // Muted
        muted: isDark ? '#27272a' : '#f4f4f5',
        mutedForeground: isDark ? '#a1a1aa' : '#71717a',
        // Accent
        accentColor: isDark ? '#3f3f46' : '#f4f4f5',
        accentForeground: isDark ? '#fafafa' : '#18181b',
        // Destructive
        destructive: isDark ? '#7f1d1d' : '#ef4444',
        destructiveForeground: '#fafafa', // usually white on red for both
        // Border/Input
        border: isDark ? '#27272a' : '#e4e4e7',
        input: isDark ? '#27272a' : '#e4e4e7',
        ring: isDark ? '#a1a1aa' : '#18181b',
        // Sidebar
        sidebar: isDark ? '#18181b' : '#f4f4f5',
        sidebarForeground: isDark ? '#fafafa' : '#09090b',
        sidebarPrimary: isDark ? '#3f3f46' : '#18181b',
        sidebarPrimaryForeground: isDark ? '#fafafa' : '#fafafa',
        sidebarAccent: isDark ? '#27272a' : '#e4e4e7',
        sidebarAccentForeground: isDark ? '#fafafa' : '#09090b',
        sidebarBorder: isDark ? '#27272a' : '#e4e4e7',
        sidebarRing: isDark ? '#a1a1aa' : '#a1a1aa',
    });
  };

  const filteredPalette = Object.entries(TAILWIND_PALETTE).filter(([name]) => 
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ColorRow = ({ label, field, value }: { label: string, field: keyof ThemeConfig, value: string }) => (
    <div className="mb-3 last:mb-0">
      <label className="text-[11px] font-bold text-muted-foreground mb-1.5 block tracking-wide">{label}</label>
      <div className="flex items-center gap-2 group">
        <button 
          onClick={() => {
              setActiveColorField(field);
              setSearchQuery('');
          }}
          className="w-10 h-10 rounded shadow-sm border border-border hover:border-foreground/50 transition-all active:scale-95 relative"
          style={{ backgroundColor: value }}
        >
          <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded"></div>
        </button>
        <div className="flex-1 flex bg-input border border-border rounded overflow-hidden group-focus-within:border-primary transition-colors">
            <input 
              type="text" 
              value={value}
              readOnly
              className="flex-1 bg-transparent px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
              onClick={() => {
                  setActiveColorField(field);
                  setSearchQuery('');
              }}
            />
            <button className="px-3 border-l border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <Shuffle size={12}/>
            </button>
        </div>
      </div>
    </div>
  );

  const CollapsibleSection = ({ 
    id, 
    title, 
    children 
  }: { 
    id: string, 
    title: string, 
    children?: React.ReactNode 
  }) => (
    <div className="border border-border rounded-xl overflow-hidden bg-card/50">
        <button 
          onClick={() => toggleSection(id)} 
          className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors border-b border-border/50"
        >
            <span className="text-xs font-bold text-foreground">{title}</span>
            <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${openSections[id] ? 'rotate-180' : ''}`} />
        </button>
        {openSections[id] && (
            <div className="p-4 bg-background/50 animate-in slide-in-from-top-2 duration-200">
                {children}
            </div>
        )}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-card text-foreground font-sans border-r border-border relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card select-none">
         <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground tracking-tight">Theme Config</span>
         </div>
         <div className="flex gap-1">
           <button className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft size={12}/></button>
           <button className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"><ArrowRight size={12}/></button>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 border-b border-border bg-card gap-4">
         {[
           { id: 'presets', label: 'Presets' },
           { id: 'colors', label: 'Colors' },
           { id: 'typography', label: 'Typography' },
           { id: 'layout', label: 'Layout' },
           { id: 'other', label: 'Other' },
         ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`py-3 text-[11px] font-bold border-b-2 transition-all ${
               activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
             }`}
           >
             {tab.label}
           </button>
         ))}
         <button className="ml-auto py-3 text-[11px] font-bold text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors">
           <Wand2 size={10}/>
         </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative p-4 space-y-2">
        {activeTab === 'presets' && (
           <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
                {PRESETS.map((preset) => (
                    <button
                        key={preset.name}
                        onClick={() => onChange({ ...config, ...preset.config } as ThemeConfig)}
                        className="group relative flex items-center gap-4 p-4 bg-muted/30 border border-border hover:border-primary/50 rounded-xl transition-all hover:shadow-xl text-left overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="flex -space-x-2 relative z-10">
                            <div className="w-8 h-8 rounded-full shadow-lg ring-2 ring-card z-30" style={{ backgroundColor: preset.config.background }}></div>
                            <div className="w-8 h-8 rounded-full shadow-lg ring-2 ring-card z-20" style={{ backgroundColor: preset.config.primaryColor }}></div>
                            <div className="w-8 h-8 rounded-full shadow-lg ring-2 ring-card z-10" style={{ backgroundColor: preset.config.sidebar }}></div>
                        </div>

                        <div className="relative z-10 flex-1">
                            <span className="text-xs font-bold text-foreground block">{preset.name}</span>
                            <span className="text-[10px] text-muted-foreground">{preset.description}</span>
                        </div>

                        {/* Active Indicator */}
                        {config.primaryColor === preset.config.primaryColor && config.background === preset.config.background && (
                            <div className="relative z-10 text-primary bg-primary/10 p-1.5 rounded-full">
                                <Check size={14} />
                            </div>
                        )}
                    </button>
                ))}
           </div>
        )}

        {activeTab === 'colors' && (
            <>
                <CollapsibleSection id="sidebar" title="Sidebar Colors">
                    <ColorRow label="Sidebar Background" field="sidebar" value={config.sidebar || '#18181b'} />
                    <ColorRow label="Sidebar Foreground" field="sidebarForeground" value={config.sidebarForeground || '#fafafa'} />
                    <ColorRow label="Sidebar Primary" field="sidebarPrimary" value={config.sidebarPrimary || '#3f3f46'} />
                    <ColorRow label="Sidebar Primary Foreground" field="sidebarPrimaryForeground" value={config.sidebarPrimaryForeground || '#fafafa'} />
                    <ColorRow label="Sidebar Accent" field="sidebarAccent" value={config.sidebarAccent || '#27272a'} />
                    <ColorRow label="Sidebar Accent Foreground" field="sidebarAccentForeground" value={config.sidebarAccentForeground || '#fafafa'} />
                    <ColorRow label="Sidebar Border" field="sidebarBorder" value={config.sidebarBorder || '#27272a'} />
                    <ColorRow label="Sidebar Ring" field="sidebarRing" value={config.sidebarRing || '#a1a1aa'} />
                </CollapsibleSection>

                <CollapsibleSection id="charts" title="Chart Colors">
                    <ColorRow label="Chart 1" field="chart1" value={config.chart1 || '#91c5ff'} />
                    <ColorRow label="Chart 2" field="chart2" value={config.chart2 || '#3a81f6'} />
                    <ColorRow label="Chart 3" field="chart3" value={config.chart3 || '#2563ef'} />
                    <ColorRow label="Chart 4" field="chart4" value={config.chart4 || '#1a4eda'} />
                    <ColorRow label="Chart 5" field="chart5" value={config.chart5 || '#1f3fad'} />
                </CollapsibleSection>

                <CollapsibleSection id="base" title="Base Colors">
                    <ColorRow label="Background" field="background" value={config.background || '#09090b'} />
                    <ColorRow label="Foreground" field="foreground" value={config.foreground || '#fafafa'} />
                </CollapsibleSection>

                <CollapsibleSection id="card" title="Card Colors">
                    <ColorRow label="Card Background" field="card" value={config.card || '#09090b'} />
                    <ColorRow label="Card Foreground" field="cardForeground" value={config.cardForeground || '#fafafa'} />
                </CollapsibleSection>

                <CollapsibleSection id="popover" title="Popover Colors">
                    <ColorRow label="Popover Background" field="popover" value={config.popover || '#09090b'} />
                    <ColorRow label="Popover Foreground" field="popoverForeground" value={config.popoverForeground || '#fafafa'} />
                </CollapsibleSection>

                <CollapsibleSection id="muted" title="Muted Colors">
                    <ColorRow label="Muted" field="muted" value={config.muted || '#27272a'} />
                    <ColorRow label="Muted Foreground" field="mutedForeground" value={config.mutedForeground || '#a1a1aa'} />
                </CollapsibleSection>

                <CollapsibleSection id="destructive" title="Destructive Colors">
                    <ColorRow label="Destructive" field="destructive" value={config.destructive || '#7f1d1d'} />
                    <ColorRow label="Destructive Foreground" field="destructiveForeground" value={config.destructiveForeground || '#fafafa'} />
                </CollapsibleSection>

                <CollapsibleSection id="borderInput" title="Border & Input Colors">
                    <ColorRow label="Border" field="border" value={config.border || '#27272a'} />
                    <ColorRow label="Input" field="input" value={config.input || '#27272a'} />
                    <ColorRow label="Ring" field="ring" value={config.ring || '#a1a1aa'} />
                </CollapsibleSection>

                <CollapsibleSection id="primary" title="Primary Colors">
                    <ColorRow label="Primary" field="primaryColor" value={config.primaryColor} />
                    <ColorRow label="Primary Foreground" field="primaryForeground" value={config.primaryForeground || '#fafafa'} />
                </CollapsibleSection>

                <CollapsibleSection id="secondary" title="Secondary Colors">
                    <ColorRow label="Secondary" field="secondaryColor" value={config.secondaryColor || '#27272a'} />
                    <ColorRow label="Secondary Foreground" field="secondaryForeground" value={config.secondaryForeground || '#fafafa'} />
                </CollapsibleSection>

                <CollapsibleSection id="accent" title="Accent Colors">
                    <ColorRow label="Accent" field="accentColor" value={config.accentColor || '#3f3f46'} />
                    <ColorRow label="Accent Foreground" field="accentForeground" value={config.accentForeground || '#fafafa'} />
                </CollapsibleSection>
            </>
        )}

        {activeTab === 'typography' && (
           <div className="p-10 flex flex-col items-center justify-center h-full text-muted-foreground text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center border border-border">
                  <Type size={32} className="opacity-50"/>
              </div>
              <div>
                  <h3 className="text-sm font-bold text-foreground mb-1">Typography Engine</h3>
                  <p className="text-xs max-w-[200px]">Font customization is locked in the free version of Nexus Zero.</p>
              </div>
           </div>
        )}

        {activeTab === 'layout' && (
           <div className="p-4 space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             
             {/* Viewport Simulator */}
             <div className="bg-muted/30 border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                   <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <LayoutTemplate size={18} />
                   </div>
                   <div>
                      <h4 className="text-xs font-bold text-foreground">Viewport Simulator</h4>
                      <p className="text-[10px] text-muted-foreground">Real-time Breakpoint Testing</p>
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                   {[
                     { id: 'sm', icon: Smartphone, label: 'Mobile', width: '640px' },
                     { id: 'md', icon: Tablet, label: 'Tablet', width: '768px' },
                     { id: 'lg', icon: Laptop, label: 'Laptop', width: '1024px' },
                     { id: 'xl', icon: Monitor, label: 'Desktop', width: '1280px' },
                     { id: '2xl', icon: Monitor, label: 'Wide', width: '1536px' },
                     { id: 'responsive', icon: Maximize, label: 'Full', width: '100%' },
                   ].map((vp) => (
                     <button
                       key={vp.id}
                       onClick={() => onChange({ ...config, viewport: vp.id as any })}
                       className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                         config.viewport === vp.id 
                           ? 'bg-primary/10 border-primary text-primary' 
                           : 'bg-background border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                       }`}
                     >
                       <vp.icon size={16} className="mb-2" />
                       <span className="text-[10px] font-bold">{vp.label}</span>
                       <span className="text-[9px] opacity-70 font-mono mt-0.5">{vp.width}</span>
                     </button>
                   ))}
                </div>
             </div>

             {/* Tailwind Info */}
             <div className="bg-muted/30 border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                   <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                      <Palette size={18} />
                   </div>
                   <div>
                      <h4 className="text-xs font-bold text-foreground">Breakpoint Reference</h4>
                      <p className="text-[10px] text-muted-foreground">Tailwind CSS Core Concepts</p>
                   </div>
                </div>

                <div className="space-y-1">
                   {[
                     { name: 'sm', size: '640px', media: '@media (min-width: 640px)' },
                     { name: 'md', size: '768px', media: '@media (min-width: 768px)' },
                     { name: 'lg', size: '1024px', media: '@media (min-width: 1024px)' },
                     { name: 'xl', size: '1280px', media: '@media (min-width: 1280px)' },
                     { name: '2xl', size: '1536px', media: '@media (min-width: 1536px)' },
                   ].map((bp) => (
                     <div key={bp.name} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded transition-colors border border-transparent hover:border-border/50">
                        <div className="flex items-center gap-3">
                           <span className="font-mono text-xs text-primary font-bold w-6">{bp.name}</span>
                           <span className="text-[10px] text-muted-foreground">{bp.media}</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-foreground">{bp.size}</span>
                     </div>
                   ))}
                </div>
             </div>
           </div>
        )}

        {activeTab === 'other' && (
           <div className="p-1 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-6">
                <div className="flex items-center justify-between">
                   <label className="text-xs font-bold text-foreground flex items-center gap-2">
                     <Circle size={14} className="text-primary"/> Border Radius
                   </label>
                   <code className="text-[10px] font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded">
                       {config.radius}rem
                   </code>
                </div>
                
                <div className="relative h-6 flex items-center">
                    <div className="absolute w-full h-1 bg-border rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary" 
                            style={{ width: `${(config.radius / 2) * 100}%` }}
                        ></div>
                    </div>
                    <input 
                    type="range" 
                    min="0" 
                    max="2" 
                    step="0.05"
                    value={config.radius}
                    onChange={(e) => onChange({ ...config, radius: parseFloat(e.target.value) })}
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                    />
                    <div 
                        className="w-4 h-4 bg-background rounded-full shadow-lg border-2 border-primary absolute pointer-events-none transition-all"
                        style={{ left: `calc(${(config.radius / 2) * 100}% - 8px)` }}
                    ></div>
                </div>
             </div>

             <div className="bg-muted/30 border border-border rounded-xl p-1 grid grid-cols-2 gap-1">
                 <button 
                    onClick={() => handleModeChange('dark')}
                    className={`flex flex-col items-center justify-center py-4 rounded-lg transition-all ${config.mode === 'dark' ? 'bg-background text-foreground shadow-sm border border-border' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent'}`}
                 >
                    <Moon size={16} className="mb-2"/>
                    <span className="text-[10px] font-bold">Dark Mode</span>
                 </button>
                 <button 
                    onClick={() => handleModeChange('light')}
                    className={`flex flex-col items-center justify-center py-4 rounded-lg transition-all ${config.mode === 'light' ? 'bg-background text-foreground shadow-sm border border-border' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent'}`}
                 >
                    <Sun size={16} className="mb-2"/>
                    <span className="text-[10px] font-bold">Light Mode</span>
                 </button>
             </div>
           </div>
        )}
      </div>
      
      {/* Palette Overlay */}
      {activeColorField && (
        <div ref={paletteRef} className="absolute inset-x-2 bottom-2 top-20 bg-card border border-border rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
             <div className="flex items-center gap-2 p-3 border-b border-border bg-card">
                <Search size={14} className="text-muted-foreground"/>
                <input 
                    type="text" 
                    autoFocus
                    placeholder="Search colors..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-xs text-foreground focus:outline-none w-full font-sans placeholder-muted-foreground"
                />
                <button onClick={() => setActiveColorField(null)} className="text-muted-foreground hover:text-foreground p-1">
                    <X size={14}/>
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
                {filteredPalette.length === 0 && (
                    <div className="text-center py-8 text-[10px] text-muted-foreground">No matching colors</div>
                )}
                {filteredPalette.map(([name, shades]) => (
                    <div key={name}>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">{name}</div>
                        <div className="grid grid-cols-6 gap-1.5">
                            {Object.entries(shades).map(([weight, hex]) => (
                            <button
                                key={weight}
                                onClick={() => handleColorSelect(hex)}
                                className="group relative w-full aspect-square rounded-[4px] transition-all hover:scale-105 hover:z-10 focus:outline-none ring-offset-background focus:ring-2 ring-foreground/20 border border-transparent hover:border-foreground/20"
                                style={{ backgroundColor: hex }}
                                title={`${name}-${weight}`}
                            >
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[8px] font-bold text-black/70 mix-blend-overlay">{weight}</span>
                                </div>
                            </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-border bg-card text-[10px] text-center text-muted-foreground font-mono">
          vickymosafan VISUAL ENGINE v4.2
      </div>
    </div>
  );
};