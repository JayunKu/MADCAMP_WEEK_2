import styled from '@emotion/styled';

export const AnswerInput = styled.input`
  width: 200px;
  padding: 12px 16px;
  margin-bottom: 18px;
  font-size: 16px;
  border: 2px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  outline: none;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
  transition: border 0.2s;
  &:focus {
    border-color: ${({ theme }) => theme.colors.darkGray};
  }
`;
