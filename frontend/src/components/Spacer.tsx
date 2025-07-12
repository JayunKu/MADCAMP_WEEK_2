import React from 'react';
import styled from '@emotion/styled';

interface SpacerProps {
  x?: number | string; // 가로 간격(px, rem, % 등)
  y?: number | string; // 세로 간격(px, rem, % 등)
}

const SpacerBox = styled.div<SpacerProps>`
  width: ${({ x }) =>
    x !== undefined ? (typeof x === 'number' ? `${x}px` : x) : '0'};
  height: ${({ y }) =>
    y !== undefined ? (typeof y === 'number' ? `${y}px` : y) : '0'};
  flex-shrink: 0;
`;

export const Spacer: React.FC<SpacerProps> = ({ x, y }) => (
  <SpacerBox x={x} y={y} />
);

// 사용 예시:
// <Spacer y={20} /> // 세로 20px 공백
// <Spacer x={16} /> // 가로 16px 공백
// <Spacer x={8} y={8} /> // 가로세로 모두 공백
