import { ThemeConfig } from '../types';

export const TAILWIND_PALETTE: Record<string, Record<string, string>> = {
  Slate: { 50: 'oklch(0.984 0.003 247.858)', 100: 'oklch(0.968 0.007 247.896)', 500: 'oklch(0.554 0.046 257.417)', 900: 'oklch(0.208 0.042 265.755)' },
  Zinc: { 50: 'oklch(0.985 0 0)', 100: 'oklch(0.967 0.001 286.375)', 500: 'oklch(0.552 0.016 285.938)', 900: 'oklch(0.21 0.006 285.885)' },
  Blue: { 50: 'oklch(0.97 0.014 254.604)', 500: 'oklch(0.623 0.214 259.135)', 900: 'oklch(0.333 0.17 266.732)' },
  Emerald: { 50: 'oklch(0.979 0.021 166.113)', 500: 'oklch(0.696 0.17 162.48)', 900: 'oklch(0.378 0.077 168.94)' },
  Red: { 50: 'oklch(0.971 0.013 17.38)', 500: 'oklch(0.637 0.237 25.331)', 900: 'oklch(0.379 0.146 25.485)' }
};

// Map ThemeConfig properties to CSS Variable names
const THEME_TO_CSS_MAP: Partial<Record<keyof ThemeConfig, string>> = {
  background: '--background',
  foreground: '--foreground',
  card: '--card',
  cardForeground: '--card-foreground',
  popover: '--popover',
  popoverForeground: '--popover-foreground',
  primaryColor: '--primary',
  primaryForeground: '--primary-foreground',
  secondaryColor: '--secondary',
  secondaryForeground: '--secondary-foreground',
  muted: '--muted',
  mutedForeground: '--muted-foreground',
  accentColor: '--accent',
  accentForeground: '--accent-foreground',
  destructive: '--destructive',
  destructiveForeground: '--destructive-foreground',
  border: '--border',
  input: '--input',
  ring: '--ring',
  radius: '--radius',
  spacing: '--spacing',
  fontSans: '--font-sans',
  fontSerif: '--font-serif',
  fontMono: '--font-mono',
  letterSpacing: '--tracking-normal',
  sidebar: '--sidebar',
  sidebarForeground: '--sidebar-foreground',
  sidebarPrimary: '--sidebar-primary',
  sidebarPrimaryForeground: '--sidebar-primary-foreground',
  sidebarAccent: '--sidebar-accent',
  sidebarAccentForeground: '--sidebar-accent-foreground',
  sidebarBorder: '--sidebar-border',
  sidebarRing: '--sidebar-ring',
  chart1: '--chart-1',
  chart2: '--chart-2',
  chart3: '--chart-3',
  chart4: '--chart-4',
  chart5: '--chart-5'
};

const getThemeVariables = (theme: ThemeConfig): Record<string, string> => {
  const vars: Record<string, string> = {};
  
  Object.entries(THEME_TO_CSS_MAP).forEach(([configKey, cssVar]) => {
    let value = (theme as any)[configKey];
    if (configKey === 'radius' || configKey === 'spacing') value = `${value}rem`;
    if (configKey === 'letterSpacing') value = `${value}em`;
    if (value !== undefined) vars[cssVar] = value;
  });

  // Add shadow variables
  vars['--shadow-color'] = theme.shadowColor;
  vars['--shadow-opacity'] = theme.shadowOpacity.toString();
  vars['--shadow-params'] = `${theme.shadowX}px ${theme.shadowY}px ${theme.shadowBlur}px ${theme.shadowSpread}px`;
  
  return vars;
};

export const applyThemeToDocument = (theme: ThemeConfig) => {
  const root = document.documentElement;
  const vars = getThemeVariables(theme);
  
  Object.entries(vars).forEach(([key, val]) => {
    root.style.setProperty(key, val);
  });

  if (theme.mode === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
};

export const generateCssVariables = (theme: ThemeConfig): string => {
  const vars = getThemeVariables(theme);
  const lines = Object.entries(vars).map(([key, val]) => `  ${key}: ${val};`);
  return `:root {\n${lines.join('\n')}\n}`;
};

export const DEFAULT_DARK_THEME: ThemeConfig = {
  primaryColor: 'oklch(0.922 0 0)',
  primaryForeground: 'oklch(0.205 0 0)',
  secondaryColor: 'oklch(0.269 0 0)',
  secondaryForeground: 'oklch(0.985 0 0)',
  background: 'oklch(0.145 0 0)',
  foreground: 'oklch(0.985 0 0)',
  card: 'oklch(0.205 0 0)',
  cardForeground: 'oklch(0.985 0 0)',
  muted: 'oklch(0.269 0 0)',
  mutedForeground: 'oklch(0.708 0 0)',
  border: 'oklch(0.275 0 0)',
  input: 'oklch(0.325 0 0)',
  ring: 'oklch(0.556 0 0)',
  destructive: 'oklch(0.637 0.237 25.331)',
  destructiveForeground: 'oklch(0.985 0 0)',
  sidebar: 'oklch(0.145 0 0)',
  sidebarForeground: 'oklch(0.985 0 0)',
  sidebarPrimary: 'oklch(0.922 0 0)',
  sidebarPrimaryForeground: 'oklch(0.205 0 0)',
  sidebarAccent: 'oklch(0.269 0 0)',
  sidebarAccentForeground: 'oklch(0.985 0 0)',
  sidebarBorder: 'oklch(0.275 0 0)',
  sidebarRing: 'oklch(0.556 0 0)',
  chart1: 'oklch(0.623 0.214 259.135)',
  chart2: 'oklch(0.696 0.17 162.48)',
  chart3: 'oklch(0.769 0.188 70.08)',
  chart4: 'oklch(0.637 0.237 25.331)',
  chart5: 'oklch(0.629 0.224 291.569)',
  radius: 0.625,
  spacing: 0.25,
  shadowColor: 'oklch(0 0 0)',
  shadowOpacity: 0.2,
  shadowX: 0,
  shadowY: 4,
  shadowBlur: 10,
  shadowSpread: -2,
  mode: 'dark',
  style: 'default',
  viewport: 'responsive',
  fontSans: 'Rajdhani, sans-serif',
  fontSerif: 'serif',
  fontMono: 'JetBrains Mono, monospace',
  letterSpacing: 0
};

export const DEFAULT_LIGHT_THEME: ThemeConfig = {
  ...DEFAULT_DARK_THEME,
  mode: 'light',
  primaryColor: 'oklch(0.205 0 0)',
  primaryForeground: 'oklch(0.985 0 0)',
  background: 'oklch(1 0 0)',
  foreground: 'oklch(0.145 0 0)',
  card: 'oklch(1 0 0)',
  cardForeground: 'oklch(0.145 0 0)',
  muted: 'oklch(0.97 0 0)',
  mutedForeground: 'oklch(0.556 0 0)',
  border: 'oklch(0.922 0 0)',
  sidebar: 'oklch(0.985 0 0)',
  sidebarForeground: 'oklch(0.145 0 0)'
};