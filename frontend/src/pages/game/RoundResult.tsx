import { SketchbookCarousel } from '../../components/sketchbook/SketchbookCarousel';
import { Spacer } from '../../components/Spacer';
import { SmallButton } from '../../components/Button';
import { useTheme } from '@emotion/react';
import { createPortal } from 'react-dom';
import {
  FakerModeTeamType,
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
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameResultPopup } from './GameResult';

interface RoundResultPopupProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const RoundResultPopup = ({ open, setOpen }: RoundResultPopupProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { player } = useAuth();
  const { room, setRoom, setRoomPlayers } = useRoom();
  const { leaveRoom } = useSocketContext();
  const { setLoading } = useUI();

  const [showGameResult, setShowGameResult] = useState(false);

  const [doneSubmitWinner, setDoneSubmitWinner] = useState(false);

  const submitRoundWinner = async (winnerType: FakerModeTeamType) => {
    if (!room || !player) return;

    try {
      await axiosInstance.put(`/games/${room.id}/rounds`, {
        winner_type: winnerType,
      });
      setDoneSubmitWinner(true);
    } catch (err) {
      console.error('Failed to submit round winner:', err);
      alert('오류가 발생하였습니다. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    setLoading(open && (!room || !player));
  }, [open, room, player]);

  if (!room || !player) {
    return <></>;
  }
  return (
    <>
      {open &&
        createPortal(
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
                  marginBottom: 80,
                }}
              >
                {room.gameMode === GameMode.BASIC
                  ? '게임'
                  : `${room.roundNumber}라운드`}{' '}
                결과
              </p>
              <SketchbookCarousel />

              {room.gameMode === GameMode.FAKER ? (
                room.roundWinners.length < room.roundNumber ? (
                  room.hostPlayerId == player.id ? (
                    <>
                      <div
                        style={{
                          backgroundColor: theme.colors.yellowWhite,
                          padding: '8px',
                          borderRadius: '10px',
                          boxShadow: theme.shadows.default,
                          border: `2px solid ${theme.colors.black}`,
                          zIndex: 1000,
                        }}
                      >
                        <p
                          style={{
                            fontSize: '18px',
                            marginBottom: '10px',
                            textAlign: 'center',
                          }}
                        >
                          승리 팀을 정해 주세요
                        </p>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '10px',
                            borderRadius: '10px',
                          }}
                        >
                          <SmallButton
                            backgroundColor={theme.colors.lightGreen}
                            onClick={() =>
                              submitRoundWinner(FakerModeTeamType.KEEPER)
                            }
                          >
                            KEEPER
                          </SmallButton>
                          <SmallButton
                            backgroundColor={theme.colors.lightRed}
                            onClick={() =>
                              submitRoundWinner(FakerModeTeamType.FAKER)
                            }
                          >
                            FAKER
                          </SmallButton>
                        </div>
                      </div>
                      <Spacer y={20} />
                    </>
                  ) : (
                    <p
                      style={{
                        fontSize: '18px',
                        color: theme.colors.darkGray,
                        marginTop: '40px',
                        marginBottom: '20px',
                      }}
                    >
                      방장이 승패를 정하고 있어요
                    </p>
                  )
                ) : (
                  <>
                    <Spacer y={40} />
                    <p style={{ fontSize: '20px' }}>
                      {room.roundWinners[room.roundWinners.length - 1] ===
                      FakerModeTeamType.KEEPER ? (
                        <span style={{ color: 'green' }}>키퍼</span>
                      ) : (
                        <span style={{ color: 'red' }}>페이커</span>
                      )}{' '}
                      승리!
                    </p>
                    <Spacer y={20} />
                  </>
                )
              ) : (
                <Spacer y={80} />
              )}
              <SmallButton
                backgroundColor={theme.colors.lightYellow}
                onClick={async () => {
                  setOpen(false);
                  if (room.gameMode === GameMode.BASIC) {
                    navigate('/', {
                      state: { pageIdx: 2 },
                    });
                  } else {
                    setDoneSubmitWinner(false);
                    if (room.gameStatus === GameStatus.FINISHED) {
                      // Handle view results logic
                      setOpen(false);
                      setShowGameResult(true);
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
                    : room.hostPlayerId !== player.id
                    ? true
                    : !doneSubmitWinner
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
            </div>
          </div>,
          document.body
        )}
      <GameResultPopup open={showGameResult} setOpen={setShowGameResult} />
    </>
  );
};
