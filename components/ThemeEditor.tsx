

import React, { useState, useRef, useEffect } from 'react';
import { ThemeConfig } from '../types';
import { TAILWIND_PALETTE, DEFAULT_DARK_THEME, DEFAULT_LIGHT_THEME } from '../lib/theme';
import { ArrowLeft, ArrowRight, Wand2, Circle, Check, ChevronDown, Search, X, Moon, Sun, Shuffle, Type, LayoutTemplate, Palette, Smartphone, Tablet, Monitor, Maximize, Laptop, Info, Waves } from 'lucide-react';

interface ThemeEditorProps {
  config: ThemeConfig;
  onChange: (newConfig: ThemeConfig) => void;
}

interface PresetDefinition {
  name: string;
  description: string;
  light: ThemeConfig;
  dark: ThemeConfig;
}

const PRESETS: PresetDefinition[] = [
  {
    name: 'Default',
    description: 'System Default (OKLCH)',
    light: DEFAULT_LIGHT_THEME,
    dark: DEFAULT_DARK_THEME
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

  const handlePresetSelect = (preset: PresetDefinition) => {
    // Apply the theme variant based on the CURRENT active mode
    const targetTheme = config.mode === 'dark' ? preset.dark : preset.light;
    
    // Preserve the current viewport setting, only update styling
    onChange({ 
      ...targetTheme, 
      viewport: config.viewport,
      mode: config.mode 
    });
  };

  const handleModeChange = (mode: 'light' | 'dark') => {
    if (config.mode === mode) return;

    // When switching mode, we look at the Default preset to get the correct base values for that mode
    // This ensures we switch to the "Correct" Dark/Light version of the theme
    // instead of just flipping the 'mode' string while keeping incongruent colors.
    const defaultPreset = PRESETS.find(p => p.name === 'Default');
    const targetBase = defaultPreset ? (mode === 'dark' ? defaultPreset.dark : defaultPreset.light) : (mode === 'dark' ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME);

    onChange({ 
        ...config, 
        ...targetBase,
        viewport: config.viewport // Preserve viewport
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
                {PRESETS.map((preset) => {
                    // Determine which visual variant to show based on current mode
                    const currentVariant = config.mode === 'dark' ? preset.dark : preset.light;
                    const isActive = config.primaryColor === currentVariant.primaryColor && config.background === currentVariant.background;

                    return (
                        <button
                            key={preset.name}
                            onClick={() => handlePresetSelect(preset)}
                            className={`group relative flex items-center gap-4 p-4 bg-muted/30 border rounded-xl transition-all hover:shadow-xl text-left overflow-hidden ${isActive ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/30'}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="flex -space-x-2 relative z-10">
                                <div className="w-8 h-8 rounded-full shadow-lg ring-2 ring-card z-30" style={{ backgroundColor: currentVariant.background }}></div>
                                <div className="w-8 h-8 rounded-full shadow-lg ring-2 ring-card z-20" style={{ backgroundColor: currentVariant.primaryColor }}></div>
                                <div className="w-8 h-8 rounded-full shadow-lg ring-2 ring-card z-10" style={{ backgroundColor: currentVariant.sidebar }}></div>
                            </div>

                            <div className="relative z-10 flex-1">
                                <span className="text-xs font-bold text-foreground block flex items-center gap-2">
                                    {preset.name}
                                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-background border border-border text-muted-foreground uppercase">{config.mode}</span>
                                </span>
                                <span className="text-[10px] text-muted-foreground">{preset.description}</span>
                            </div>

                            {/* Active Indicator */}
                            {isActive && (
                                <div className="relative z-10 text-primary bg-primary/10 p-1.5 rounded-full animate-in zoom-in-50 duration-200">
                                    <Check size={14} />
                                </div>
                            )}
                        </button>
                    );
                })}
           </div>
        )}

        {activeTab === 'colors' && (
            <>
                <CollapsibleSection id="sidebar" title="Sidebar Colors">
                    <ColorRow label="Sidebar Background" field="sidebar" value={config.sidebar || 'oklch(0.205 0 0)'} />
                    <ColorRow label="Sidebar Foreground" field="sidebarForeground" value={config.sidebarForeground || 'oklch(0.985 0 0)'} />
                    <ColorRow label="Sidebar Primary" field="sidebarPrimary" value={config.sidebarPrimary || 'oklch(0.488 0.243 264.376)'} />
                    <ColorRow label="Sidebar Primary Foreground" field="sidebarPrimaryForeground" value={config.sidebarPrimaryForeground || 'oklch(0.985 0 0)'} />
                    <ColorRow label="Sidebar Accent" field="sidebarAccent" value={config.sidebarAccent || 'oklch(0.269 0 0)'} />
                    <ColorRow label="Sidebar Accent Foreground" field="sidebarAccentForeground" value={config.sidebarAccentForeground || 'oklch(0.985 0 0)'} />
                    <ColorRow label="Sidebar Border" field="sidebarBorder" value={config.sidebarBorder || 'oklch(0.275 0 0)'} />
                    <ColorRow label="Sidebar Ring" field="sidebarRing" value={config.sidebarRing || 'oklch(0.439 0 0)'} />
                </CollapsibleSection>

                <CollapsibleSection id="charts" title="Chart Colors">
                    <ColorRow label="Chart 1" field="chart1" value={config.chart1 || 'oklch(0.81 0.10 252)'} />
                    <ColorRow label="Chart 2" field="chart2" value={config.chart2 || 'oklch(0.62 0.19 260)'} />
                    <ColorRow label="Chart 3" field="chart3" value={config.chart3 || 'oklch(0.55 0.22 263)'} />
                    <ColorRow label="Chart 4" field="chart4" value={config.chart4 || 'oklch(0.49 0.22 264)'} />
                    <ColorRow label="Chart 5" field="chart5" value={config.chart5 || 'oklch(0.42 0.18 266)'} />
                </CollapsibleSection>

                <CollapsibleSection id="base" title="Base Colors">
                    <ColorRow label="Background" field="background" value={config.background || 'oklch(0.145 0 0)'} />
                    <ColorRow label="Foreground" field="foreground" value={config.foreground || 'oklch(0.985 0 0)'} />
                </CollapsibleSection>

                <CollapsibleSection id="card" title="Card Colors">
                    <ColorRow label="Card Background" field="card" value={config.card || 'oklch(0.205 0 0)'} />
                    <ColorRow label="Card Foreground" field="cardForeground" value={config.cardForeground || 'oklch(0.985 0 0)'} />
                </CollapsibleSection>

                <CollapsibleSection id="popover" title="Popover Colors">
                    <ColorRow label="Popover Background" field="popover" value={config.popover || 'oklch(0.269 0 0)'} />
                    <ColorRow label="Popover Foreground" field="popoverForeground" value={config.popoverForeground || 'oklch(0.985 0 0)'} />
                </CollapsibleSection>

                <CollapsibleSection id="muted" title="Muted Colors">
                    <ColorRow label="Muted" field="muted" value={config.muted || 'oklch(0.269 0 0)'} />
                    <ColorRow label="Muted Foreground" field="mutedForeground" value={config.mutedForeground || 'oklch(0.708 0 0)'} />
                </CollapsibleSection>

                <CollapsibleSection id="destructive" title="Destructive Colors">
                    <ColorRow label="Destructive" field="destructive" value={config.destructive || 'oklch(0.704 0.191 22.216)'} />
                    <ColorRow label="Destructive Foreground" field="destructiveForeground" value={config.destructiveForeground || 'oklch(0.985 0 0)'} />
                </CollapsibleSection>

                <CollapsibleSection id="borderInput" title="Border & Input Colors">
                    <ColorRow label="Border" field="border" value={config.border || 'oklch(0.275 0 0)'} />
                    <ColorRow label="Input" field="input" value={config.input || 'oklch(0.325 0 0)'} />
                    <ColorRow label="Ring" field="ring" value={config.ring || 'oklch(0.556 0 0)'} />
                </CollapsibleSection>

                <CollapsibleSection id="primary" title="Primary Colors">
                    <ColorRow label="Primary" field="primaryColor" value={config.primaryColor} />
                    <ColorRow label="Primary Foreground" field="primaryForeground" value={config.primaryForeground || 'oklch(0.205 0 0)'} />
                </CollapsibleSection>

                <CollapsibleSection id="secondary" title="Secondary Colors">
                    <ColorRow label="Secondary" field="secondaryColor" value={config.secondaryColor || 'oklch(0.269 0 0)'} />
                    <ColorRow label="Secondary Foreground" field="secondaryForeground" value={config.secondaryForeground || 'oklch(0.985 0 0)'} />
                </CollapsibleSection>

                <CollapsibleSection id="accent" title="Accent Colors">
                    <ColorRow label="Accent" field="accentColor" value={config.accentColor || 'oklch(0.371 0 0)'} />
                    <ColorRow label="Accent Foreground" field="accentForeground" value={config.accentForeground || 'oklch(0.985 0 0)'} />
                </CollapsibleSection>
            </>
        )}

        {activeTab === 'typography' && (
           <div className="p-4 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              
              {/* Alert */}
              <div className="bg-muted/30 border border-border rounded-xl p-4 flex gap-3 items-start">
                  <div className="mt-0.5 text-muted-foreground"><Info size={16}/></div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                      To use custom fonts, embed them in your project. See <a href="#" className="underline decoration-muted-foreground/50 underline-offset-4 hover:text-primary">Tailwind docs</a> for details.
                  </div>
              </div>

              {/* Font Family Section */}
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                  <button 
                      onClick={() => toggleSection('fontFamily')}
                      className="w-full flex items-center justify-between p-3 bg-muted/30 border-b border-border/50 hover:bg-muted/50 transition-colors"
                  >
                      <h4 className="text-xs font-bold text-foreground">Font Family</h4>
                      <ChevronDown size={14} className="text-muted-foreground"/>
                  </button>
                  <div className="p-4 space-y-4">
                      {/* Sans */}
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sans-Serif Font</label>
                          <div className="relative">
                              <select 
                                value={config.fontSans}
                                onChange={(e) => onChange({...config, fontSans: e.target.value})}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none transition-shadow"
                              >
                                  <option value="'Rajdhani', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif">Rajdhani (Default)</option>
                                  <option value="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'">System UI</option>
                                  <option value="'Inter', sans-serif">Inter</option>
                                  <option value="'Roboto', sans-serif">Roboto</option>
                                  <option value="'Open Sans', sans-serif">Open Sans</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={14} />
                          </div>
                      </div>
                       {/* Serif */}
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Serif Font</label>
                          <div className="relative">
                              <select 
                                value={config.fontSerif}
                                onChange={(e) => onChange({...config, fontSerif: e.target.value})}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none transition-shadow"
                              >
                                  <option value="ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif">System Serif</option>
                                  <option value="'Merriweather', serif">Merriweather</option>
                                  <option value="'Playfair Display', serif">Playfair Display</option>
                                  <option value="'Lora', serif">Lora</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={14} />
                          </div>
                      </div>
                      {/* Mono */}
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Monospace Font</label>
                          <div className="relative">
                              <select 
                                value={config.fontMono}
                                onChange={(e) => onChange({...config, fontMono: e.target.value})}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none transition-shadow"
                              >
                                  <option value="'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace">JetBrains Mono (Default)</option>
                                  <option value="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace">System Mono</option>
                                  <option value="'Fira Code', monospace">Fira Code</option>
                                  <option value="'Source Code Pro', monospace">Source Code Pro</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={14} />
                          </div>
                      </div>
                  </div>
              </div>

              {/* Letter Spacing Section */}
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                   <div className="p-3 bg-muted/30 border-b border-border">
                      <h4 className="text-xs font-bold text-foreground">Letter Spacing</h4>
                  </div>
                  <div className="p-4 space-y-6">
                       <div className="flex items-center justify-between">
                           <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Letter Spacing</label>
                           <div className="flex items-center gap-1 bg-background border border-border rounded-lg px-2 py-1 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                               <input 
                                  type="number" 
                                  step="0.01"
                                  value={config.letterSpacing}
                                  onChange={(e) => onChange({...config, letterSpacing: parseFloat(e.target.value)})}
                                  className="w-12 bg-transparent text-xs text-right focus:outline-none font-mono"
                               />
                               <span className="text-[10px] text-muted-foreground font-mono">em</span>
                           </div>
                       </div>
                       <div className="relative h-6 flex items-center">
                            <div className="absolute w-full h-1 bg-muted rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-primary transition-all duration-75" 
                                    style={{ width: `${Math.min(100, Math.max(0, ((config.letterSpacing + 0.1) / 0.6) * 100))}%` }}
                                ></div>
                            </div>
                            <input 
                                type="range"
                                min="-0.1"
                                max="0.5"
                                step="0.01"
                                value={config.letterSpacing}
                                onChange={(e) => onChange({...config, letterSpacing: parseFloat(e.target.value)})}
                                className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div 
                                className="w-4 h-4 bg-background rounded-full shadow-md border-2 border-primary absolute pointer-events-none transition-transform duration-75"
                                style={{ left: `calc(${Math.min(100, Math.max(0, ((config.letterSpacing + 0.1) / 0.6) * 100))}% - 8px)` }}
                            ></div>
                       </div>
                  </div>
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
           <div className="p-4 space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             
             <div className="bg-muted/30 border border-border rounded-xl p-1 grid grid-cols-2 gap-1 mb-4">
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

             {/* Radius Section */}
             <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <button 
                    onClick={() => toggleSection('radius')}
                    className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors border-b border-border/50"
                >
                    <span className="text-xs font-bold text-foreground">Radius</span>
                    <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${openSections['radius'] !== false ? 'rotate-180' : ''}`} />
                </button>
                {openSections['radius'] !== false && (
                    <div className="p-4 space-y-6 bg-background/50">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Radius</label>
                            <div className="flex items-center gap-1 bg-background border border-border rounded-lg px-2 py-1 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                                <input 
                                    type="number" 
                                    step="0.05"
                                    value={config.radius}
                                    onChange={(e) => onChange({...config, radius: parseFloat(e.target.value)})}
                                    className="w-12 bg-transparent text-xs text-right focus:outline-none font-mono"
                                />
                                <span className="text-[10px] text-muted-foreground font-mono">rem</span>
                            </div>
                        </div>
                        <div className="relative h-6 flex items-center">
                            <div className="absolute w-full h-1 bg-muted rounded-full overflow-hidden">
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
                            className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div 
                                className="w-4 h-4 bg-background rounded-full shadow-lg border-2 border-primary absolute pointer-events-none transition-all"
                                style={{ left: `calc(${(config.radius / 2) * 100}% - 8px)` }}
                            ></div>
                        </div>
                    </div>
                )}
             </div>

             {/* Spacing Section */}
             <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <button 
                    onClick={() => toggleSection('spacing')}
                    className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors border-b border-border/50"
                >
                    <span className="text-xs font-bold text-foreground">Spacing</span>
                    <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${openSections['spacing'] !== false ? 'rotate-180' : ''}`} />
                </button>
                {openSections['spacing'] !== false && (
                    <div className="p-4 space-y-6 bg-background/50">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Spacing</label>
                            <div className="flex items-center gap-1 bg-background border border-border rounded-lg px-2 py-1 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                                <input 
                                    type="number" 
                                    step="0.05"
                                    value={config.spacing}
                                    onChange={(e) => onChange({...config, spacing: parseFloat(e.target.value)})}
                                    className="w-12 bg-transparent text-xs text-right focus:outline-none font-mono"
                                />
                                <span className="text-[10px] text-muted-foreground font-mono">rem</span>
                            </div>
                        </div>
                        <div className="relative h-6 flex items-center">
                            <div className="absolute w-full h-1 bg-muted rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-primary" 
                                    style={{ width: `${(config.spacing / 2) * 100}%` }}
                                ></div>
                            </div>
                            <input 
                            type="range" 
                            min="0" 
                            max="2" 
                            step="0.05"
                            value={config.spacing}
                            onChange={(e) => onChange({ ...config, spacing: parseFloat(e.target.value) })}
                            className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div 
                                className="w-4 h-4 bg-background rounded-full shadow-lg border-2 border-primary absolute pointer-events-none transition-all"
                                style={{ left: `calc(${(config.spacing / 2) * 100}% - 8px)` }}
                            ></div>
                        </div>
                    </div>
                )}
             </div>

             {/* Shadow Section */}
             <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <button 
                    onClick={() => toggleSection('shadow')}
                    className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors border-b border-border/50"
                >
                    <span className="text-xs font-bold text-foreground">Shadow</span>
                    <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${openSections['shadow'] !== false ? 'rotate-180' : ''}`} />
                </button>
                {openSections['shadow'] !== false && (
                    <div className="p-4 space-y-4 bg-background/50">
                        
                        {/* Shadow Color */}
                        <ColorRow label="Shadow Color" field="shadowColor" value={config.shadowColor} />

                        {/* Shadow Opacity */}
                        <div className="space-y-3 pt-2">
                             <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Shadow Opacity</label>
                                <div className="bg-background border border-border rounded px-2 py-0.5 text-[10px] font-mono">{config.shadowOpacity.toFixed(2)}</div>
                             </div>
                             <input 
                                type="range" 
                                min="0" max="1" step="0.01" 
                                value={config.shadowOpacity}
                                onChange={(e) => onChange({...config, shadowOpacity: parseFloat(e.target.value)})}
                                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                             />
                        </div>

                        {/* Blur Radius */}
                        <div className="space-y-3">
                             <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Blur Radius</label>
                                <div className="flex items-center gap-1 bg-background border border-border rounded px-2 py-0.5">
                                    <input 
                                        type="number" 
                                        value={config.shadowBlur}
                                        onChange={(e) => onChange({...config, shadowBlur: parseFloat(e.target.value)})}
                                        className="w-8 bg-transparent text-[10px] text-right focus:outline-none font-mono"
                                    />
                                    <span className="text-[10px] text-muted-foreground font-mono">px</span>
                                </div>
                             </div>
                             <input 
                                type="range" 
                                min="0" max="50" step="1" 
                                value={config.shadowBlur}
                                onChange={(e) => onChange({...config, shadowBlur: parseFloat(e.target.value)})}
                                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                             />
                        </div>

                        {/* Spread */}
                        <div className="space-y-3">
                             <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Spread</label>
                                <div className="flex items-center gap-1 bg-background border border-border rounded px-2 py-0.5">
                                    <input 
                                        type="number" 
                                        value={config.shadowSpread}
                                        onChange={(e) => onChange({...config, shadowSpread: parseFloat(e.target.value)})}
                                        className="w-8 bg-transparent text-[10px] text-right focus:outline-none font-mono"
                                    />
                                    <span className="text-[10px] text-muted-foreground font-mono">px</span>
                                </div>
                             </div>
                             <input 
                                type="range" 
                                min="-20" max="20" step="1" 
                                value={config.shadowSpread}
                                onChange={(e) => onChange({...config, shadowSpread: parseFloat(e.target.value)})}
                                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                             />
                        </div>

                         {/* Offset X */}
                         <div className="space-y-3">
                             <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Offset X</label>
                                <div className="flex items-center gap-1 bg-background border border-border rounded px-2 py-0.5">
                                    <input 
                                        type="number" 
                                        value={config.shadowX}
                                        onChange={(e) => onChange({...config, shadowX: parseFloat(e.target.value)})}
                                        className="w-8 bg-transparent text-[10px] text-right focus:outline-none font-mono"
                                    />
                                    <span className="text-[10px] text-muted-foreground font-mono">px</span>
                                </div>
                             </div>
                             <input 
                                type="range" 
                                min="-50" max="50" step="1" 
                                value={config.shadowX}
                                onChange={(e) => onChange({...config, shadowX: parseFloat(e.target.value)})}
                                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                             />
                        </div>

                         {/* Offset Y */}
                         <div className="space-y-3">
                             <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Offset Y</label>
                                <div className="flex items-center gap-1 bg-background border border-border rounded px-2 py-0.5">
                                    <input 
                                        type="number" 
                                        value={config.shadowY}
                                        onChange={(e) => onChange({...config, shadowY: parseFloat(e.target.value)})}
                                        className="w-8 bg-transparent text-[10px] text-right focus:outline-none font-mono"
                                    />
                                    <span className="text-[10px] text-muted-foreground font-mono">px</span>
                                </div>
                             </div>
                             <input 
                                type="range" 
                                min="-50" max="50" step="1" 
                                value={config.shadowY}
                                onChange={(e) => onChange({...config, shadowY: parseFloat(e.target.value)})}
                                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                             />
                        </div>
                    </div>
                )}
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
