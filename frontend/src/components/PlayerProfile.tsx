import styled from '@emotion/styled';
import { AvatarFrame } from './AvatarFrame';
import { AvatarType } from '../types/avatar';
import { useTheme } from '@emotion/react';
import hostIcon from '../assets/images/host.svg';

interface UserProfileProps {
  isEmpty?: boolean;
  isMember: boolean;
  username: string;
  avatarType?: AvatarType;
  totalGames?: number;
  totalWins?: number;
  onMakeHost: (userId?: number) => void;
  showTools?: boolean;
}

export const PlayerProfile = ({
  isEmpty,
  isMember,
  username,
  avatarType = AvatarType.AVATAR_GRAY,
  onMakeHost,
  showTools = false,
}: UserProfileProps) => {
  const theme = useTheme();

  if (isEmpty) {
    return (
      <PlayerProfileContainer
        style={{
          opacity: 0.3,
        }}
      >
        <p
          style={{
            width: '100%',
            textAlign: 'center',
          }}
        >
          비었음
        </p>
      </PlayerProfileContainer>
    );
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '3px',
      }}
    >
      <PlayerProfileContainer>
        <AvatarFrame avatarType={avatarType} size="small" />
        <div>
          <p style={{ fontSize: '15px' }}>{username}</p>
          {isMember ? (
            <p
              style={{
                fontSize: '9px',
                color: theme.colors.darkGray,
                marginTop: '3px',
              }}
            >
              회원
            </p>
          ) : null}
        </div>
      </PlayerProfileContainer>
      {showTools && (
        <img
          src={hostIcon}
          alt="Host Icon"
          style={{
            width: '16px',
            height: '16px',
            cursor: 'pointer',
          }}
          onClick={() => {
            if (window.confirm('방장으로 만들까요?')) {
              // Call the function to make this player the host
              onMakeHost();
            }
          }}
        />
      )}
    </div>
  );
};

const PlayerProfileContainer = styled.div`
  width: 150px;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  border: 2px solid ${({ theme }) => theme.colors.black};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  padding-left: 5px;
`;
