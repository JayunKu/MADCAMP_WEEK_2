import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { createPortal } from 'react-dom';

interface FullScreenPopupProps {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  contentColor?: string;
  layOutColor?: string;
}

const Overlay = styled.div<{ visible: boolean; backgroundColor?: string }>`
  display: flex;
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ backgroundColor }) => backgroundColor || 'rgba(0,0,0,0.5)'};
  align-items: center;
  justify-content: center;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
  transition: opacity 0.1s ease-out;
`;

const PopupContent = styled.div<{ visible: boolean; backgroundColor?: string }>`
  background: ${({ backgroundColor }) => backgroundColor || '#fff'};
  border-radius: ${({ theme }) => theme?.borderRadius?.default || '16px'};
  box-shadow: ${({ theme }) =>
    theme?.shadows?.default || '0 2px 16px rgba(0,0,0,0.15)'};
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.1s ease-out;
`;

export const FullScreenPopup: React.FC<FullScreenPopupProps> = ({
  open,
  onClose,
  children,
  contentColor,
  layOutColor,
}) => {
  // 애니메이션 후 언마운트
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) setVisible(true);
    else {
      const timeout = setTimeout(() => setVisible(false), 100);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  return createPortal(
    <Overlay
      visible={open || visible}
      backgroundColor={layOutColor}
      onClick={onClose}
    >
      <PopupContent
        visible={open}
        onClick={e => e.stopPropagation()}
        backgroundColor={contentColor}
        style={{ display: visible ? 'flex' : 'none' }}
      >
        {children}
      </PopupContent>
    </Overlay>,
    document.body
  );
};
