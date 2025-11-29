
import { ThemeConfig } from '../types';

// Full Tailwind CSS Palette Map (OKLCH)
export const TAILWIND_PALETTE: Record<string, Record<string, string>> = {
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

export const DEFAULT_DARK_THEME: ThemeConfig = {
  primaryColor: 'oklch(0.922 0 0)',
  primaryForeground: 'oklch(0.205 0 0)',
  secondaryColor: 'oklch(0.269 0 0)',
  secondaryForeground: 'oklch(0.985 0 0)',
  accentColor: 'oklch(0.371 0 0)',
  accentForeground: 'oklch(0.985 0 0)',
  background: 'oklch(0.145 0 0)',
  foreground: 'oklch(0.985 0 0)',
  card: 'oklch(0.205 0 0)',
  cardForeground: 'oklch(0.985 0 0)',
  popover: 'oklch(0.269 0 0)',
  popoverForeground: 'oklch(0.985 0 0)',
  muted: 'oklch(0.269 0 0)',
  mutedForeground: 'oklch(0.708 0 0)',
  destructive: 'oklch(0.704 0.191 22.216)',
  destructiveForeground: 'oklch(0.985 0 0)',
  border: 'oklch(0.275 0 0)',
  input: 'oklch(0.325 0 0)',
  ring: 'oklch(0.556 0 0)',
  chart1: 'oklch(0.81 0.10 252)',
  chart2: 'oklch(0.62 0.19 260)',
  chart3: 'oklch(0.55 0.22 263)',
  chart4: 'oklch(0.49 0.22 264)',
  chart5: 'oklch(0.42 0.18 266)',
  sidebar: 'oklch(0.205 0 0)',
  sidebarForeground: 'oklch(0.985 0 0)',
  sidebarPrimary: 'oklch(0.488 0.243 264.376)',
  sidebarPrimaryForeground: 'oklch(0.985 0 0)',
  sidebarAccent: 'oklch(0.269 0 0)',
  sidebarAccentForeground: 'oklch(0.985 0 0)',
  sidebarBorder: 'oklch(0.275 0 0)',
  sidebarRing: 'oklch(0.439 0 0)',
  radius: 2,
  mode: 'dark',
  style: 'default',
  viewport: 'responsive'
};

export const DEFAULT_LIGHT_THEME: ThemeConfig = {
    ...DEFAULT_DARK_THEME,
    mode: 'light',
  primaryColor: 'oklch(0.205 0 0)',
  primaryForeground: 'oklch(0.985 0 0)',
  secondaryColor: 'oklch(0.97 0 0)',
  secondaryForeground: 'oklch(0.205 0 0)',
  accentColor: 'oklch(0.97 0 0)',
  accentForeground: 'oklch(0.205 0 0)',
  background: 'oklch(1 0 0)',
  foreground: 'oklch(0.145 0 0)',
  card: 'oklch(1 0 0)',
  cardForeground: 'oklch(0.145 0 0)',
  popover: 'oklch(1 0 0)',
  popoverForeground: 'oklch(0.145 0 0)',
  muted: 'oklch(0.97 0 0)',
  mutedForeground: 'oklch(0.556 0 0)',
  destructive: 'oklch(0.577 0.245 27.325)',
  destructiveForeground: 'oklch(1 0 0)',
  border: 'oklch(0.922 0 0)',
  input: 'oklch(0.922 0 0)',
  ring: 'oklch(0.708 0 0)',
  chart1: 'oklch(0.81 0.10 252)',
  chart2: 'oklch(0.62 0.19 260)',
  chart3: 'oklch(0.55 0.22 263)',
  chart4: 'oklch(0.49 0.22 264)',
  chart5: 'oklch(0.42 0.18 266)',
  sidebar: 'oklch(0.985 0 0)',
  sidebarForeground: 'oklch(0.145 0 0)',
  sidebarPrimary: 'oklch(0.205 0 0)',
  sidebarPrimaryForeground: 'oklch(0.985 0 0)',
  sidebarAccent: 'oklch(0.97 0 0)',
  sidebarAccentForeground: 'oklch(0.205 0 0)',
  sidebarBorder: 'oklch(0.922 0 0)',
  sidebarRing: 'oklch(0.708 0 0)',
};

export const applyThemeToDocument = (theme: ThemeConfig) => {
    const root = document.documentElement;
    const set = (k: string, v?: string) => { if (v) root.style.setProperty(k, v); };

    set('--background', theme.background);
    set('--foreground', theme.foreground);
    set('--card', theme.card);
    set('--card-foreground', theme.cardForeground);
    set('--popover', theme.popover);
    set('--popover-foreground', theme.popoverForeground);
    set('--primary', theme.primaryColor);
    set('--primary-foreground', theme.primaryForeground);
    set('--secondary', theme.secondaryColor);
    set('--secondary-foreground', theme.secondaryForeground);
    set('--muted', theme.muted);
    set('--muted-foreground', theme.mutedForeground);
    set('--accent', theme.accentColor);
    set('--accent-foreground', theme.accentForeground);
    set('--destructive', theme.destructive);
    set('--destructive-foreground', theme.destructiveForeground);
    set('--border', theme.border);
    set('--input', theme.input);
    set('--ring', theme.ring);
    set('--radius', `${theme.radius}rem`);

    set('--chart-1', theme.chart1);
    set('--chart-2', theme.chart2);
    set('--chart-3', theme.chart3);
    set('--chart-4', theme.chart4);
    set('--chart-5', theme.chart5);

    set('--sidebar', theme.sidebar);
    set('--sidebar-foreground', theme.sidebarForeground);
    set('--sidebar-primary', theme.sidebarPrimary);
    set('--sidebar-primary-foreground', theme.sidebarPrimaryForeground);
    set('--sidebar-accent', theme.sidebarAccent);
    set('--sidebar-accent-foreground', theme.sidebarAccentForeground);
    set('--sidebar-border', theme.sidebarBorder);
    set('--sidebar-ring', theme.sidebarRing);

    if (theme.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
};

export const generateCssVariables = (theme: ThemeConfig): string => {
    const vars = [
        `--background: ${theme.background || 'oklch(0.145 0 0)'};`,
        `--foreground: ${theme.foreground || 'oklch(0.985 0 0)'};`,
        `--card: ${theme.card || 'oklch(0.205 0 0)'};`,
        `--card-foreground: ${theme.cardForeground || 'oklch(0.985 0 0)'};`,
        `--popover: ${theme.popover || 'oklch(0.269 0 0)'};`,
        `--popover-foreground: ${theme.popoverForeground || 'oklch(0.985 0 0)'};`,
        `--primary: ${theme.primaryColor};`,
        `--primary-foreground: ${theme.primaryForeground || 'oklch(0.205 0 0)'};`,
        `--secondary: ${theme.secondaryColor || 'oklch(0.269 0 0)'};`,
        `--secondary-foreground: ${theme.secondaryForeground || 'oklch(0.985 0 0)'};`,
        `--muted: ${theme.muted || 'oklch(0.269 0 0)'};`,
        `--muted-foreground: ${theme.mutedForeground || 'oklch(0.708 0 0)'};`,
        `--accent: ${theme.accentColor || 'oklch(0.371 0 0)'};`,
        `--accent-foreground: ${theme.accentForeground || 'oklch(0.985 0 0)'};`,
        `--destructive: ${theme.destructive || 'oklch(0.704 0.191 22.216)'};`,
        `--destructive-foreground: ${theme.destructiveForeground || 'oklch(0.985 0 0)'};`,
        `--border: ${theme.border || 'oklch(0.275 0 0)'};`,
        `--input: ${theme.input || 'oklch(0.325 0 0)'};`,
        `--ring: ${theme.ring || 'oklch(0.556 0 0)'};`,
        `--chart-1: ${theme.chart1 || 'oklch(0.81 0.10 252)'};`,
        `--chart-2: ${theme.chart2 || 'oklch(0.62 0.19 260)'};`,
        `--chart-3: ${theme.chart3 || 'oklch(0.55 0.22 263)'};`,
        `--chart-4: ${theme.chart4 || 'oklch(0.49 0.22 264)'};`,
        `--chart-5: ${theme.chart5 || 'oklch(0.42 0.18 266)'};`,
        `--sidebar: ${theme.sidebar || 'oklch(0.205 0 0)'};`,
        `--sidebar-foreground: ${theme.sidebarForeground || 'oklch(0.985 0 0)'};`,
        `--sidebar-primary: ${theme.sidebarPrimary || 'oklch(0.488 0.243 264.376)'};`,
        `--sidebar-primary-foreground: ${theme.sidebarPrimaryForeground || 'oklch(0.985 0 0)'};`,
        `--sidebar-accent: ${theme.sidebarAccent || 'oklch(0.269 0 0)'};`,
        `--sidebar-accent-foreground: ${theme.sidebarAccentForeground || 'oklch(0.985 0 0)'};`,
        `--sidebar-border: ${theme.sidebarBorder || 'oklch(0.275 0 0)'};`,
        `--sidebar-ring: ${theme.sidebarRing || 'oklch(0.439 0 0)'};`,
        `--font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';`,
        `--font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;`,
        `--font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;`,
        `--radius: ${theme.radius}rem;`
    ];

    const cssContent = `
:root {
  ${vars.join('\n  ')}
}

.dark {
  ${vars.join('\n  ')}
}
`;
    return `[CSS_VARS]${cssContent}[/CSS_VARS]`;
};
