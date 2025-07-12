import { useState, useRef, useEffect } from 'react';
import { Footer } from '../../components/footer/Footer';
import styled from '@emotion/styled';
import {
  Sketchbook,
  SketchbookHandle,
} from '../../components/sketchbook/Sketchbook';
import { LargeButton } from '../../components/common/Button';
import { useTheme } from '@emotion/react';
import mainLogo from '../../assets/images/main-logo.png';
import gameAbstract from '../../assets/images/game-abstract.png';
import { Spacer } from '../../components/common/Spacer';
import { AvatarType } from '../../types/avatarType';
import { AvatarCarousel } from '../../components/common/AvatarCarousel';

const MainPage = () => {
  const theme = useTheme();

  const [showFooter, setShowFooter] = useState(true);
  const [flipping, setFlipping] = useState(false);
  const [guestMode, setGuestMode] = useState(false);
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AvatarType.AVATAR_GREEN);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleGuestGame = () => {
    setFlipping(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setGuestMode(true);
      setFlipping(false);
    }, 700);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <MainContainer>
      <Sketchbook flipping={flipping}>
        {!guestMode ? (
          <>
            <img src={mainLogo} alt="MalGreem" style={{ width: '80%' }} />
            <img
              src={gameAbstract}
              alt="Game Abstract"
              style={{ width: '90%', marginTop: '20px', marginBottom: '30px' }}
            />
            <LargeButton backgroundColor={theme.colors.lightYellow}>
              Google로 로그인
            </LargeButton>
            <GameAsNonMemberButton onClick={handleGuestGame}>
              비회원으로 게임하기
            </GameAsNonMemberButton>
          </>
        ) : (
          <>
            <AvatarCarousel
              value={selectedAvatar}
              onChange={setSelectedAvatar}
            />
            <UsernameInput
              type="text"
              placeholder="닉네임을 입력하세요"
              value={username}
              onChange={e => setUsername(e.target.value)}
              maxLength={12}
            />
            <LargeButton backgroundColor={theme.colors.lightYellow}>
              방 만들기
            </LargeButton>
            <Spacer y={10} />
            <LargeButton backgroundColor={theme.colors.lighterYellow}>
              방 들어가기
            </LargeButton>
          </>
        )}
      </Sketchbook>
      <Footer show={showFooter} />
    </MainContainer>
  );
};

const MainContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding: 0 15px;
  width: 412px;
  background: #ededed;
  box-sizing: border-box;
`;

const GameAsNonMemberButton = styled.button`
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
  color: ${({ theme }) => theme.colors.darkGray};
  text-decoration: underline;
  text-underline-offset: 4px;
`;

const UsernameInput = styled.input`
  width: 180px;
  padding: 12px 16px;
  margin-bottom: 18px;
  font-size: 16px;
  border: 2px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  outline: none;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
  transition: border 0.2s;
  &:focus {
    border-color: ${({ theme }) => theme.colors.darkGray};
  }
`;

export default MainPage;
