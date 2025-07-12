import styled from '@emotion/styled';
import { AvatarType, getAvatarImage } from '../types/avatarType';

interface AvatarProfileProps {
  size: 'big' | 'small';
  avatarType: AvatarType;
}

export const AvatarFrame = (props: AvatarProfileProps) => {
  const imageSource = getAvatarImage(props.avatarType);

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
  box-sizing: border-box;
  width: ${({ size }) => (size === 'big' ? '80px' : '40px')};
  height: ${({ size }) => (size === 'big' ? '80px' : '40px')};
  background-color: #d9d9d9;
  border-radius: ${({ size }) => (size === 'big' ? '20px' : '10px')};
  border: ${({ size }) => (size === 'big' ? '3px' : '1px')} solid
    ${({ theme }) => theme.colors.black};
  overflow: hidden;
`;
