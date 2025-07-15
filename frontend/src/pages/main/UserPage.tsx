import { useEffect, useState } from 'react';
import { AvatarCarousel } from '../../components/AvatarCarousel';
import {
  AvatarType,
  getAvatarIdFromType,
  getAvatarTypeFromId,
} from '../../types/avatar';
import { useAuth } from '../../context/AuthContext';
import { RoomCodeInput, UsernameInput } from '../index.styles';
import { LargeButton, SmallButton } from '../../components/Button';
import { useTheme } from '@emotion/react';
import { Spacer } from '../../components/Spacer';
import { User } from '../../types/user';
import { axiosInstance } from '../../hooks/useAxios';
import { parsePlayer, parseRoom } from '../../types/game';
import { FullScreenPopup } from '../../components/FullScreenPopup';
import { RoomCodeStatus } from './index.types';
import { useRoom } from '../../context/RoomContext';
import { useUI } from '../../context/UIContext';
import { useSocketContext } from '../../context/SocketContext';

interface UserPageProps {
  flipToPage: (page: number) => void;
}

export const UserPage = ({ flipToPage }: UserPageProps) => {
  const theme = useTheme();
  const { login, user, player, isAuthenticated, setUser, setPlayer } =
    useAuth();
  const { setRoomPlayers, setRoom } = useRoom();
  const { setLoading } = useUI();

  const { joinRoom } = useSocketContext();

  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AvatarType.AVATAR_GRAY);

  const [roomCode, setRoomCode] = useState('');
  const [roomCodeStatus, setRoomCodeStatus] = useState(RoomCodeStatus.EMPTY);
  const [showRoomCodePopup, setShowRoomCodePopup] = useState(false);

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
      setUser(updatedUser);
      alert('저장되었습니다.');
    } catch (err) {
      console.error('Failed to update user profile:', err);
      alert('오류가 발생하였습니다. 다시 시도해주세요.');
    }
  };

  const createRoomButtonHandler = async () => {
    if (!player) {
      alert('오류가 발생하였습니다. 다시 시도해주세요.');
      return;
    }

    if (!username || username.length < 2) {
      alert('닉네임은 2글자 이상이어야 합니다.');
      return;
    }
    setLoading(true);

    try {
      if (!player.isMember) {
        await axiosInstance.put(`/players/${player.id}`, {
          name: username,
        });
        setPlayer({
          ...player,
          name: username,
        });
      }

      const res = (await axiosInstance.post('/rooms')).data;
      const newRoom = parseRoom(res.room);
      console.log('Room created:', newRoom);

      setRoom(newRoom);
      setRoomPlayers(res.players.map((p: any) => parsePlayer(p)));
      joinRoom(newRoom.id);
      setLoading(false);
      flipToPage(2);
    } catch (err) {
      setLoading(false);
      console.error('Failed to create room:', err);
      alert('오류가 발생하였습니다. 다시 시도해주세요.');
    }
  };

  const onEnterRoomButtonHandler = () => {
    setShowRoomCodePopup(true);
  };

  const roomCodeConfirmHandler = async () => {
    if (!player) {
      alert('오류가 발생하였습니다. 다시 시도해주세요.');
      return;
    }
    if (!username || username.length < 2) {
      alert('닉네임은 2글자 이상이어야 합니다.');
      return;
    }
    setLoading(true);
    try {
      if (!player.isMember) {
        await axiosInstance.put(`/players/${player.id}`, {
          name: username,
        });
        setPlayer({
          ...player,
          name: username,
        });
        console.log('Player updated:', player.id, username);
      }

      const res = (await axiosInstance.post(`/rooms/${roomCode}`)).data;
      const parsedRoom = parseRoom(res.room);
      console.log('Room entered:', parsedRoom);

      setShowRoomCodePopup(false);
      setRoom(parsedRoom);
      setRoomPlayers(res.players.map((p: any) => parsePlayer(p)));
      joinRoom(parsedRoom.id);
      setLoading(false);
      flipToPage(2);
    } catch (err) {
      setLoading(false);
      console.error('Failed to fetch room data:', err);
      alert('방을 찾을 수 없습니다. 방 코드가 올바른지 확인해주세요.');
    }
  };

  return (
    <>
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
    </>
  );
};
