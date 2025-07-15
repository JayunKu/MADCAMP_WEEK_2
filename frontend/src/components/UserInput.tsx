import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';

interface UserInputProps {
  disabled?: boolean;
  value: string;
  onChange: (input: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const UserInput = ({
  value,
  onChange,
  disabled,
  onKeyDown,
}: UserInputProps) => {
  const theme = useTheme();

  return (
    <UserInputContainer disabled={disabled} onKeyDown={onKeyDown}>
      <span
        style={{
          fontSize: '14px',
          color: theme.colors.darkGray,
        }}
      >
        입력
      </span>
      <input
        type="text"
        value={value}
        placeholder="여기에 입력하세요"
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        style={{
          height: '100%',
          width: '180px',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontSize: '18px',
        }}
      />
    </UserInputContainer>
  );
};

const UserInputContainer = styled.div<{ disabled?: boolean }>`
  height: 38px;
  border: 2px solid ${({ theme }) => theme.colors.black};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colors.gray : theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.default};
  padding: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;
