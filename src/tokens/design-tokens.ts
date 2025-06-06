
export interface ColorTokens {
  primary: string;
  'primary-foreground': string;
  secondary: string;
  'secondary-foreground': string;
  destructive: string;
  'destructive-foreground': string;
  muted: string;
  'muted-foreground': string;
  accent: string;
  'accent-foreground': string;
  popover: string;
  'popover-foreground': string;
  card: string;
  'card-foreground': string;
  border: string;
  input: string;
  ring: string;
  background: string;
  foreground: string;
}

export interface SpacingTokens {
  px: string;
  0: string;
  0.5: string;
  1: string;
  1.5: string;
  2: string;
  2.5: string;
  3: string;
  3.5: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
  14: string;
  16: string;
  20: string;
  24: string;
  28: string;
  32: string;
  36: string;
  40: string;
  44: string;
  48: string;
  52: string;
  56: string;
  60: string;
  64: string;
  72: string;
  80: string;
  96: string;
}

export interface TypographyTokens {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
  '7xl': string;
  '8xl': string;
  '9xl': string;
}

export interface RadiusTokens {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

export interface ShadowTokens {
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  none: string;
}

export interface AnimationTokens {
  fast: string;
  normal: string;
  slow: string;
  'very-slow': string;
}

export interface DesignTokens {
  colors: {
    light: ColorTokens;
    dark: ColorTokens;
  };
  spacing: SpacingTokens;
  typography: TypographyTokens;
  radius: RadiusTokens;
  shadows: ShadowTokens;
  animation: AnimationTokens;
}

export const designTokens: DesignTokens = {
  colors: {
    light: {
      primary: '213 100% 54%',
      'primary-foreground': '210 40% 98%',
      secondary: '210 40% 96%',
      'secondary-foreground': '222.2 84% 4.9%',
      destructive: '0 62% 30%',
      'destructive-foreground': '210 40% 98%',
      muted: '210 40% 96%',
      'muted-foreground': '215.4 16.3% 46.9%',
      accent: '210 40% 96%',
      'accent-foreground': '222.2 84% 4.9%',
      popover: '0 0% 100%',
      'popover-foreground': '222.2 84% 4.9%',
      card: '0 0% 100%',
      'card-foreground': '222.2 84% 4.9%',
      border: '214.3 31.8% 91.4%',
      input: '214.3 31.8% 91.4%',
      ring: '213 100% 54%',
      background: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
    },
    dark: {
      primary: '213 100% 54%',
      'primary-foreground': '210 40% 98%',
      secondary: '217 32% 17%',
      'secondary-foreground': '210 40% 98%',
      destructive: '0 62% 30%',
      'destructive-foreground': '210 40% 98%',
      muted: '217 32% 8%',
      'muted-foreground': '215 20% 65%',
      accent: '217 32% 17%',
      'accent-foreground': '210 40% 98%',
      popover: '5 20% 4%',
      'popover-foreground': '210 40% 98%',
      card: '5 20% 4%',
      'card-foreground': '210 40% 98%',
      border: '217 32% 15%',
      input: '217 32% 15%',
      ring: '213 100% 54%',
      background: '5 20% 3%',
      foreground: '210 40% 98%',
    },
  },
  spacing: {
    px: '1px',
    0: '0px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },
  typography: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
    '9xl': '8rem',
  },
  radius: {
    none: '0px',
    sm: 'calc(var(--radius) - 4px)',
    md: 'calc(var(--radius) - 2px)',
    lg: 'var(--radius)',
    xl: 'calc(var(--radius) + 2px)',
    '2xl': 'calc(var(--radius) + 4px)',
    '3xl': 'calc(var(--radius) + 8px)',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: '0 0 #0000',
  },
  animation: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    'very-slow': '500ms',
  },
};

// Theme variations
export const themeVariations = {
  blue: {
    primary: '213 100% 54%',
    ring: '213 100% 54%',
  },
  green: {
    primary: '142 76% 36%',
    ring: '142 76% 36%',
  },
  purple: {
    primary: '262 83% 58%',
    ring: '262 83% 58%',
  },
  orange: {
    primary: '25 95% 53%',
    ring: '25 95% 53%',
  },
  red: {
    primary: '0 72% 51%',
    ring: '0 72% 51%',
  },
};

export type ThemeVariation = keyof typeof themeVariations;
