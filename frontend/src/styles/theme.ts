export const theme = {
  colors: {
    white: '#FFFFFF',
    yellowWhite: '#FFFEFA',
    yellow: '#FFC349',
    lightYellow: '#FFEC70',
    lighterYellow: '#FFF5B5',
    orange: '#FFC349',
    black: '#000000',
    gray: '#B3B3B3',
    darkGray: '#666666',
    lightGray: '#F5F5F5',
    lightRed: '#FFD9CE',
  },
  shadows: {
    default: '0 2px 2px rgba(0, 0, 0, 0.25)',
    defaultUp: '0 -2px 2px rgba(0, 0, 0, 0.25)',
  },
  borderRadius: {
    default: '10px',
  },
} as const;

export type Theme = typeof theme;
