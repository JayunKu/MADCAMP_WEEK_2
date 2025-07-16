import { SmallButton } from '../../components/Button';
import { Sketchbook } from '../../components/sketchbook/Sketchbook';
import { Spacer } from '../../components/Spacer';
import { theme } from '../../styles/theme';
import { getAvatarTypeFromId, getAvatarImage } from '../../types/avatar';
import { createPortal } from 'react-dom';
import { useRoom } from '../../context/RoomContext';
import { useUI } from '../../context/UIContext';
import { GameMode, FakerModeTeamType } from '../../types/game';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocketContext } from '../../context/SocketContext';
import { axiosInstance } from '../../hooks/useAxios';

interface GameResultPageProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const GameResultPopup = ({ open, setOpen }: GameResultPageProps) => {
  const navigate = useNavigate();
  const { leaveRoom } = useSocketContext();
  const { room, roomPlayers, setRoom, setRoomPlayers } = useRoom();
  const { setLoading } = useUI();

  useEffect(() => {
    setLoading(open && (!room || !roomPlayers));
  }, [open, room, roomPlayers]);

  if (!room || !roomPlayers) {
    return <> </>;
  }

  // 승리 조건 판단
  const getWinners = () => {
    if (room.gameMode === GameMode.BASIC) {
      // 기본 모드: 상위 3명이 승리
      return {
        winnerIds: room.responsePlayerIds.slice(0, 3),
        winnerType: FakerModeTeamType.KEEPER,
        message: '승리!',
      };
    } else {
      // 페이커 모드: roundWinners 배열의 합으로 승리 팀 결정
      const winnerSum = room.roundWinners.reduce(
        (sum, winner) => sum + winner,
        0
      );
      const isFakerWin = winnerSum > room.roundWinners.length / 2;

      if (isFakerWin) {
        return {
          winnerIds: room.fakersPlayerIds,
          winnerType: FakerModeTeamType.FAKER,
          message: (
            <p>
              <span style={{ color: 'red' }}>페이커</span> 승리!
            </p>
          ),
        };
      } else {
        return {
          winnerIds: room.keeperPlayerIds,
          winnerType: FakerModeTeamType.KEEPER,
          message: (
            <p>
              <span style={{ color: 'green' }}>키퍼</span> 승리!
            </p>
          ),
        };
      }
    }
  };

  const { winnerIds, winnerType, message } = getWinners();
  const winners = roomPlayers.filter(p => winnerIds.includes(p.id));

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
            <Spacer y={80} />
            <Sketchbook
              flipping={false}
              height="500px"
              width="360px"
              ringCount={11}
              show={true}
            >
              <div
                style={{
                  position: 'relative',
                  width: '210px',
                  height: '280px',
                  marginTop: '20px',
                }}
              >
                {winners.slice(0, 3).map((winner, index) => (
                  <img
                    key={winner.id}
                    src={getAvatarImage(
                      getAvatarTypeFromId(
                        winner.avatarId,
                        winnerType === FakerModeTeamType.FAKER
                      )
                    )}
                    alt={`Winner Avatar ${index + 1}`}
                    style={{
                      width: '160px',
                      height: '160px',
                      position: 'absolute',
                      top: index === 0 ? '0px' : index === 1 ? '60px' : '120px',
                      left: index === 1 ? '50px' : '0px',
                    }}
                  />
                ))}
              </div>

              <p
                style={{
                  fontSize: '30px',
                  marginBottom: '20px',
                }}
              >
                {message}
              </p>

              <SmallButton
                backgroundColor={theme.colors.lightYellow}
                onClick={async () => {
                  setOpen(false);
                  navigate('/', {
                    state: { pageIdx: 2 },
                  });
                }}
              >
                다시하기
              </SmallButton>
              <Spacer y={10} />
              <SmallButton
                backgroundColor={theme.colors.lightRed}
                onClick={async () => {
                  setOpen(false);
                  setRoom(null);
                  setRoomPlayers(null);
                  navigate('/');

                  leaveRoom();
                  await axiosInstance.delete(`/rooms/${room.id}/me`);
                }}
              >
                나가기
              </SmallButton>
            </Sketchbook>
          </div>
        </div>,
        document.body
      )
    : null;
};
