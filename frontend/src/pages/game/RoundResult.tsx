import { SketchbookCarousel } from '../../components/sketchbook/SketchbookCarousel';
import { Spacer } from '../../components/Spacer';
import { SmallButton } from '../../components/Button';
import { useTheme } from '@emotion/react';
import { createPortal } from 'react-dom';
import {
  GameMode,
  GameStatus,
  parsePlayer,
  parseRoom,
  Room,
} from '../../types/game';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { axiosInstance } from '../../hooks/useAxios';
import { useRoom } from '../../context/RoomContext';
import { useSocketContext } from '../../context/SocketContext';
import { useEffect } from 'react';

interface RoundResultPopupProps {
  open: boolean;
}

export const RoundResultPopup = ({ open }: RoundResultPopupProps) => {
  const theme = useTheme();
  const { player } = useAuth();
  const { room, setRoom, setRoomPlayers } = useRoom();
  const { joinRoom } = useSocketContext();
  const { setLoading } = useUI();

  useEffect(() => {
    setLoading(open && (!room || !player));
  }, [open, room, player]);

  if (!room || !player) {
    return <></>;
  }
  return open
    ? createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <div
            style={{
              position: 'relative',
              height: '100vh',
              margin: '0 auto',
              padding: '0 15px',
              width: '412px',
              background: '#ededed',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <p
              style={{
                fontSize: '30px',
                marginTop: 40,
                marginBottom: 100,
              }}
            >
              {room.gameMode === GameMode.BASIC ? '게임' : '라운드'} 결과
            </p>
            <SketchbookCarousel />

            <Spacer y={100} />

            <SmallButton
              backgroundColor={theme.colors.lightYellow}
              onClick={async () => {
                if (room.gameMode === GameMode.BASIC) {
                  // Handle replay logic
                  const res = (await axiosInstance.post(`/rooms/${room.id}`))
                    .data;
                  const parsedRoom = parseRoom(res.room);
                  setRoom(parsedRoom);
                  setRoomPlayers(res.players.map((p: any) => parsePlayer(p)));
                  joinRoom(parsedRoom.id);
                  // setLoading(false);
                } else {
                  if (room.gameStatus === GameStatus.FINISHED) {
                    // Handle view results logic
                  } else {
                    // Handle next round logic
                    if (room.hostPlayerId === player.id) {
                      try {
                        await axiosInstance.post(`/games/${room.id}/rounds`);
                      } catch (err) {
                        console.error('Failed to start next round:', err);
                        alert('오류가 발생하였습니다. 다시 시도해주세요.');
                      }
                    } else {
                      alert('방장 대기 중입니다.');
                    }
                  }
                }
              }}
              disabled={
                room.gameMode === GameMode.BASIC
                  ? false
                  : room.gameStatus !== GameStatus.FINISHED &&
                    room.hostPlayerId !== player.id
              }
            >
              {room.gameMode === GameMode.BASIC
                ? '다시하기'
                : room.gameStatus !== GameStatus.FINISHED
                ? room.hostPlayerId === player.id
                  ? '다음 라운드'
                  : '방장 대기 중'
                : '결과 보기'}
            </SmallButton>
          </div>
        </div>,
        document.body
      )
    : null;
};
