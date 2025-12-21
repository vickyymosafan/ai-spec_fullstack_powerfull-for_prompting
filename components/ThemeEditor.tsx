
import React, { useState, useRef, useEffect } from 'react';
import { ThemeConfig } from '../types';
import { TAILWIND_PALETTE, DEFAULT_DARK_THEME, DEFAULT_LIGHT_THEME } from '../lib/theme';
import { Check, ChevronDown, Search, X, Shuffle, Palette } from 'lucide-react';

interface ThemeEditorProps {
  config: ThemeConfig;
  onChange: (newConfig: ThemeConfig) => void;
}

// Added explicit typing for COLOR_SECTIONS to ensure keys match ThemeConfig
const COLOR_SECTIONS: {
  id: string;
  title: string;
  fields: { label: string; key: keyof ThemeConfig }[];
}[] = [
  {
    id: 'base',
    title: 'Base Colors',
    fields: [
      { label: 'Background', key: 'background' },
      { label: 'Foreground', key: 'foreground' },
      { label: 'primaryColor', key: 'primaryColor' },
      { label: 'primaryForeground', key: 'primaryForeground' }
    ]
  },
  {
    id: 'sidebar',
    title: 'Sidebar Colors',
    fields: [
      { label: 'Sidebar Bg', key: 'sidebar' },
      { label: 'Sidebar Fg', key: 'sidebarForeground' },
      { label: 'Sidebar Primary', key: 'sidebarPrimary' },
      { label: 'Sidebar Border', key: 'sidebarBorder' }
    ]
  },
  {
    id: 'functional',
    title: 'Functional',
    fields: [
      { label: 'Muted', key: 'muted' },
      { label: 'Muted Foreground', key: 'mutedForeground' },
      { label: 'Border', key: 'border' },
      { label: 'Destructive', key: 'destructive' }
    ]
  }
];

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ config, onChange }) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'colors' | 'typography'>('presets');
  const [activeColorField, setActiveColorField] = useState<keyof ThemeConfig | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ base: true });
  const paletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) setActiveColorField(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleColorSelect = (hex: string) => {
    if (activeColorField) {
      onChange({ ...config, [activeColorField]: hex });
      setActiveColorField(null);
    }
  };

  const ColorRow = ({ label, field, value }: { label: string, field: keyof ThemeConfig, value: string }) => (
    <div className="mb-3">
      <label className="text-[10px] font-bold text-muted-foreground mb-1 block uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setActiveColorField(field)}
          className="w-8 h-8 rounded border border-border shadow-inner shrink-0"
          style={{ backgroundColor: value }}
        />
        <input 
          type="text" 
          value={value}
          readOnly
          className="flex-1 bg-input border border-border rounded px-2 py-1.5 text-[11px] font-mono text-foreground focus:outline-none"
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-card text-foreground border-l border-border relative">
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
         <span className="text-xs font-bold tracking-tight flex items-center gap-2"><Palette size={14}/> VISUAL ENGINE</span>
         <div className="flex gap-2">
           <button onClick={() => onChange(config.mode === 'dark' ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME)} className="p-1.5 hover:bg-muted rounded transition-colors"><Shuffle size={12}/></button>
         </div>
      </div>

      <div className="flex px-4 border-b border-border bg-card gap-4 overflow-x-auto shrink-0">
         {['presets', 'colors', 'typography'].map(tab => (
           <button 
             key={tab}
             onClick={() => setActiveTab(tab as any)}
             className={`py-3 text-[10px] font-bold border-b-2 transition-all uppercase tracking-widest ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
           >
             {tab}
           </button>
         ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {activeTab === 'presets' && (
           <div className="space-y-3">
             {[
               { name: 'Singularity Dark', theme: DEFAULT_DARK_THEME },
               { name: 'Singularity Light', theme: DEFAULT_LIGHT_THEME }
             ].map(p => (
               <button
                 key={p.name}
                 onClick={() => onChange(p.theme)}
                 className={`w-full flex items-center gap-4 p-4 bg-muted/30 border rounded-xl transition-all hover:border-primary/50 text-left ${config.mode === p.theme.mode ? 'border-primary bg-primary/5' : 'border-border'}`}
               >
                 <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full border border-border" style={{ backgroundColor: p.theme.background }}></div>
                    <div className="w-6 h-6 rounded-full border border-border" style={{ backgroundColor: p.theme.primaryColor }}></div>
                 </div>
                 <div className="flex-1">
                    <div className="text-[11px] font-bold">{p.name}</div>
                    <div className="text-[9px] text-muted-foreground uppercase">{p.theme.mode} MODE</div>
                 </div>
                 {config.mode === p.theme.mode && <Check size={14} className="text-primary"/>}
               </button>
             ))}
           </div>
        )}

        {activeTab === 'colors' && COLOR_SECTIONS.map(section => (
          <div key={section.id} className="border border-border rounded-xl overflow-hidden bg-muted/10">
            <button 
              onClick={() => setOpenSections(prev => ({ ...prev, [section.id]: !prev[section.id] }))}
              className="w-full flex items-center justify-between p-3 border-b border-border bg-muted/20"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest">{section.title}</span>
              <ChevronDown size={12} className={`transition-transform ${openSections[section.id] ? 'rotate-180' : ''}`} />
            </button>
            {openSections[section.id] && (
              <div className="p-4 animate-in slide-in-from-top-1 duration-200">
                {section.fields.map(field => (
                  <ColorRow key={field.key} label={field.label} field={field.key} value={String(config[field.key] ?? '')} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {activeColorField && (
        <div ref={paletteRef} className="absolute inset-x-2 bottom-2 top-20 bg-card border border-border rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
             <div className="flex items-center gap-2 p-3 border-b border-border bg-card">
                <Search size={14} className="text-muted-foreground"/>
                <input 
                    type="text" 
                    placeholder="Search colors..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-xs w-full focus:outline-none"
                />
                <button onClick={() => setActiveColorField(null)}><X size={14}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 grid grid-cols-4 gap-2 custom-scrollbar">
                {Object.entries(TAILWIND_PALETTE).map(([name, shades]) => (
                  Object.entries(shades).map(([weight, hex]) => (
                    <button
                      key={`${name}-${weight}`}
                      onClick={() => handleColorSelect(hex)}
                      className="aspect-square rounded border border-border transition-transform hover:scale-110"
                      style={{ backgroundColor: hex }}
                      title={`${name} ${weight}`}
                    />
                  ))
                ))}
            </div>
        </div>
      )}

      <div className="p-3 border-t border-border bg-muted/10 text-[9px] text-center text-muted-foreground font-mono">
          VICKY_CORE_STYLES_V4.2
      </div>
    </div>
  );
};
