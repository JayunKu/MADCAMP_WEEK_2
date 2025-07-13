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
import modeAbstract from '../../assets/images/mode-abstract.png';
import {
  GameModeButton,
  GameSettings,
  PlayAsGuestButton,
  UsernameInput,
} from '../index.styles';
import { GameMode } from '../../types/gameType';

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

  const [selectedGameMode, setSelectedGameMode] = useState(GameMode.BASIC);

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
      <Sketchbook
        show={showSketchbook}
        flipping={flipping}
        height="600px"
        width="380px"
        ringCount={11}
      >
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
              {/* <img
                src={modeAbstract}
                alt="Mode Abstract"
                style={{
                  width: '100%',
                  //   marginBottom: '30px',
                }}
              /> */}

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

              <GameSettings>
                <p style={{ width: '100%' }}>모드 선택</p>
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    flexDirection: 'row',
                    marginTop: '5px',
                  }}
                >
                  <GameModeButton
                    backgroundColor={theme.colors.lighterYellow}
                    disabled={selectedGameMode === GameMode.BASIC}
                    onClick={() => {
                      setSelectedGameMode(GameMode.BASIC);
                    }}
                  >
                    기본 모드
                  </GameModeButton>
                  <GameModeButton
                    backgroundColor={theme.colors.lightRed}
                    disabled={selectedGameMode === GameMode.FAKER}
                    onClick={() => {
                      setSelectedGameMode(GameMode.FAKER);
                    }}
                  >
                    페이커 모드
                  </GameModeButton>
                </div>
                <p style={{ width: '100%', marginTop: '15px' }}>
                  게임 옵션 선택
                </p>
              </GameSettings>

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
      <Footer show={showFooter} />
    </>
  );
};

export default MainPage;
