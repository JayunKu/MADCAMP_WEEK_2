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
  RoomCodeInput,
  UsernameInput,
} from '../index.styles';
import { GameMode, parseRoom, Room } from '../../types/game';
import { useGoogleLogin } from '@react-oauth/google';
import { axiosInstance } from '../../hooks/useAxios';
import { useAuth } from '../../context/AuthContext';
import { EXAMPLE_PLAYER_INFOS } from '../../types/mockData';
import { RoomCode } from '../../components/RoomCode';
import { useGameSocket } from '../../hooks/useGameSocket';
import { FullScreenPopup } from '../../components/FullScreenPopup';
import { LoadingPopUp } from '../../components/LoadingPopUp';
import { RoomCodeStatus } from './index.types';
import { User } from '../../types/user';

const MAX_PLAYER_PER_ROOM = 8; // 최대 플레이어 수

const MainPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login, logout, user, player, isAuthenticated } = useAuth();

  const [showFooter, setShowFooter] = useState(true);
  const [showSketchbook, setShowSketchbook] = useState(true);

  const [flipping, setFlipping] = useState(false);
  const [pageIdx, setPageIdx] = useState(0);
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AvatarType.AVATAR_GRAY);

  const { joinRoom, startGame, leaveRoom, gameState } = useGameSocket();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [loading, setLoading] = useState(false);

  const [roomCode, setRoomCode] = useState('');
  const [roomCodeStatus, setRoomCodeStatus] = useState(RoomCodeStatus.EMPTY);
  const [showRoomCodePopup, setShowRoomCodePopup] = useState(false);

  const [room, setRoom] = useState<Room | null>(null);

  const [isRoomHost, setIsRoomHost] = useState(false);
  const [selectedGameMode, setSelectedGameMode] = useState(GameMode.BASIC);

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

  useEffect(() => {
    if (!room || !player) return;
    console.log('Room updated:', room);

    setIsRoomHost(room.hostPlayerId === player.id);
    setSelectedGameMode(room.gameMode);
  }, [room]);

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
    setLoading(true);

    try {
      if (!player) alert('오류가 발생했습니다. 페이지를 새로고침해주세요.');

      const roomData = parseRoom((await axiosInstance.post('/rooms')).data);
      console.log('Room created:', roomData);

      setLoading(false);
      setRoom(roomData);
      flipToPage(2);
    } catch (err) {
      console.error('Failed to create room:', err);
      alert('Failed to create room. Please try again later.');
    }
  };

  const roomCodeConfirmHandler = async () => {
    setLoading(true);

    try {
      const roomData = parseRoom(
        (await axiosInstance.get(`/rooms/${roomCode}`)).data
      );
      console.log('Room entered:', roomData);

      setShowRoomCodePopup(false);
      setRoom(roomData);
      setLoading(false);
      flipToPage(2);
    } catch (err) {
      setLoading(false);
      console.error('Failed to fetch room data:', err);
      alert('방을 찾을 수 없습니다. 방 코드가 올바른지 확인해주세요.');
    }
  };

  const onEnterRoomButtonHandler = () => {
    setShowRoomCodePopup(true);
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
      <LoadingPopUp open={loading} />
      <FullScreenPopup
        open={showRoomCodePopup}
        onClose={() => setShowRoomCodePopup(false)}
      >
        <RoomCodeInput
          value={roomCode}
          placeholder="방 코드를 입력하세요"
          onChange={e => {
            setRoomCode(e.target.value);
            if (e.target.value.trim() === '') {
              setRoomCodeStatus(RoomCodeStatus.EMPTY);
            } else if (/^[A-Z0-9]{8}$/.test(e.target.value)) {
              setRoomCodeStatus(RoomCodeStatus.VALID);
            } else {
              setRoomCodeStatus(RoomCodeStatus.INVALID);
            }
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') roomCodeConfirmHandler();
          }}
        />
        <SmallButton
          backgroundColor={theme.colors.lightYellow}
          disabled={roomCodeStatus !== RoomCodeStatus.VALID}
          onClick={() => {
            roomCodeConfirmHandler();
          }}
        >
          {Object({
            VALID: '입장하기',
            INVALID: '잘못된 방 코드',
            LOADING: '로딩 중',
            EMPTY: '방 코드 입력',
          })[roomCodeStatus] || '입장하기'}
        </SmallButton>
      </FullScreenPopup>
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
                        isRoomHost={isRoomHost}
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

              <RoomCode code={roomCode} />

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
                      if (!isRoomHost) {
                        alert('방장만 모드를 변경할 수 있습니다.');
                        return;
                      }
                      setSelectedGameMode(GameMode.BASIC);
                    }}
                  >
                    기본 모드
                  </GameModeButton>
                  <GameModeButton
                    backgroundColor={theme.colors.lightRed}
                    disabled={selectedGameMode === GameMode.FAKER}
                    onClick={() => {
                      if (!isRoomHost) {
                        alert('방장만 모드를 변경할 수 있습니다.');
                        return;
                      }
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
