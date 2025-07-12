import styled from '@emotion/styled';

export const SketchbookContainer = styled.div`
  position: relative;
  max-height: 600px;
  background-color: #ffffff;
  border: 1px solid #ccc;
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

export const SketchbookPage = styled.div`
  background-color: ${({ theme }) => theme.colors.yellowWhite};
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-y: hidden;
  border-top: 1px dashed #eee;
`;
