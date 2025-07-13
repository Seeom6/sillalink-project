// Enhanced Design System for Silla Link Portfolio
export const theme = {
  colors: {
    // Primary brand colors
    primary: {
      50: '#f3f1ff',
      100: '#ebe5ff',
      200: '#d9ceff',
      300: '#bea6ff',
      400: '#9f75ff',
      500: '#843dff',
      600: '#7916ff',
      700: '#6b04fd',
      800: '#5a03d4',
      900: '#4b05ad',
      950: '#2c0076',
    },
    
    // Dark theme colors
    dark: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
    
    // Indigo dark (existing)
    indego: {
      dark: '#0f0f23',
      darker: '#0a0a1a',
      light: '#1a1a2e',
    },
    
    // Accent colors
    accent: {
      purple: '#8b5cf6',
      blue: '#3b82f6',
      cyan: '#06b6d4',
      emerald: '#10b981',
      amber: '#f59e0b',
      rose: '#f43f5e',
    },
    
    // Semantic colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  gradients: {
    primary: 'linear-gradient(135deg, #7916ff 0%, #843dff 50%, #9f75ff 100%)',
    secondary: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
    accent: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
    glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    dark: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #0f172a 100%)',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glow: '0 0 20px rgba(121, 22, 255, 0.3)',
    glowLg: '0 0 40px rgba(121, 22, 255, 0.2)',
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
  
  blur: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
  },
  
  spacing: {
    section: '6rem',
    sectionSm: '4rem',
    container: '1.5rem',
  },
  
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    full: '9999px',
  },
  
  typography: {
    fontFamily: {
      sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      display: ['var(--font-inspiration)', 'cursive'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
  },
  
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '750ms',
      slowest: '1000ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
  },
} as const;

export type Theme = typeof theme;
