import styled from '@emotion/styled';
import { GoogleLogin } from '@react-oauth/google';

export const GoogleLoginButton = styled(GoogleLogin)`
  // border-radius: ${({ theme }) => theme.borderRadius.default};
  // box-shadow: ${({ theme }) => theme.shadows.default};
  // border: 2px solid ${({ theme }) => theme.colors.black};

  // &:active:not(:disabled) {
  //   box-shadow: none;
  //   transform: translateY(2px);
  // }
  // &:disabled {
  //   cursor: not-allowed;
  //   background-color: ${({ theme }) => theme.colors.gray};
  // }
`;

export const PlayAsGuestButton = styled.button`
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
  color: ${({ theme }) => theme.colors.darkGray};
  text-decoration: underline;
  text-underline-offset: 4px;
`;

export const UsernameInput = styled.input`
  width: 180px;
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

export const RoomCodeInput = styled.input`
  width: 180px;
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

export const GameSettings = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  padding: 10px;
  border: 2px solid ${({ theme }) => theme.colors.black};
  border-radius: ${({ theme }) => theme.borderRadius.default};
`;

export const GameModeButton = styled.button<{
  backgroundColor?: string;
}>`
  box-shadow: ${({ theme }) => theme.shadows.default};
  border: 2px solid ${({ theme }) => theme.colors.black};
  background-color: ${({ theme }) => theme.colors.gray};
  border-radius: 5px;
  width: 130px;
  height: 28px;
  &:active:not(:disabled) {
    box-shadow: none;
    transform: translateY(2px);
  }
  &:disabled {
    cursor: not-allowed;
    background-color: ${props => props.backgroundColor};
    color: ${({ theme }) => theme.colors.black};
  }
`;
