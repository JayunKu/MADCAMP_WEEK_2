import React, { useImperativeHandle, forwardRef } from 'react';
import {
  SketchbookContainer,
  SketchbookBinding,
  SketchbookRing,
  SketchbookPage,
  SketchbookPageWrapper,
} from './Sketchbook.styles';

export type SketchbookHandle = {
  flip: () => void;
};

interface SketchbookProps {
  children: React.ReactNode;
  flipping: boolean;
  show: boolean;
  height?: string;
  width?: string;
  ringCount: number;
  onClick?: () => void;
}

export const Sketchbook = forwardRef<SketchbookHandle, SketchbookProps>(
  ({ children, flipping, show, height, width, ringCount, onClick }, ref) => {
    useImperativeHandle(ref, () => ({
      flip: () => {}, // flip 동작은 부모에서 flipping 상태로 관리
    }));

    const rings = Array.from({ length: ringCount }, (_, i) => (
      <SketchbookRing key={i} />
    ));

    return (
      <SketchbookContainer
        show={show}
        height={height}
        width={width}
        onClick={onClick}
      >
        <SketchbookBinding>{rings}</SketchbookBinding>
        <SketchbookPageWrapper>
          <SketchbookPage flipping={flipping}>{children}</SketchbookPage>
        </SketchbookPageWrapper>
      </SketchbookContainer>
    );
  }
);
