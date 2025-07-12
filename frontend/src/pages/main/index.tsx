import { useState, useRef, useEffect } from 'react';
import { Footer } from '../../components/Footer';
import styled from '@emotion/styled';
import {
  Sketchbook,
  SketchbookHandle,
} from '../../components/sketchbook/Sketchbook';
import { LargeButton, SmallButton } from '../../components/Button';
import { useTheme } from '@emotion/react';
import mainLogo from '../../assets/images/main-logo.png';
import gameAbstract from '../../assets/images/game-abstract.png';
import { Spacer } from '../../components/Spacer';
import { AvatarType } from '../../types/avatarType';
import { AvatarCarousel } from '../../components/AvatarCarousel';
import { PlayerProfile } from '../../components/PlayerProfile';
import { PartyCode } from '../../components/PartyCode';
import { useNavigate } from 'react-router-dom';

const MAX_PLAYER_PER_PARTY = 8; // 최대 플레이어 수

const MainPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [showFooter, setShowFooter] = useState(true);
  const [showSketchbook, setShowSketchbook] = useState(true);

  const [flipping, setFlipping] = useState(false);
  const [pageIdx, setPageIdx] = useState(0);
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AvatarType.AVATAR_GREEN);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const EXAMPLE_PLAYERS = [
    {
      id: 1,
      isMember: true,
      username: 'Player1',
      totalGames: 10,
      totalWins: 5,
      avatarId: 0,
    },
    {
      id: 2,
      isMember: false,
      username: 'Player2',
      avatarId: 2,
    },
    {
      id: 3,
      isMember: true,
      username: 'Player3',
      totalGames: 8,
      totalWins: 3,
      avatarId: 3,
    },
  ];

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const flipToPage = (targetIdx: number) => {
    setFlipping(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setPageIdx(targetIdx);
      setFlipping(false);
    }, 500);
  };

  const onPlayAsGuestButtonHandler = () => {
    flipToPage(1);
  };

  const onEnterPartyButtonHandler = () => {
    flipToPage(2);
  };

  const onGameStartButtonHandler = () => {
    setShowFooter(false);
    setShowSketchbook(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      navigate('/game', { state: { partyId: 'FDAS32D' } });
    }, 500);
  };

  return (
    <>
      <Spacer y={40} />
      <Sketchbook show={showSketchbook} flipping={flipping} height="600px">
        {
          [
            // 0: 로비 페이지
            <>
              <img
                src={mainLogo}
                alt="MalGreem"
                style={{ width: '80%', marginTop: '20px' }}
              />
              <img
                src={gameAbstract}
                alt="Game Abstract"
                style={{
                  width: '90%',
                  marginTop: '20px',
                  marginBottom: '30px',
                }}
              />
              <LargeButton backgroundColor={theme.colors.lightYellow}>
                Google로 로그인
              </LargeButton>
              <PlayAsGuestButton onClick={onPlayAsGuestButtonHandler}>
                비회원으로 게임하기
              </PlayAsGuestButton>
            </>,
            // 1: 방 생성 및 입장 페이지
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
              <LargeButton
                backgroundColor={theme.colors.lighterYellow}
                onClick={onEnterPartyButtonHandler}
              >
                방 들어가기
              </LargeButton>
            </>,
            // 2: 게임 준비 페이지
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginTop: '20px',
                }}
              >
                {Array.from({ length: MAX_PLAYER_PER_PARTY }).map((_, idx) => {
                  const player = EXAMPLE_PLAYERS[idx];
                  if (player) {
                    return (
                      <PlayerProfile
                        key={player.id}
                        isMember={player.isMember}
                        username={player.username}
                        avatarId={player.avatarId}
                        totalGames={player.totalGames}
                        totalWins={player.totalWins}
                        onMakeHost={() => {}}
                        onDeletePlayer={() => {}}
                      />
                    );
                  } else {
                    return (
                      <PlayerProfile
                        key={`empty-${idx}`}
                        isEmpty
                        isMember={false}
                        username=""
                        onMakeHost={() => {}}
                        onDeletePlayer={() => {}}
                      />
                    );
                  }
                })}
              </div>

              <PartyCode code="FDAS32D" />

              <SmallButton
                backgroundColor={theme.colors.lightYellow}
                onClick={onGameStartButtonHandler}
              >
                게임 시작
              </SmallButton>
            </>,
          ][pageIdx]
        }
      </Sketchbook>
      <Spacer y={40} />
      <Footer show={showFooter} />
    </>
  );
};

const PlayAsGuestButton = styled.button`
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
