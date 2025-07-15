import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sketchbook } from '../../components/sketchbook/Sketchbook';
import {
  GameMode,
  GameStatus,
  parsePlayer,
  parseRoom,
  Player,
} from '../../types/game';
import { useTheme } from '@emotion/react';
import { UserInput } from '../../components/UserInput';
import { GenerateButton } from '../../components/GenerateButton';
import { SmallButton } from '../../components/Button';
import spinnerImage from '../../assets/images/spinner.svg';
import { axiosInstance } from '../../hooks/useAxios';
import { useRoom } from '../../context/RoomContext';
import { FullScreenPopup } from '../../components/FullScreenPopup';
import { AnswerInput } from './index.styles';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { BlackSketchbook } from '../../components/sketchbook/BlackSketchbook';
import { useSocketContext } from '../../context/SocketContext';

interface GamePageState {
  roomId: string;
}

const LOADING_QUOTES = ['사막에 커피 한 잔만 가져갈 수 있다면?'];

const EXAMPLE_GENERATED_IMAGE_ID = 'example-image-id-12345';

const IMAGE_GEN_MAX_TRIES = 3;

const getGameModeName = (mode: number): string => {
  switch (mode) {
    case 0:
      return '기본 모드';
    case 1:
      return '페이커 모드';
    default:
      return '알 수 없는 모드';
  }
};

export const GamePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { setLoading } = useUI();
  const location = useLocation() as { state: GamePageState };

  const { joinRoom, isConnected } = useSocketContext();
  const { room, setRoom, roomPlayers, setRoomPlayers } = useRoom();
  const { player } = useAuth();

  const [isMyTurn, setIsMyTurn] = useState(true);

  const [answerInput, setAnswerInput] = useState('');

  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [generatedImageId, setGeneratedImageId] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null
  );

  const [userInput, setUserInput] = useState('');
  const [imageGenRemain, setImageGenRemain] = useState(IMAGE_GEN_MAX_TRIES);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!location.state || !location.state.roomId || !player) {
      alert('잘못된 접근입니다.');
      navigate('/');
      return;
    }

    const roomId = location.state.roomId;
    console.log('Game page loaded with roomId:', roomId);

    if (isConnected) {
      joinRoom(roomId);
    }

    const fetchRoomData = async () => {
      try {
        const res = (await axiosInstance.get(`/rooms/${roomId}`)).data;
        const roomData = parseRoom(res.room);
        const roomPlayersData = res.players.map((p: any) => parsePlayer(p));

        setRoom(roomData);
        setRoomPlayers(roomPlayersData);

        console.log('Room data:', roomData);
        console.log('Room players:', roomPlayersData);
      } catch (err) {
        console.error('Failed to fetch room data:', err);
        alert('방 정보를 불러오는데 실패했습니다.');
        navigate('/');
      }
    };

    fetchRoomData();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isConnected, location.state, player, navigate]);

  // room이 바뀔 때마다 isMyTurn 업데이트
  useEffect(() => {
    if (room && player) {
      setIsMyTurn(room.responsePlayerIds[room.turnPlayerIndex] === player.id);
      console.log(
        'Turn updated - isMyTurn:',
        room.responsePlayerIds[room.turnPlayerIndex] === player.id,
        'turnPlayerId:',
        room.responsePlayerIds[room.turnPlayerIndex]
      );
    }
  }, [room, player]);

  const [upFlipping, setUpFlipping] = useState(false);
  const [downFlipping, setDownFlipping] = useState(false);

  const flipUpPage = (callback?: () => void) => {
    setUpFlipping(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setUpFlipping(false);
      if (callback) callback();
    }, 500);
  };
  const flipDownPage = (callback?: () => void) => {
    setDownFlipping(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDownFlipping(false);
      if (callback) callback();
    }, 500);
  };

  const submitAnswerButtonHandler = async () => {
    if (!room) {
      alert('오류가 발생하였습니다. 다시 시도해주세요.');
      return;
    }
    if (!isMyTurn) {
      alert('당신의 차례가 아닙니다.');
      return;
    }
    if (answerInput.trim() === '') {
      alert('제시어를 입력해주세요.');
      return;
    }

    try {
      await axiosInstance.post(`/games/${room.id}/answer`, {
        answer: answerInput,
      });
    } catch (err) {
      console.error('Failed to submit answer:', err);
      alert('오류가 발생하였습니다. 다시 시도해주세요.');
      return;
    }
  };

  const generateImageButtonHandler = async () => {
    if (!room) {
      alert('오류가 발생하였습니다. 다시 시도해주세요.');
      return;
    }
    if (!isMyTurn || isImageGenerating || imageGenRemain <= 0) return;

    if (userInput.trim() === '') {
      alert('이미지 생성에 사용할 제시어를 입력해주세요.');
      return;
    }

    setIsImageGenerating(true);
    setImageGenRemain(prev => prev - 1);

    const res = (
      await axiosInstance.post(`/games/${room.id}/inputs`, {
        input: userInput,
      })
    ).data;

    flipDownPage(() => {
      setGeneratedImageId(res.file_id);
      setGeneratedImageUrl(res.file_url);
      setIsImageGenerating(false);
    });
  };

  const onConfirmImageButtonHandler = async () => {
    if (!room) {
      alert('오류가 발생하였습니다. 다시 시도해주세요.');
      return;
    }
    if (!isMyTurn || !generatedImageId) return;

    try {
      await axiosInstance.post(`/games/${room.id}/images`, {
        input: userInput,
        file_id: generatedImageId,
      });
      setUserInput('');
    } catch (err) {
      console.error('Failed to confirm image:', err);
      alert('오류가 발생하였습니다. 다시 시도해주세요.');
      return;
    }
  };

  if (!isConnected || !room || !roomPlayers || roomPlayers.length === 0) {
    setLoading(true);
    return <></>;
  }

  setLoading(false);
  return (
    <>
      <FullScreenPopup
        open={room.gameStatus === GameStatus.ANSWER_INPUT && isMyTurn}
      >
        <p
          style={{
            fontSize: '20px',
            margin: '10px',
            textAlign: 'center',
          }}
        >
          첫 제시어를 입력해 주세요!
        </p>
        <AnswerInput
          value={answerInput}
          onChange={e => {
            setAnswerInput(e.target.value);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              submitAnswerButtonHandler();
            }
          }}
        />
        <SmallButton
          backgroundColor={theme.colors.lighterYellow}
          onClick={submitAnswerButtonHandler}
        >
          제출하기
        </SmallButton>
      </FullScreenPopup>
      <p style={{ fontSize: '23px', margin: '15px' }}>
        {getGameModeName(room.gameMode)}
        {room.gameMode === GameMode.FAKER && (
          <span style={{ fontSize: '19px' }}>
            &nbsp;({room.roundNumber}라운드)
          </span>
        )}
      </p>

      <Sketchbook
        show={true}
        flipping={upFlipping}
        height="260px"
        width="380px"
        ringCount={11}
      >
        {(() => {
          if (!room.responsePlayerIds || !roomPlayers) {
            setLoading(true);
            return <></>;
          }
          setLoading(false);
          if (room.gameStatus === GameStatus.ANSWER_INPUT) {
            const currentPlayer = roomPlayers.find(
              player =>
                player.id === room.responsePlayerIds[room.turnPlayerIndex]
            );
            if (!currentPlayer) {
              setLoading(true);
              return <></>;
            }
            setLoading(false);
            return (
              <BlackSketchbook>
                <div>
                  <p
                    style={{
                      fontSize: '18px',
                      color: theme.colors.darkGray,
                      textAlign: 'center',
                    }}
                  >
                    {currentPlayer.name}가 제시어를 입력하고 있어요
                  </p>
                </div>
              </BlackSketchbook>
            );
          }

          if (isMyTurn) {
            if (room.turnPlayerIndex === 0) {
              return (
                <BlackSketchbook>
                  <p
                    style={{
                      fontSize: '18px',
                      color: theme.colors.darkGray,
                      textAlign: 'center',
                    }}
                  >
                    아직 아무도 그림을 그리지 않았네요
                  </p>
                </BlackSketchbook>
              );
            }

            const previousIndex = room.turnPlayerIndex - 1;
            const previousPlayer = roomPlayers.find(
              player => player.id === room.responsePlayerIds[previousIndex]
            );

            if (!previousPlayer || !room.responsePlayerFileIds[previousIndex]) {
              setLoading(true);
              return <></>;
            }
            setLoading(false);
            return (
              <BlackSketchbook>
                <p>{previousPlayer.name}이 그린 그림</p>
                <img
                  src={room.responsePlayerFileIds[previousIndex]}
                  alt="Previous Generated Image"
                  style={{
                    width: '100%',
                    height: '150px',
                    background: 'red',
                    margin: '10px 0',
                  }}
                />
              </BlackSketchbook>
            );
          } else {
            const currentPlayer = roomPlayers.find(
              player =>
                player.id === room.responsePlayerIds[room.turnPlayerIndex]
            );

            if (!currentPlayer) {
              setLoading(true);
              return <></>;
            }
            setLoading(false);
            return (
              <BlackSketchbook>
                <p style={{ fontSize: '17px', color: theme.colors.darkGray }}>
                  {currentPlayer.name}이 그림을 그리고 있어요
                </p>
                <p style={{ fontSize: '17px', color: theme.colors.black }}>
                  {
                    LOADING_QUOTES[
                      Math.floor(Math.random() * LOADING_QUOTES.length)
                    ]
                  }
                </p>
              </BlackSketchbook>
            );
          }
        })()}
      </Sketchbook>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '10px',
          margin: '15px',
        }}
      >
        <UserInput
          value={userInput}
          onChange={value => {
            setUserInput(value);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              generateImageButtonHandler();
            }
          }}
          disabled={!isMyTurn || isImageGenerating || imageGenRemain <= 0}
        />
        <GenerateButton
          onClick={generateImageButtonHandler}
          maxTries={IMAGE_GEN_MAX_TRIES}
          remain={imageGenRemain}
          disabled={!isMyTurn || isImageGenerating || imageGenRemain <= 0}
        />
      </div>

      <Sketchbook
        show={isMyTurn}
        flipping={downFlipping}
        height="290px"
        width="380px"
        ringCount={11}
      >
        {isImageGenerating ? (
          <BlackSketchbook>
            <p
              style={{
                fontSize: '18px',
                color: theme.colors.darkGray,
                textAlign: 'center',
              }}
            >
              이미지 생성 중
            </p>
            <img
              src={spinnerImage}
              alt="Generated"
              style={{
                width: '50px',
                height: '50px',
              }}
            />
          </BlackSketchbook>
        ) : generatedImageId && generatedImageUrl ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '10px',
            }}
          >
            <p>당신이 그린 그림</p>
            <img
              src={generatedImageUrl}
              alt="Generated"
              style={{
                width: '100%',
                height: '150px',
                margin: '10px 0',
              }}
            />
            <SmallButton
              backgroundColor={theme.colors.lighterYellow}
              onClick={onConfirmImageButtonHandler}
            >
              확정하기
            </SmallButton>
          </div>
        ) : (
          <BlackSketchbook>
            <p
              style={{
                fontSize: '18px',
                color: theme.colors.darkGray,
                textAlign: 'center',
                lineHeight: '1.5',
              }}
            >
              아직 생성된 이미지가 없습니다.
              <br />
              "생성"을 눌러 이미지를 만들어 보세요.
            </p>
          </BlackSketchbook>
        )}
      </Sketchbook>
    </>
  );
};
