import styled from '@emotion/styled';
import { AvatarFrame } from './AvatarFrame';
import { AvatarType } from '../../types/avatarType';
import { useTheme } from '@emotion/react';

interface UserProfileProps {
  isEmpty?: boolean;
  isMember: boolean;
  username: string;
  avatarId?: number;
  totalGames?: number;
  totalWins?: number;
}

const getAvatarTypeById = (avatarId?: number) => {
  switch (avatarId) {
    case 0:
      return AvatarType.AVATAR_GRAY;
    case 1:
      return AvatarType.AVATAR_GREEN;
    case 2:
      return AvatarType.AVATAR_RED;
    case 3:
      return AvatarType.AVATAR_BROWN;
    case 4:
      return AvatarType.AVATAR_YELLOW;
    default:
      return AvatarType.AVATAR_GRAY;
  }
};

export const PlayerProfile = ({
  isEmpty,
  isMember,
  username,
  avatarId,
  totalGames,
  totalWins,
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
    <PlayerProfileContainer>
      <AvatarFrame avatarType={getAvatarTypeById(avatarId)} size="small" />
      <div>
        <p style={{ fontSize: '15px' }}>{username}</p>
        {isMember && (
          <p
            style={{
              fontSize: '9px',
              color: theme.colors.darkGray,
              marginTop: '3px',
            }}
          >
            승률({totalWins ? ((totalWins / totalGames!) * 100).toFixed(1) : 0}
            %) {totalGames}전 {totalWins}승
          </p>
        )}
      </div>
    </PlayerProfileContainer>
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
