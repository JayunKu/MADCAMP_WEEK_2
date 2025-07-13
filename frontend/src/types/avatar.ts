import avatarGray from '../assets/images/larva-0.png';
import avatarGreen from '../assets/images/larva-1.png';
import avatarRed from '../assets/images/larva-2.png';
import avatarBrown from '../assets/images/larva-3.png';
import avatarYellow from '../assets/images/larva-4.png';
import avatarFakerGray from '../assets/images/larva-faker-0.png';
import avatarFakerGreen from '../assets/images/larva-faker-1.png';
import avatarFakerRed from '../assets/images/larva-faker-2.png';
import avatarFakerBrown from '../assets/images/larva-faker-3.png';
import avatarFakerYellow from '../assets/images/larva-faker-4.png';

export enum AvatarType {
  AVATAR_GREEN = 'AVATAR_GREEN',
  AVATAR_RED = 'AVATAR_RED',
  AVATAR_BROWN = 'AVATAR_BROWN',
  AVATAR_GRAY = 'AVATAR_GRAY',
  AVATAR_YELLOW = 'AVATAR_YELLOW',

  AVATAR_FAKER_GREEN = 'AVATAR_FAKER_GREEN',
  AVATAR_FAKER_RED = 'AVATAR_FAKER_RED',
  AVATAR_FAKER_BROWN = 'AVATAR_FAKER_BROWN',
  AVATAR_FAKER_GRAY = 'AVATAR_FAKER_GRAY',
  AVATAR_FAKER_YELLOW = 'AVATAR_FAKER_YELLOW',
}

export const getAvatarImage = (avatarType: AvatarType) => {
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

export const getAvatarTypeFromId = (
  id: number,
  isFaker: boolean = false
): AvatarType => {
  switch (id) {
    case 0:
      return isFaker ? AvatarType.AVATAR_FAKER_GRAY : AvatarType.AVATAR_GRAY;
    case 1:
      return isFaker ? AvatarType.AVATAR_FAKER_GREEN : AvatarType.AVATAR_GREEN;
    case 2:
      return isFaker ? AvatarType.AVATAR_FAKER_RED : AvatarType.AVATAR_RED;
    case 3:
      return isFaker ? AvatarType.AVATAR_FAKER_BROWN : AvatarType.AVATAR_BROWN;
    case 4:
      return isFaker
        ? AvatarType.AVATAR_FAKER_YELLOW
        : AvatarType.AVATAR_YELLOW;
    default:
      return AvatarType.AVATAR_GRAY;
  }
};
