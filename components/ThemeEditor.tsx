

import React, { useState, useRef, useEffect } from 'react';
import { ThemeConfig } from '../types';
import { ArrowLeft, ArrowRight, Wand2, Circle, Check, ChevronDown, Search, X, Moon, Sun, Shuffle, Type, LayoutTemplate, Palette, Smartphone, Tablet, Monitor, Maximize, Laptop } from 'lucide-react';

interface ThemeEditorProps {
  config: ThemeConfig;
  onChange: (newConfig: ThemeConfig) => void;
}

// Full Tailwind CSS Palette Map (OKLCH)
const TAILWIND_PALETTE: Record<string, Record<string, string>> = {
  Slate: { 
    50: 'oklch(0.984 0.003 247.858)', 100: 'oklch(0.968 0.007 247.896)', 200: 'oklch(0.929 0.013 255.508)', 
    300: 'oklch(0.869 0.022 252.894)', 400: 'oklch(0.704 0.04 256.79)', 500: 'oklch(0.554 0.046 257.417)', 
    600: 'oklch(0.446 0.043 257.281)', 700: 'oklch(0.372 0.044 257.287)', 800: 'oklch(0.279 0.041 260.031)', 
    900: 'oklch(0.208 0.042 265.755)', 950: 'oklch(0.129 0.042 264.695)' 
  },
  Gray: { 
    50: 'oklch(0.985 0.002 247.839)', 100: 'oklch(0.967 0.003 264.542)', 200: 'oklch(0.928 0.006 264.531)', 
    300: 'oklch(0.872 0.01 258.338)', 400: 'oklch(0.707 0.022 261.325)', 500: 'oklch(0.551 0.027 264.364)', 
    600: 'oklch(0.446 0.03 256.802)', 700: 'oklch(0.373 0.034 259.733)', 800: 'oklch(0.278 0.033 256.848)', 
    900: 'oklch(0.21 0.034 264.665)', 950: 'oklch(0.13 0.028 261.692)' 
  },
  Zinc: { 
    50: 'oklch(0.985 0 0)', 100: 'oklch(0.967 0.001 286.375)', 200: 'oklch(0.92 0.004 286.32)', 
    300: 'oklch(0.871 0.006 286.286)', 400: 'oklch(0.705 0.015 286.067)', 500: 'oklch(0.552 0.016 285.938)', 
    600: 'oklch(0.442 0.017 285.786)', 700: 'oklch(0.37 0.013 285.805)', 800: 'oklch(0.274 0.006 286.033)', 
    900: 'oklch(0.21 0.006 285.885)', 950: 'oklch(0.141 0.005 285.823)' 
  },
  Neutral: { 
    50: 'oklch(0.985 0 0)', 100: 'oklch(0.97 0 0)', 200: 'oklch(0.922 0 0)', 
    300: 'oklch(0.87 0 0)', 400: 'oklch(0.708 0 0)', 500: 'oklch(0.556 0 0)', 
    600: 'oklch(0.439 0 0)', 700: 'oklch(0.371 0 0)', 800: 'oklch(0.269 0 0)', 
    900: 'oklch(0.205 0 0)', 950: 'oklch(0.145 0 0)' 
  },
  Stone: { 
    50: 'oklch(0.985 0.001 106.423)', 100: 'oklch(0.97 0.001 106.424)', 200: 'oklch(0.923 0.003 48.717)', 
    300: 'oklch(0.869 0.005 56.366)', 400: 'oklch(0.709 0.01 56.259)', 500: 'oklch(0.553 0.013 58.071)', 
    600: 'oklch(0.444 0.011 73.639)', 700: 'oklch(0.374 0.01 67.558)', 800: 'oklch(0.268 0.007 34.298)', 
    900: 'oklch(0.216 0.006 56.043)', 950: 'oklch(0.147 0.004 49.25)' 
  },
  Red: { 
    50: 'oklch(0.971 0.013 17.38)', 100: 'oklch(0.936 0.032 17.717)', 200: 'oklch(0.885 0.062 18.334)', 
    300: 'oklch(0.808 0.114 19.571)', 400: 'oklch(0.704 0.191 22.216)', 500: 'oklch(0.637 0.237 25.331)', 
    600: 'oklch(0.577 0.245 27.325)', 700: 'oklch(0.505 0.213 27.518)', 800: 'oklch(0.424 0.199 26.529)', 
    900: 'oklch(0.379 0.146 25.485)', 950: 'oklch(0.282 0.091 26.79)' 
  },
  Orange: { 
    50: 'oklch(0.98 0.016 73.684)', 100: 'oklch(0.954 0.038 75.164)', 200: 'oklch(0.901 0.076 70.697)', 
    300: 'oklch(0.837 0.128 66.29)', 400: 'oklch(0.75 0.183 55.934)', 500: 'oklch(0.705 0.213 47.675)', 
    600: 'oklch(0.646 0.222 41.116)', 700: 'oklch(0.553 0.195 38.402)', 800: 'oklch(0.47 0.157 37.304)', 
    900: 'oklch(0.408 0.123 38.172)', 950: 'oklch(0.266 0.079 36.259)' 
  },
  Amber: { 
    50: 'oklch(0.987 0.022 95.277)', 100: 'oklch(0.962 0.059 95.617)', 200: 'oklch(0.924 0.12 95.746)', 
    300: 'oklch(0.879 0.169 91.605)', 400: 'oklch(0.828 0.189 84.429)', 500: 'oklch(0.769 0.188 70.08)', 
    600: 'oklch(0.666 0.179 58.318)', 700: 'oklch(0.555 0.163 48.998)', 800: 'oklch(0.473 0.137 46.201)', 
    900: 'oklch(0.419 0.114 45.879)', 950: 'oklch(0.266 0.065 45.302)' 
  },
  Yellow: { 
    50: 'oklch(0.987 0.026 102.212)', 100: 'oklch(0.973 0.071 103.193)', 200: 'oklch(0.945 0.129 101.54)', 
    300: 'oklch(0.905 0.182 98.111)', 400: 'oklch(0.852 0.199 91.936)', 500: 'oklch(0.795 0.184 86.047)', 
    600: 'oklch(0.681 0.162 75.834)', 700: 'oklch(0.554 0.135 66.442)', 800: 'oklch(0.476 0.114 61.929)', 
    900: 'oklch(0.421 0.095 57.708)', 950: 'oklch(0.243 0.066 56.589)' 
  },
  Lime: { 
    50: 'oklch(0.986 0.031 120.757)', 100: 'oklch(0.967 0.067 122.328)', 200: 'oklch(0.938 0.127 124.321)', 
    300: 'oklch(0.897 0.196 126.665)', 400: 'oklch(0.841 0.238 128.85)', 500: 'oklch(0.768 0.233 130.85)', 
    600: 'oklch(0.648 0.2 131.684)', 700: 'oklch(0.532 0.157 131.589)', 800: 'oklch(0.453 0.124 130.933)', 
    900: 'oklch(0.405 0.101 131.063)', 950: 'oklch(0.241 0.053 131.284)' 
  },
  Green: { 
    50: 'oklch(0.982 0.018 155.826)', 100: 'oklch(0.962 0.044 156.743)', 200: 'oklch(0.925 0.084 155.995)', 
    300: 'oklch(0.871 0.15 154.449)', 400: 'oklch(0.792 0.209 151.711)', 500: 'oklch(0.723 0.219 149.579)', 
    600: 'oklch(0.627 0.194 149.214)', 700: 'oklch(0.527 0.154 150.069)', 800: 'oklch(0.448 0.119 151.328)', 
    900: 'oklch(0.393 0.095 152.541)', 950: 'oklch(0.248 0.052 154.619)' 
  },
  Emerald: { 
    50: 'oklch(0.979 0.021 166.113)', 100: 'oklch(0.95 0.052 163.051)', 200: 'oklch(0.905 0.093 164.15)', 
    300: 'oklch(0.845 0.143 164.978)', 400: 'oklch(0.765 0.177 163.223)', 500: 'oklch(0.696 0.17 162.48)', 
    600: 'oklch(0.596 0.145 163.225)', 700: 'oklch(0.508 0.118 165.612)', 800: 'oklch(0.432 0.095 166.913)', 
    900: 'oklch(0.378 0.077 168.94)', 950: 'oklch(0.229 0.046 170.145)' 
  },
  Teal: { 
    50: 'oklch(0.984 0.014 180.299)', 100: 'oklch(0.955 0.038 175.623)', 200: 'oklch(0.913 0.069 174.411)', 
    300: 'oklch(0.851 0.098 173.357)', 400: 'oklch(0.777 0.126 172.593)', 500: 'oklch(0.704 0.14 172.503)', 
    600: 'oklch(0.6 0.118 174.097)', 700: 'oklch(0.511 0.096 176.63)', 800: 'oklch(0.437 0.078 179.624)', 
    900: 'oklch(0.386 0.063 181.825)', 950: 'oklch(0.237 0.037 182.887)' 
  },
  Cyan: { 
    50: 'oklch(0.984 0.019 200.873)', 100: 'oklch(0.956 0.045 203.388)', 200: 'oklch(0.917 0.08 205.041)', 
    300: 'oklch(0.865 0.127 207.011)', 400: 'oklch(0.789 0.154 211.53)', 500: 'oklch(0.715 0.143 215.221)', 
    600: 'oklch(0.609 0.126 221.723)', 700: 'oklch(0.52 0.105 223.128)', 800: 'oklch(0.45 0.085 224.283)', 
    900: 'oklch(0.398 0.07 227.392)', 950: 'oklch(0.26 0.044 233.097)' 
  },
  Sky: { 
    50: 'oklch(0.977 0.013 236.62)', 100: 'oklch(0.951 0.026 236.824)', 200: 'oklch(0.901 0.058 230.902)', 
    300: 'oklch(0.828 0.111 230.318)', 400: 'oklch(0.746 0.16 232.661)', 500: 'oklch(0.623 0.214 259.135)', 
    600: 'oklch(0.519 0.253 263.777)', 700: 'oklch(0.446 0.229 266.302)', 800: 'oklch(0.385 0.189 266.085)', 
    900: 'oklch(0.339 0.151 265.571)', 950: 'oklch(0.225 0.1 265.176)' 
  },
  Blue: { 
    50: 'oklch(0.97 0.014 254.604)', 100: 'oklch(0.932 0.032 255.585)', 200: 'oklch(0.882 0.059 254.128)', 
    300: 'oklch(0.809 0.105 251.813)', 400: 'oklch(0.707 0.165 254.624)', 500: 'oklch(0.623 0.214 259.135)', 
    600: 'oklch(0.546 0.245 262.881)', 700: 'oklch(0.465 0.241 266.755)', 800: 'oklch(0.391 0.207 266.975)', 
    900: 'oklch(0.333 0.17 266.732)', 950: 'oklch(0.231 0.122 267.751)' 
  },
  Indigo: { 
    50: 'oklch(0.962 0.018 272.314)', 100: 'oklch(0.93 0.034 272.788)', 200: 'oklch(0.87 0.065 274.039)', 
    300: 'oklch(0.785 0.115 274.713)', 400: 'oklch(0.673 0.182 276.935)', 500: 'oklch(0.585 0.233 277.117)', 
    600: 'oklch(0.488 0.243 275.812)', 700: 'oklch(0.407 0.225 274.966)', 800: 'oklch(0.345 0.19 274.152)', 
    900: 'oklch(0.297 0.156 275.272)', 950: 'oklch(0.183 0.108 275.723)' 
  },
  Violet: { 
    50: 'oklch(0.969 0.016 293.756)', 100: 'oklch(0.943 0.029 294.588)', 200: 'oklch(0.894 0.057 293.283)', 
    300: 'oklch(0.811 0.111 293.571)', 400: 'oklch(0.702 0.183 293.541)', 500: 'oklch(0.629 0.224 291.569)', 
    600: 'oklch(0.558 0.226 287.794)', 700: 'oklch(0.485 0.198 285.594)', 800: 'oklch(0.403 0.161 283.822)', 
    900: 'oklch(0.337 0.128 284.145)', 950: 'oklch(0.223 0.098 287.975)' 
  },
  Purple: { 
    50: 'oklch(0.977 0.014 308.299)', 100: 'oklch(0.946 0.033 307.174)', 200: 'oklch(0.902 0.063 306.703)', 
    300: 'oklch(0.827 0.119 306.383)', 400: 'oklch(0.714 0.203 305.504)', 500: 'oklch(0.627 0.265 303.9)', 
    600: 'oklch(0.536 0.249 300.957)', 700: 'oklch(0.449 0.211 299.789)', 800: 'oklch(0.373 0.169 297.359)', 
    900: 'oklch(0.312 0.134 296.793)', 950: 'oklch(0.193 0.107 298.537)' 
  },
  Fuchsia: { 
    50: 'oklch(0.977 0.017 320.058)', 100: 'oklch(0.952 0.037 318.852)', 200: 'oklch(0.903 0.076 319.62)', 
    300: 'oklch(0.833 0.145 321.434)', 400: 'oklch(0.74 0.238 322.16)', 500: 'oklch(0.667 0.288 322.15)', 
    600: 'oklch(0.566 0.267 322.253)', 700: 'oklch(0.486 0.215 322.067)', 800: 'oklch(0.408 0.167 321.688)', 
    900: 'oklch(0.341 0.129 321.157)', 950: 'oklch(0.217 0.091 321.056)' 
  },
  Pink: { 
    50: 'oklch(0.971 0.014 343.198)', 100: 'oklch(0.948 0.028 342.258)', 200: 'oklch(0.899 0.061 343.231)', 
    300: 'oklch(0.823 0.12 346.018)', 400: 'oklch(0.718 0.202 349.761)', 500: 'oklch(0.656 0.241 354.308)', 
    600: 'oklch(0.592 0.249 0.551)', 700: 'oklch(0.525 0.223 3.958)', 800: 'oklch(0.447 0.183 5.484)', 
    900: 'oklch(0.384 0.146 5.897)', 950: 'oklch(0.242 0.103 6.942)' 
  },
  Rose: { 
    50: 'oklch(0.969 0.015 12.422)', 100: 'oklch(0.941 0.03 12.541)', 200: 'oklch(0.892 0.058 10.015)', 
    300: 'oklch(0.81 0.117 11.638)', 400: 'oklch(0.712 0.194 13.428)', 500: 'oklch(0.645 0.246 16.439)', 
    600: 'oklch(0.586 0.253 17.585)', 700: 'oklch(0.491 0.22 21.082)', 800: 'oklch(0.424 0.191 22.846)', 
    900: 'oklch(0.378 0.147 23.821)', 950: 'oklch(0.257 0.092 23.364)' 
  },
};

const PRESETS: { name: string; description: string; config: Partial<ThemeConfig> }[] = [
  {
    name: 'Default',
    description: 'System Default (OKLCH)',
    config: {
        primaryColor: 'oklch(0.985 0 0)', // Zinc 50
        primaryForeground: 'oklch(0.21 0.006 285.885)', // Zinc 900
        secondaryColor: 'oklch(0.274 0.006 286.033)', // Zinc 800
        secondaryForeground: 'oklch(0.985 0 0)',
        accentColor: 'oklch(0.37 0.013 285.805)', // Zinc 700
        accentForeground: 'oklch(0.985 0 0)',
        background: 'oklch(0.141 0.005 285.823)', // Zinc 950
        foreground: 'oklch(0.985 0 0)', // Zinc 50
        card: 'oklch(0.141 0.005 285.823)',
        cardForeground: 'oklch(0.985 0 0)',
        popover: 'oklch(0.141 0.005 285.823)',
        popoverForeground: 'oklch(0.985 0 0)',
        muted: 'oklch(0.274 0.006 286.033)',
        mutedForeground: 'oklch(0.705 0.015 286.067)', // Zinc 400
        destructive: 'oklch(0.379 0.146 25.485)', // Red 900
        destructiveForeground: 'oklch(0.985 0 0)',
        border: 'oklch(0.274 0.006 286.033)', // Zinc 800
        input: 'oklch(0.274 0.006 286.033)',
        ring: 'oklch(0.705 0.015 286.067)',
        chart1: 'oklch(0.746 0.16 232.661)', // Sky 400
        chart2: 'oklch(0.623 0.214 259.135)', // Blue 500
        chart3: 'oklch(0.546 0.245 262.881)', // Blue 600
        chart4: 'oklch(0.465 0.241 266.755)', // Blue 700
        chart5: 'oklch(0.391 0.207 266.975)', // Blue 800
        sidebar: 'oklch(0.21 0.006 285.885)', // Zinc 900
        sidebarForeground: 'oklch(0.985 0 0)',
        sidebarPrimary: 'oklch(0.37 0.013 285.805)', // Zinc 700
        sidebarPrimaryForeground: 'oklch(0.985 0 0)',
        sidebarAccent: 'oklch(0.274 0.006 286.033)', // Zinc 800
        sidebarAccentForeground: 'oklch(0.985 0 0)',
        sidebarBorder: 'oklch(0.274 0.006 286.033)',
        sidebarRing: 'oklch(0.705 0.015 286.067)',
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
    
    // Switch to Zinc-based OKLCH values for defaults
    onChange({
        ...config,
        mode: mode,
        // Base
        background: isDark ? 'oklch(0.141 0.005 285.823)' : 'oklch(1 0 0)',
        foreground: isDark ? 'oklch(0.985 0 0)' : 'oklch(0.141 0.005 285.823)',
        // Card
        card: isDark ? 'oklch(0.141 0.005 285.823)' : 'oklch(1 0 0)',
        cardForeground: isDark ? 'oklch(0.985 0 0)' : 'oklch(0.141 0.005 285.823)',
        // Popover
        popover: isDark ? 'oklch(0.141 0.005 285.823)' : 'oklch(1 0 0)',
        popoverForeground: isDark ? 'oklch(0.985 0 0)' : 'oklch(0.141 0.005 285.823)',
        // Primary
        primaryColor: isDark ? 'oklch(0.985 0 0)' : 'oklch(0.21 0.006 285.885)',
        primaryForeground: isDark ? 'oklch(0.21 0.006 285.885)' : 'oklch(0.985 0 0)',
        // Secondary
        secondaryColor: isDark ? 'oklch(0.274 0.006 286.033)' : 'oklch(0.967 0.001 286.375)',
        secondaryForeground: isDark ? 'oklch(0.985 0 0)' : 'oklch(0.21 0.006 285.885)',
        // Muted
        muted: isDark ? 'oklch(0.274 0.006 286.033)' : 'oklch(0.967 0.001 286.375)',
        mutedForeground: isDark ? 'oklch(0.705 0.015 286.067)' : 'oklch(0.552 0.016 285.938)',
        // Accent
        accentColor: isDark ? 'oklch(0.37 0.013 285.805)' : 'oklch(0.967 0.001 286.375)',
        accentForeground: isDark ? 'oklch(0.985 0 0)' : 'oklch(0.21 0.006 285.885)',
        // Destructive
        destructive: isDark ? 'oklch(0.379 0.146 25.485)' : 'oklch(0.637 0.237 25.331)',
        destructiveForeground: 'oklch(0.985 0 0)', 
        // Border/Input
        border: isDark ? 'oklch(0.274 0.006 286.033)' : 'oklch(0.92 0.004 286.32)',
        input: isDark ? 'oklch(0.274 0.006 286.033)' : 'oklch(0.92 0.004 286.32)',
        ring: isDark ? 'oklch(0.705 0.015 286.067)' : 'oklch(0.552 0.016 285.938)',
        // Sidebar
        sidebar: isDark ? 'oklch(0.21 0.006 285.885)' : 'oklch(0.967 0.001 286.375)',
        sidebarForeground: isDark ? 'oklch(0.985 0 0)' : 'oklch(0.21 0.006 285.885)',
        sidebarPrimary: isDark ? 'oklch(0.37 0.013 285.805)' : 'oklch(0.21 0.006 285.885)',
        sidebarPrimaryForeground: isDark ? 'oklch(0.985 0 0)' : 'oklch(0.985 0 0)',
        sidebarAccent: isDark ? 'oklch(0.274 0.006 286.033)' : 'oklch(0.92 0.004 286.32)',
        sidebarAccentForeground: isDark ? 'oklch(0.985 0 0)' : 'oklch(0.21 0.006 285.885)',
        sidebarBorder: isDark ? 'oklch(0.274 0.006 286.033)' : 'oklch(0.92 0.004 286.32)',
        sidebarRing: isDark ? 'oklch(0.705 0.015 286.067)' : 'oklch(0.705 0.015 286.067)',
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
                    <ColorRow label="Sidebar Background" field="sidebar" value={config.sidebar || 'oklch(0.21 0.006 285.885)'} />
                    <ColorRow label="Sidebar Foreground" field="sidebarForeground" value={config.sidebarForeground || 'oklch(0.985 0 0)'} />
                    <ColorRow label="Sidebar Primary" field="sidebarPrimary" value={config.sidebarPrimary || 'oklch(0.37 0.013 285.805)'} />
                    <ColorRow label="Sidebar Primary Foreground" field="sidebarPrimaryForeground" value={config.sidebarPrimaryForeground || 'oklch(0.985 0 0)'} />
                    <ColorRow label="Sidebar Accent" field="sidebarAccent" value={config.sidebarAccent || 'oklch(0.274 0.006 286.033)'} />
                    <ColorRow label="Sidebar Accent Foreground" field="sidebarAccentForeground" value={config.sidebarAccentForeground || 'oklch(0.985 0 0)'} />
                    <ColorRow label="Sidebar Border" field="sidebarBorder" value={config.sidebarBorder || 'oklch(0.274 0.006 286.033)'} />
                    <ColorRow label="Sidebar Ring" field="sidebarRing" value={config.sidebarRing || 'oklch(0.705 0.015 286.067)'} />
                </CollapsibleSection>

                <CollapsibleSection id="charts" title="Chart Colors">
                    <ColorRow label="Chart 1" field="chart1" value={config.chart1 || 'oklch(0.746 0.16 232.661)'} />
                    <ColorRow label="Chart 2" field="chart2" value={config.chart2 || 'oklch(0.623 0.214 259.135)'} />
                    <ColorRow label="Chart 3" field="chart3" value={config.chart3 || 'oklch(0.546 0.245 262.881)'} />
                    <ColorRow label="Chart 4" field="chart4" value={config.chart4 || 'oklch(0.465 0.241 266.755)'} />
                    <ColorRow label="Chart 5" field="chart5" value={config.chart5 || 'oklch(0.391 0.207 266.975)'} />
                </CollapsibleSection>

                <CollapsibleSection id="base" title="Base Colors">
                    <ColorRow label="Background" field="background" value={config.background || 'oklch(0.141 0.005 285.823)'} />
                    <ColorRow label="Foreground" field="foreground" value={config.foreground || 'oklch(0.985 0 0)'} />
                </CollapsibleSection>

                <CollapsibleSection id="card" title="Card Colors">
                    <ColorRow label="Card Background" field="card" value={config.card || 'oklch(0.141 0.005 285.823)'} />
                    <ColorRow label="Card Foreground" field="cardForeground" value={config.cardForeground || 'oklch(0.985 0 0)'} />
                </CollapsibleSection>

                <CollapsibleSection id="popover" title="Popover Colors">
                    <ColorRow label="Popover Background" field="popover" value={config.popover || 'oklch(0.141 0.005 285.823)'} />
                    <ColorRow label="Popover Foreground" field="popoverForeground" value={config.popoverForeground || 'oklch(0.985 0 0)'} />
                </CollapsibleSection>

                <CollapsibleSection id="muted" title="Muted Colors">
                    <ColorRow label="Muted" field="muted" value={config.muted || 'oklch(0.274 0.006 286.033)'} />
                    <ColorRow label="Muted Foreground" field="mutedForeground" value={config.mutedForeground || 'oklch(0.705 0.015 286.067)'} />
                </CollapsibleSection>

                <CollapsibleSection id="destructive" title="Destructive Colors">
                    <ColorRow label="Destructive" field="destructive" value={config.destructive || 'oklch(0.379 0.146 25.485)'} />
                    <ColorRow label="Destructive Foreground" field="destructiveForeground" value={config.destructiveForeground || 'oklch(0.985 0 0)'} />
                </CollapsibleSection>

                <CollapsibleSection id="borderInput" title="Border & Input Colors">
                    <ColorRow label="Border" field="border" value={config.border || 'oklch(0.274 0.006 286.033)'} />
                    <ColorRow label="Input" field="input" value={config.input || 'oklch(0.274 0.006 286.033)'} />
                    <ColorRow label="Ring" field="ring" value={config.ring || 'oklch(0.705 0.015 286.067)'} />
                </CollapsibleSection>

                <CollapsibleSection id="primary" title="Primary Colors">
                    <ColorRow label="Primary" field="primaryColor" value={config.primaryColor} />
                    <ColorRow label="Primary Foreground" field="primaryForeground" value={config.primaryForeground || 'oklch(0.985 0 0)'} />
                </CollapsibleSection>

                <CollapsibleSection id="secondary" title="Secondary Colors">
                    <ColorRow label="Secondary" field="secondaryColor" value={config.secondaryColor || 'oklch(0.274 0.006 286.033)'} />
                    <ColorRow label="Secondary Foreground" field="secondaryForeground" value={config.secondaryForeground || 'oklch(0.985 0 0)'} />
                </CollapsibleSection>

                <CollapsibleSection id="accent" title="Accent Colors">
                    <ColorRow label="Accent" field="accentColor" value={config.accentColor || 'oklch(0.37 0.013 285.805)'} />
                    <ColorRow label="Accent Foreground" field="accentForeground" value={config.accentForeground || 'oklch(0.985 0 0)'} />
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
