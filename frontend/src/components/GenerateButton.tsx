import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import reloadIcon from '../assets/images/reload.svg';
import { DefaultButton } from './Button';

interface GenerateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  remain: number;
  maxTries: number;
}

export const GenerateButton = ({
  onClick,
  disabled = false,
  remain,
  maxTries,
}: GenerateButtonProps) => {
  const theme = useTheme();

  return (
    <GenerateButtonContainer onClick={onClick} disabled={disabled}>
      <div>
        <p
          style={{
            fontSize: '13px',
          }}
        >
          생성
        </p>
        <p
          style={{
            fontSize: '8px',
            color: theme.colors.darkGray,
            marginTop: '2px',
          }}
        >
          남은 횟수({remain}/{maxTries})
        </p>
      </div>
      <img
        src={reloadIcon}
        alt="Reload Icon"
        style={{
          width: '14px',
          height: '14px',
          marginLeft: '5px',
          filter: disabled ? 'grayscale(100%)' : 'none',
        }}
      />
    </GenerateButtonContainer>
  );
};

const GenerateButtonContainer = styled(DefaultButton)<{
  disabled?: boolean;
}>`
  height: 38px;
  background-color: ${({ theme }) => theme.colors.lighterYellow};
  display: flex;
  flex-direction: row;
  align-items: center;
`;
