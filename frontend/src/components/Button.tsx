import React from 'react';
import styled from '@emotion/styled';

export const DefaultButton = styled.button`
  border-radius: ${({ theme }) => theme.borderRadius.default};
  box-shadow: ${({ theme }) => theme.shadows.default};
  border: 2px solid ${({ theme }) => theme.colors.black};

  &:active:not(:disabled) {
    box-shadow: none;
    transform: translateY(2px);
  }
  &:disabled {
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.colors.gray};
  }
`;

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  backgroundColor?: string;
};

export const LargeButton = ({
  children,
  onClick = () => {},
  disabled = false,
  backgroundColor = 'transparent',
}: ButtonProps) => (
  <LargeButtonContainer
    onClick={onClick}
    disabled={disabled}
    backgroundColor={backgroundColor}
  >
    <span>{children}</span>
  </LargeButtonContainer>
);

const LargeButtonContainer = styled(DefaultButton)<{
  backgroundColor?: string;
}>`
  width: 180px;
  height: 45px;
  background-color: ${props => props.backgroundColor};
  font-size: 17px;
  border: 3px solid ${({ theme }) => theme.colors.black};
`;

export const SmallButton = ({
  children,
  onClick = () => {},
  disabled = false,
  backgroundColor = 'transparent',
}: ButtonProps) => {
  return (
    <SmallButtonContainer
      onClick={onClick}
      disabled={disabled}
      backgroundColor={backgroundColor}
    >
      <span>{children}</span>
    </SmallButtonContainer>
  );
};

const SmallButtonContainer = styled(DefaultButton)<{
  backgroundColor?: string;
}>`
  width: 130px;
  height: 40px;
  background-color: ${props => props.backgroundColor};
  font-size: 17px;
`;
