import { useState, useRef, useEffect } from 'react';
import { Footer } from '../../components/Footer';
import { Sketchbook } from '../../components/sketchbook/Sketchbook';
import { LargeButton, SmallButton } from '../../components/Button';
import { useTheme } from '@emotion/react';
import mainLogo from '../../assets/images/main-logo.png';
import gameAbstract from '../../assets/images/game-abstract.png';
import { Spacer } from '../../components/Spacer';
import {
  AvatarType,
  getAvatarIdFromType,
  getAvatarTypeFromId,
} from '../../types/avatar';
import { AvatarCarousel } from '../../components/AvatarCarousel';
import { PlayerProfile } from '../../components/PlayerProfile';
import { useNavigate } from 'react-router-dom';
import modeAbstract from '../../assets/images/mode-abstract.png';
import {
  GameModeButton,
  GameSettings,
  PlayAsGuestButton,
  UsernameInput,
} from '../index.styles';
import { GameMode } from '../../types/game';
import { useGoogleLogin } from '@react-oauth/google';
import { axiosInstance } from '../../hooks/useAxios';
import { useAuth, User } from '../../context/AuthContext';
import { EXAMPLE_PLAYER_INFOS } from '../../types/mockData';
import { RoomCode } from '../../components/RoomCode';
import { useGameSocket } from '../../hooks/useGameSocket';

const MAX_PLAYER_PER_ROOM = 8; // 최대 플레이어 수

const MainPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login, logout, user, isAuthenticated } = useAuth();

  const [showFooter, setShowFooter] = useState(true);
  const [showSketchbook, setShowSketchbook] = useState(true);

  const [flipping, setFlipping] = useState(false);
  const [pageIdx, setPageIdx] = useState(0);
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AvatarType.AVATAR_GREEN);

  // const { joinRoom, startGame, leaveRoom, gameState } = useGameSocket();

  const [selectedGameMode, setSelectedGameMode] = useState(GameMode.BASIC);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const googleLogin = useGoogleLogin({
    onSuccess: async response => {
      console.log('Google login successful:', response);

      try {
        const authResponse = await axiosInstance.post('/auth', {
          accessToken: response.access_token,
        });

        console.log('Auth successful:', authResponse.data);

        // 사용자 정보를 AuthContext에 저장
        const userData = {
          id: authResponse.data.id,
          playerId: authResponse.data.player_id,
          name: authResponse.data.name,
          avatarId: authResponse.data.avatar_id,
          totalGames: authResponse.data.total_games,
          totalWins: authResponse.data.total_wins,
        };

        login(userData);
        flipToPage(1);
      } catch (err) {
        console.error('Failed to authenticate with server:', err);
        alert('Failed to connect API server. Please try again later.');
      }
    },
    onError: error => {
      console.error('Google login failed:', error);
    },
  });

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // 로그인된 사용자 정보가 있으면 username 자동 설정
  useEffect(() => {
    if (user) {
      setUsername(user.name);
      setSelectedAvatar(getAvatarTypeFromId(user.avatarId));
    } else {
      setUsername('');
      setSelectedAvatar(AvatarType.AVATAR_GRAY);
    }
  }, [user]);

  const flipToPage = (targetIdx: number) => {
    setFlipping(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setPageIdx(targetIdx);
      setFlipping(false);
    }, 500);
  };

  const onGoogleLoginButtonHandler = () => {
    googleLogin();
  };

  const onUserProfileSaveHandler = async () => {
    if (!username || username.length < 2) {
      alert('닉네임은 2글자 이상이어야 합니다.');
      return;
    }
    // 사용자 정보 업데이트
    const updatedUser = {
      ...(user as User),
      name: username,
      avatarId: getAvatarIdFromType(selectedAvatar),
    };

    login(updatedUser);

    // 서버에 사용자 정보 저장
    try {
      await axiosInstance.put('/users/me', {
        name: updatedUser.name,
        avatar_id: updatedUser.avatarId,
      });
      alert('저장되었습니다.');
    } catch (err) {
      console.error('Failed to update user profile:', err);
      alert('Failed to update user profile. Please try again later.');
    }
  };

  const onPlayAsGuestButtonHandler = () => {
    flipToPage(1);
  };

  const createRoomButtonHandler = async () => {
    // try {
    //   const response = await axiosInstance.post('/rooms', {
    //     host: {
    //       id: updatedUser.playerId,
    //       username: updatedUser.name,
    //       avatarId: updatedUser.avatarId,
    //       isMember: true,
    //     },
    //     gameMode: selectedGameMode,
    //   });
    //   console.log('Room created:', response.data);
    //   flipToPage(2);
    // } catch (err) {
    //   console.error('Failed to create room:', err);
    //   alert('Failed to create room. Please try again later.');
    // }
  };

  const onEnterRoomButtonHandler = () => {
    flipToPage(2);
  };

  const onGameStartButtonHandler = () => {
    setShowFooter(false);
    setShowSketchbook(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      navigate('/game', { state: { roomId: 'FDAS32D' } });
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
              <LargeButton
                backgroundColor={theme.colors.lightYellow}
                onClick={() => {
                  if (!isAuthenticated) onGoogleLoginButtonHandler();
                  else flipToPage(1);
                }}
              >
                {isAuthenticated
                  ? `${user?.name}으로 플레이`
                  : 'Google로 로그인'}
              </LargeButton>
              <PlayAsGuestButton
                onClick={() => {
                  if (!isAuthenticated) onPlayAsGuestButtonHandler();
                  else logout();
                }}
              >
                {isAuthenticated ? `로그아웃` : '비회원으로 게임하기'}
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
                showButtons={isAuthenticated}
              />
              <UsernameInput
                type="text"
                placeholder="닉네임을 입력하세요"
                value={username}
                onChange={e => setUsername(e.target.value)}
                maxLength={12}
              />
              {isAuthenticated && (
                <SmallButton
                  backgroundColor={theme.colors.lightYellow}
                  onClick={onUserProfileSaveHandler}
                >
                  저장하기
                </SmallButton>
              )}

              <Spacer y={40} />

              <LargeButton
                backgroundColor={theme.colors.lightYellow}
                onClick={createRoomButtonHandler}
              >
                방 만들기
              </LargeButton>

              <Spacer y={10} />

              <LargeButton
                backgroundColor={theme.colors.lighterYellow}
                onClick={onEnterRoomButtonHandler}
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
                {Array.from({ length: MAX_PLAYER_PER_ROOM }).map((_, idx) => {
                  const player = EXAMPLE_PLAYER_INFOS[idx];
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

              <RoomCode code="FDAS32D" />

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
