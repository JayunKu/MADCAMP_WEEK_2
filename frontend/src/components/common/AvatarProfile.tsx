import styled from '@emotion/styled';
import avatarGray from '../../assets/images/larva-0.png';
import avatarGreen from '../../assets/images/larva-1.png';
import avatarRed from '../../assets/images/larva-2.png';
import avatarBrown from '../../assets/images/larva-3.png';
import avatarYellow from '../../assets/images/larva-4.png';
import avatarFakerGray from '../../assets/images/larva-faker-0.png';
import avatarFakerGreen from '../../assets/images/larva-faker-1.png';
import avatarFakerRed from '../../assets/images/larva-faker-2.png';
import avatarFakerBrown from '../../assets/images/larva-faker-3.png';
import avatarFakerYellow from '../../assets/images/larva-faker-4.png';
import { AvatarType } from '../../types/avatarType';

interface AvatarProfileProps {
  size: 'big' | 'small';
  avatarType: AvatarType;
}

const getImageSource = (avatarType: AvatarType) => {
  switch (avatarType) {
    case AvatarType.AVATAR_GREEN:
      return avatarGreen;
    case AvatarType.AVATAR_RED:
      return avatarRed;
    case AvatarType.AVATAR_BROWN:
      return avatarBrown;
    case AvatarType.AVATAR_GRAY:
      return avatarGray;
    case AvatarType.AVATAR_YELLOW:
      return avatarYellow;
    case AvatarType.AVATAR_FAKER_GREEN:
      return avatarFakerGreen;
    case AvatarType.AVATAR_FAKER_RED:
      return avatarFakerRed;
    case AvatarType.AVATAR_FAKER_BROWN:
      return avatarFakerBrown;
    case AvatarType.AVATAR_FAKER_GRAY:
      return avatarFakerGray;
    case AvatarType.AVATAR_FAKER_YELLOW:
      return avatarFakerYellow;
    default:
      return avatarGray;
  }
};

export const AvatarProfile = (props: AvatarProfileProps) => {
  const imageSource = getImageSource(props.avatarType);

  return (
    <AvatarProfileContainer size={props.size}>
      <img
        src={imageSource}
        alt="Avatar"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          objectPosition: props.size === 'big' ? '-15px 5px' : '-8px 3px',
          transform: props.size === 'big' ? 'scale(1.3)' : 'scale(1.2)',
        }}
      />
    </AvatarProfileContainer>
  );
};

const AvatarProfileContainer = styled.div<{
  size: 'big' | 'small';
}>`
  width: ${({ size }) => (size === 'big' ? '80px' : '40px')};
  height: ${({ size }) => (size === 'big' ? '80px' : '40px')};
  background-color: #d9d9d9;
  border-radius: ${({ size }) => (size === 'big' ? '20px' : '10px')};
  border: ${({ size }) => (size === 'big' ? '3px' : '1px')} solid
    ${({ theme }) => theme.colors.black};
  overflow: hidden;
`;
