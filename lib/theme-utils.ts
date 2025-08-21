/**
 * Enhanced theme utilities with modern design system
 * Supports glassmorphism, gradients, animations, and dark/light mode
 */

export interface ModernThemeConfig {
  colorScheme: 'violet-blue' | 'emerald-teal' | 'rose-pink' | 'orange-amber' | 'indigo-purple' | 'dark' | 'light';
  fontPair: 'modern' | 'classic' | 'elegant' | 'minimal' | 'creative';
  mode: 'light' | 'dark' | 'system';
  animations: boolean;
  glassmorphism: boolean;
}

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryGradient: string;
  secondary: string;
  secondaryGradient: string;
  accent: string;
  accentLight: string;
  accentBorder: string;
  accentText: string;
  background: string;
  backgroundPattern: string;
  glass: string;
  shadow: string;
  shadowLarge: string;
}

export interface FontPair {
  heading: string;
  body: string;
  mono: string;
}

/**
 * Modern color schemes with gradients and glassmorphism support
 */
export const modernColorSchemes: Record<string, ThemeColors> = {
  'violet-blue': {
    primary: 'from-violet-600 to-blue-600',
    primaryHover: 'from-violet-700 to-blue-700',
    primaryGradient: 'bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600',
    secondary: 'from-violet-50 via-blue-50 to-cyan-50',
    secondaryGradient: 'bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50',
    accent: 'violet-500',
    accentLight: 'violet-50',
    accentBorder: 'violet-300',
    accentText: 'violet-600',
    background: 'bg-gradient-to-br from-violet-50/50 to-blue-50/50',
    backgroundPattern: 'bg-gradient-to-r from-violet-100/20 via-transparent to-blue-100/20',
    glass: 'bg-white/20 backdrop-blur-lg border-white/30',
    shadow: 'shadow-lg shadow-violet-500/10',
    shadowLarge: 'shadow-2xl shadow-violet-500/20'
  },
  'emerald-teal': {
    primary: 'from-emerald-600 to-teal-600',
    primaryHover: 'from-emerald-700 to-teal-700',
    primaryGradient: 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600',
    secondary: 'from-emerald-50 via-teal-50 to-cyan-50',
    secondaryGradient: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50',
    accent: 'emerald-500',
    accentLight: 'emerald-50',
    accentBorder: 'emerald-300',
    accentText: 'emerald-600',
    background: 'bg-gradient-to-br from-emerald-50/50 to-teal-50/50',
    backgroundPattern: 'bg-gradient-to-r from-emerald-100/20 via-transparent to-teal-100/20',
    glass: 'bg-white/20 backdrop-blur-lg border-white/30',
    shadow: 'shadow-lg shadow-emerald-500/10',
    shadowLarge: 'shadow-2xl shadow-emerald-500/20'
  },
  'rose-pink': {
    primary: 'from-rose-600 to-pink-600',
    primaryHover: 'from-rose-700 to-pink-700',
    primaryGradient: 'bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600',
    secondary: 'from-rose-50 via-pink-50 to-fuchsia-50',
    secondaryGradient: 'bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50',
    accent: 'rose-500',
    accentLight: 'rose-50',
    accentBorder: 'rose-300',
    accentText: 'rose-600',
    background: 'bg-gradient-to-br from-rose-50/50 to-pink-50/50',
    backgroundPattern: 'bg-gradient-to-r from-rose-100/20 via-transparent to-pink-100/20',
    glass: 'bg-white/20 backdrop-blur-lg border-white/30',
    shadow: 'shadow-lg shadow-rose-500/10',
    shadowLarge: 'shadow-2xl shadow-rose-500/20'
  },
  'orange-amber': {
    primary: 'from-orange-600 to-amber-600',
    primaryHover: 'from-orange-700 to-amber-700',
    primaryGradient: 'bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600',
    secondary: 'from-orange-50 via-amber-50 to-yellow-50',
    secondaryGradient: 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50',
    accent: 'orange-500',
    accentLight: 'orange-50',
    accentBorder: 'orange-300',
    accentText: 'orange-600',
    background: 'bg-gradient-to-br from-orange-50/50 to-amber-50/50',
    backgroundPattern: 'bg-gradient-to-r from-orange-100/20 via-transparent to-amber-100/20',
    glass: 'bg-white/20 backdrop-blur-lg border-white/30',
    shadow: 'shadow-lg shadow-orange-500/10',
    shadowLarge: 'shadow-2xl shadow-orange-500/20'
  },
  'indigo-purple': {
    primary: 'from-indigo-600 to-purple-600',
    primaryHover: 'from-indigo-700 to-purple-700',
    primaryGradient: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600',
    secondary: 'from-indigo-50 via-purple-50 to-violet-50',
    secondaryGradient: 'bg-gradient-to-br from-indigo-50 via-purple-50 to-violet-50',
    accent: 'indigo-500',
    accentLight: 'indigo-50',
    accentBorder: 'indigo-300',
    accentText: 'indigo-600',
    background: 'bg-gradient-to-br from-indigo-50/50 to-purple-50/50',
    backgroundPattern: 'bg-gradient-to-r from-indigo-100/20 via-transparent to-purple-100/20',
    glass: 'bg-white/20 backdrop-blur-lg border-white/30',
    shadow: 'shadow-lg shadow-indigo-500/10',
    shadowLarge: 'shadow-2xl shadow-indigo-500/20'
  }
};

/**
 * Enhanced font pairings with modern typography
 */
export const enhancedFontPairs: Record<string, FontPair> = {
  modern: {
    heading: 'font-inter font-bold tracking-tight',
    body: 'font-inter font-normal',
    mono: 'font-mono'
  },
  classic: {
    heading: 'font-playfair font-bold tracking-tight',
    body: 'font-opensans font-normal',
    mono: 'font-mono'
  },
  elegant: {
    heading: 'font-crimson font-bold tracking-tight',
    body: 'font-opensans font-normal',
    mono: 'font-mono'
  },
  minimal: {
    heading: 'font-spacegrotesk font-bold tracking-tight',
    body: 'font-spacegrotesk font-normal',
    mono: 'font-mono'
  },
  creative: {
    heading: 'font-poppins font-bold tracking-tight',
    body: 'font-nunito font-normal',
    mono: 'font-mono'
  }
};

/**
 * Get theme classes for a given theme configuration
 */
export function getThemeClasses(theme: ModernThemeConfig): ThemeColors & FontPair {
  const colors = modernColorSchemes[theme.colorScheme];
  const fonts = enhancedFontPairs[theme.fontPair];
  
  return {
    ...colors,
    ...fonts
  };
}

/**
 * Generate CSS custom properties for theme
 */
export function generateThemeCSS(theme: ModernThemeConfig): Record<string, string> {
  const classes = getThemeClasses(theme);
  
  return {
    '--theme-primary': classes.primary,
    '--theme-primary-hover': classes.primaryHover,
    '--theme-accent': classes.accent,
    '--theme-accent-text': classes.accentText,
    '--theme-background': classes.background,
    '--theme-glass': classes.glass,
    '--theme-shadow': classes.shadow
  };
}

/**
 * Detect system theme preference
 */
export function detectSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: ModernThemeConfig): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  const themeCSS = generateThemeCSS(theme);
  
  // Apply CSS custom properties
  Object.entries(themeCSS).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
  
  // Apply theme classes
  const themeClass = theme.mode === 'system' ? detectSystemTheme() : theme.mode;
  root.classList.remove('light', 'dark');
  root.classList.add(themeClass);
  
  // Apply animation preference
  if (!theme.animations) {
    root.classList.add('reduce-motion');
  } else {
    root.classList.remove('reduce-motion');
  }
}

/**
 * Save theme to localStorage
 */
export function saveTheme(theme: ModernThemeConfig): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('invoice-theme', JSON.stringify(theme));
}

/**
 * Load theme from localStorage
 */
export function loadTheme(): ModernThemeConfig {
  if (typeof localStorage === 'undefined') {
    return getDefaultTheme();
  }
  
  try {
    const saved = localStorage.getItem('invoice-theme');
    if (saved) {
      return { ...getDefaultTheme(), ...JSON.parse(saved) };
    }
  } catch (error) {
    console.warn('Failed to load theme from localStorage:', error);
  }
  
  return getDefaultTheme();
}

/**
 * Get default theme configuration
 */
export function getDefaultTheme(): ModernThemeConfig {
  return {
    colorScheme: 'violet-blue',
    fontPair: 'modern',
    mode: 'system',
    animations: true,
    glassmorphism: true
  };
}

/**
 * Generate animation classes based on preference
 */
export function getAnimationClasses(enabled: boolean): string {
  if (!enabled) return '';
  return 'transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]';
}

/**
 * Generate glassmorphism classes
 */
export function getGlassmorphismClasses(enabled: boolean, variant: 'light' | 'medium' | 'heavy' = 'medium'): string {
  if (!enabled) return 'bg-white border border-gray-200';
  
  const variants = {
    light: 'bg-white/10 backdrop-blur-sm border border-white/20',
    medium: 'bg-white/20 backdrop-blur-md border border-white/30',
    heavy: 'bg-white/30 backdrop-blur-lg border border-white/40'
  };
  
  return variants[variant];
}

/**
 * Generate responsive classes for modern layouts
 */
export function getResponsiveClasses(): string {
  return 'grid grid-cols-1 gap-6 lg:grid-cols-2 xl:gap-8';
}

/**
 * Generate shadow classes with theme awareness
 */
export function getShadowClasses(theme: ModernThemeConfig, size: 'sm' | 'md' | 'lg' | 'xl' = 'md'): string {
  const colors = modernColorSchemes[theme.colorScheme];
  
  const sizes = {
    sm: colors.shadow.replace('shadow-lg', 'shadow-sm'),
    md: colors.shadow,
    lg: colors.shadowLarge.replace('shadow-2xl', 'shadow-xl'),
    xl: colors.shadowLarge
  };
  
  return sizes[size];
}