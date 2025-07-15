import { useTheme } from '@emotion/react';

interface BlackSketchbookProps {
  children?: React.ReactNode;
}

export const BlackSketchbook = ({ children }: BlackSketchbookProps) => {
  const theme = useTheme();

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#D5D5D5',
        gap: '30px',
      }}
    >
      {children}
    </div>
  );
};
