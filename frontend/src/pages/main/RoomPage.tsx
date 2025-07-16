import { useTheme } from '@emotion/react';
import { RoomCode } from '../../components/RoomCode';
import { useAuth } from '../../context/AuthContext';
import { useRoom } from '../../context/RoomContext';
import { GameModeButton, GameSettings } from '../index.styles';
import { PlayerProfile } from '../../components/PlayerProfile';
import { getAvatarTypeFromId } from '../../types/avatar';
import { SmallButton } from '../../components/Button';
import { Spacer } from '../../components/Spacer';
import { useEffect, useState } from 'react';
import { GameMode } from '../../types/game';
import { useUI } from '../../context/UIContext';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../hooks/useAxios';
import { useSocketContext } from '../../context/SocketContext';
import { User } from '../../types/user';

const MAX_PLAYER_PER_ROOM = 8; // 최대 플레이어 수

interface RoomPageProps {
  flipToPage: (page: number) => void;
  toggleSketchbook: (callback: () => void) => void;
}

export const RoomPage = ({ flipToPage, toggleSketchbook }: RoomPageProps) => {
  const theme = useTheme();
  const { setLoading } = useUI();
  const { leaveRoom } = useSocketContext();
  const { player } = useAuth();
  const { room, roomPlayers, setRoomPlayers, setRoom } = useRoom();

  const [isRoomHost, setIsRoomHost] = useState(false);
  const [selectedGameMode, setSelectedGameMode] = useState(GameMode.BASIC);

  const [membersInfo, setMembersInfo] = useState<User[]>([]);

  useEffect(() => {
    if (!room || !player) return;
    console.log('Room updated:', room);

    setIsRoomHost(room.hostPlayerId === player.id);
    setSelectedGameMode(room.gameMode);

    const fetchMembersInfo = async () => {
      try {
        const res = (await axiosInstance.get(`/rooms/${room.id}/members`)).data;
        console.log('Members info fetched:', res);
        setMembersInfo(res.members);
      } catch (err) {
        console.error('Failed to fetch members info:', err);
        alert('방 멤버 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.');
      }
    };
    fetchMembersInfo();
  }, [room]);

  const onGameModeChangeHandler = async (mode: GameMode) => {
    if (!room || !player) {
      alert('오류가 발생하였습니다. 다시 시도해주세요.');
      return;
    }
    if (!isRoomHost) {
      alert('방장만 모드를 변경할 수 있습니다.');
      return;
    }
    setSelectedGameMode(mode);

    try {
      await axiosInstance.put(`/rooms/${room.id}`, {
        game_mode: mode,
      });
      console.log('Game mode updated:', mode);
    } catch (err) {
      console.error('Failed to update game mode:', err);
      alert('오류가 발생하였습니다. 다시 시도해주세요.');
    }
  };

  const onMakeHostButtonHandler = async (playerId: string) => {
    if (!room || !player) {
      alert('오류가 발생하였습니다. 다시 시도해주세요.');
      return;
    }
    if (!isRoomHost) {
      alert('방장만 방장를 변경할 수 있습니다.');
      return;
    }
    if (playerId === player.id) {
      alert('자신을 방장으로 만들 수 없습니다.');
      return;
    }

    try {
      await axiosInstance.put(`/rooms/${room.id}`, {
        host_player_id: playerId,
      });
      console.log('Host changed to:', playerId);
      setIsRoomHost(playerId === player.id);
    } catch (err) {
      console.error('Failed to change host:', err);
      alert('오류가 발생하였습니다. 다시 시도해주세요.');
    }
  };

  const onGameStartButtonHandler = async () => {
    if (!room) {
      alert('오류가 발생하였습니다. 다시 시도해주세요.');
      return;
    }

    if (!isRoomHost) {
      alert('방장만 게임을 시작할 수 있습니다.');
      return;
    }

    try {
      await axiosInstance.post(`/games/${room.id}/`);
    } catch (err) {
      console.error('Failed to start game:', err);
      alert('오류가 발생하였습니다. 다시 시도해주세요.');
    }
  };

  const onExitRoomButtonHandler = async () => {
    if (!window.confirm('정말로 방을 나갈까요?')) return;

    setLoading(true);
    if (!player || !player.roomId) {
      alert('오류가 발생하였습니다. 다시 시도해주세요.');
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.delete(`/rooms/${player.roomId}/me`);
      console.log('Left room:', player.roomId);
      setRoom(null);
      setRoomPlayers(null);
      leaveRoom();
      setLoading(false);
      flipToPage(0);
    } catch (err) {
      console.error('Failed to leave room:', err);
      alert('오류가 발생하였습니다. 다시 시도해주세요.');
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(!room || !roomPlayers || !player || !membersInfo);
  }, [room, roomPlayers, player, membersInfo]);

  if (!room || !roomPlayers || !player || !membersInfo) return <></>;

  return (
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
          if (idx < roomPlayers.length) {
            const roomPlayer = roomPlayers[idx];
            return (
              <PlayerProfile
                key={roomPlayer.id}
                isMember={roomPlayer.isMember}
                username={roomPlayer.name}
                avatarType={getAvatarTypeFromId(roomPlayer.avatarId)}
                totalGames={
                  roomPlayer.isMember
                    ? membersInfo.find(user => user.playerId === roomPlayer.id)
                        ?.totalGames || undefined
                    : undefined
                }
                totalWins={
                  roomPlayer.isMember
                    ? membersInfo.find(user => user.playerId === roomPlayer.id)
                        ?.totalWins || undefined
                    : undefined
                }
                onMakeHost={() => {
                  onMakeHostButtonHandler(roomPlayer.id);
                }}
                showTools={isRoomHost && roomPlayer.id !== player.id}
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
              />
            );
          }
        })}
      </div>

      <RoomCode code={room.id} />

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
              onGameModeChangeHandler(GameMode.BASIC);
            }}
          >
            기본 모드
          </GameModeButton>
          <GameModeButton
            backgroundColor={theme.colors.lightRed}
            disabled={selectedGameMode === GameMode.FAKER}
            onClick={() => {
              onGameModeChangeHandler(GameMode.FAKER);
            }}
          >
            페이커 모드
          </GameModeButton>
        </div>
      </GameSettings>

      {room.gameMode === GameMode.FAKER && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <p
            style={{
              marginBottom: '10px',
              color: theme.colors.darkGray,
              fontSize: '14px',
            }}
          >
            {(() => {
              const fakerCount = Math.floor(roomPlayers.length / 3);
              if (roomPlayers.length < 3) {
                return '최소 3명 이상의 플레이어가 필요해요';
              } else {
                return `페이커 ${fakerCount}명, 키퍼 ${
                  roomPlayers.length - fakerCount
                }명`;
              }
            })()}
          </p>
        </div>
      )}

      <SmallButton
        backgroundColor={theme.colors.lightYellow}
        onClick={onGameStartButtonHandler}
        disabled={
          !isRoomHost ||
          (room.gameMode === GameMode.FAKER && roomPlayers.length < 1)
        }
      >
        게임 시작
      </SmallButton>

      <Spacer y={10} />

      <SmallButton
        backgroundColor={theme.colors.lightRed}
        onClick={onExitRoomButtonHandler}
      >
        나가기
      </SmallButton>
    </>
  );
};
