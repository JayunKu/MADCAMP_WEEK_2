import styled from '@emotion/styled';

export const SketchbookContainer = styled.div`
  position: relative;
  height: 600px;
  background-color: #ffffff;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  display: flex;
  flex-direction: column;
  margin: 20px auto;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.default};
`;

export const SketchbookBinding = styled.div`
  width: 100%;
  height: 50px;
  background-color: #e0e0e0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 10px 0;
  border-bottom: 1px solid #bbb;
`;

export const SketchbookRing = styled.div`
  width: 20px;
  height: 20px;
  background-color: #999;
  border-radius: 50%;
  border: 1px solid #777;
`;

export const SketchbookPageWrapper = styled.div`
  width: 100%;
  height: 100%;
  perspective: 1200px;
  display: flex;
  flex: 1 1 0;
`;

export const SketchbookPage = styled.div<{ flipping?: boolean }>`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.yellowWhite};
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-y: hidden;
  border-top: 1px dashed #eee;
  transition: transform 0.7s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.7s;
  transform-origin: top center;
  ${({ flipping }) =>
    flipping &&
    `
      transform: rotateX(180deg);
      opacity: 0;
    `}
`;
