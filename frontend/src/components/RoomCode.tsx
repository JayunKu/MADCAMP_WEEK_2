import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import copyIcon from '../assets/images/copy.svg';

export const RoomCode = (props: { code: string }) => {
  const theme = useTheme();

  return (
    <RoomCodeContainer>
      <p
        style={{
          width: '100%',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '14px', color: theme.colors.darkGray }}>
          방 코드
        </span>
        &nbsp;
        <span style={{ fontSize: '16px' }}>{props.code}</span>
        <img
          src={copyIcon}
          alt="Copy Icon"
          style={{
            width: '16px',
            height: '18px',
            marginLeft: '8px',
            verticalAlign: 'middle',
            cursor: 'pointer',
          }}
          onClick={() => {
            try {
              navigator.clipboard.writeText(props.code);
              alert('방 코드가 복사되었습니다!');
            } catch (error) {
              console.error('Failed to copy text: ', error);
              alert('방 코드 복사에 실패했습니다. 다시 시도해주세요.');
            }
          }}
        />
      </p>
    </RoomCodeContainer>
  );
};

const RoomCodeContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: 6px;
  box-shadow: ${({ theme }) => theme.shadows.default};
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  padding: 8px;
`;
