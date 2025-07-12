import { ThemeProvider } from '@emotion/react';
import { theme } from './theme';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      white: string;
      yellowWhite: string;
      yellow: string;
      lightYellow: string;
      lighterYellow: string;
      orange: string;
      black: string;
      gray: string;
      darkGray: string;
      lightGray: string;
    };
    shadows: {
      default: string;
      defaultUp: string;
    };
    borderRadius: {
      default: string;
    };
  }
}

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
