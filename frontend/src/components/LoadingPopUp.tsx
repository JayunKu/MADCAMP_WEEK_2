import spinnerImage from '../assets/images/spinner.svg';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';

interface LoadingPopUpProps {
  open: boolean;
  onClose?: () => void;
}

const Overlay = styled.div<{ visible: boolean }>`
  display: flex;
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  align-items: center;
  justify-content: center;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
  transition: opacity 0.1s ease-out;
`;

export const LoadingPopUp = ({ open, onClose }: LoadingPopUpProps) => {
  const theme = useTheme();

  // 애니메이션 후 언마운트
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) setVisible(true);
    else {
      const timeout = setTimeout(() => setVisible(false), 100);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  return (
    <Overlay visible={open || visible} onClick={onClose}>
      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            color: theme.colors.darkGray,
            fontSize: '24px',
          }}
        >
          로딩 중
        </p>

        <img
          src={spinnerImage}
          alt="Generated"
          style={{
            width: '50px',
            height: '50px',
          }}
        />
      </div>
    </Overlay>
  );
};
