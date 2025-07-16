import { FullScreenPopup } from './FullScreenPopup';
import modeAbstract from '../assets/images/mode-abstract.png';
import { useTheme } from '@emotion/react';
import { SmallButton } from './Button';
import { Spacer } from './Spacer';

interface ModeInfoPopupProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const ModeInfoPopup = ({ open, setOpen }: ModeInfoPopupProps) => {
  const theme = useTheme();

  return (
    <FullScreenPopup open={open} onClose={() => setOpen(false)}>
      <div style={{ width: '400px', textAlign: 'center' }}>
        <img
          src={modeAbstract}
          alt="Mode Abstract"
          style={{
            width: '100%',
            borderRadius: theme.borderRadius.default,
            boxShadow: theme.shadows.default,
          }}
        />
        <Spacer y={5} />
        <SmallButton
          backgroundColor={theme.colors.lightYellow}
          onClick={() => setOpen(false)}
        >
          닫기
        </SmallButton>
      </div>
    </FullScreenPopup>
  );
};
