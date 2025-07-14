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
import { GameSocket, useGameSocket } from '../../hooks/useGameSocket';
import { axiosInstance } from '../../hooks/useAxios';

const MAX_PLAYER_PER_ROOM = 8; // 최대 플레이어 수

interface RoomPageProps {
  flipToPage: (page: number) => void;
  toggleSketchbook: (callback: () => void) => void;
  gameSocket: GameSocket;
}

export const RoomPage = ({
  flipToPage,
  toggleSketchbook,
  gameSocket,
}: RoomPageProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { setLoading, setShowFooter } = useUI();
  const { player } = useAuth();
  const { room, roomPlayers, setRoomPlayers, setRoom } = useRoom();

  const { leaveRoom } = gameSocket;

  const [isRoomHost, setIsRoomHost] = useState(false);
  const [selectedGameMode, setSelectedGameMode] = useState(GameMode.BASIC);

  useEffect(() => {
    if (!room || !player) return;
    console.log('Room updated:', room);

    setIsRoomHost(room.hostPlayerId === player.id);
    setSelectedGameMode(room.gameMode);
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

  const onGameStartButtonHandler = () => {
    if (!isRoomHost) {
      alert('방장만 게임을 시작할 수 있습니다.');
      return;
    }

    setShowFooter(false);
    toggleSketchbook(() => {
      navigate('/game', { state: { roomId: 'FDAS32D' } });
    });
  };

  const onExitRoomButtonHandler = async () => {
    setLoading(true);
    if (!player || !player.roomId) {
      alert('오류가 발생하였습니다. 다시 시도해주세요.');
      return;
    }

    try {
      await axiosInstance.delete(`/rooms/${player.roomId}/me`);
      console.log('Left room:', player.roomId);
    } catch (err) {
      console.error('Failed to leave room:', err);
      alert('오류가 발생하였습니다. 다시 시도해주세요.');
    }
    leaveRoom();
    setRoom(null);
    setRoomPlayers(null);
    setLoading(false);
    flipToPage(0);
  };

  return !room || !roomPlayers || !player ? (
    <></>
  ) : (
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
                totalGames={10} // 임시 데이터
                totalWins={5} // 임시 데이터
                onMakeHost={() => {}}
                onDeletePlayer={() => {}}
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
                onDeletePlayer={() => {}}
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
        <p style={{ width: '100%', marginTop: '15px' }}>게임 옵션 선택</p>
      </GameSettings>

      <SmallButton
        backgroundColor={theme.colors.lightYellow}
        onClick={onGameStartButtonHandler}
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
