import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sketchbook } from '../../components/sketchbook/Sketchbook';
import { Spacer } from '../../components/Spacer';
import { GAME_MODE, GAME_STATUS } from '../../types/gameType';
import { useTheme } from '@emotion/react';
import { UserInput } from '../../components/UserInput';
import { GenerateButton } from '../../components/GenerateButton';
import { SmallButton } from '../../components/Button';
import spinnerImage from '../../assets/images/spinner.svg';

interface GamePageState {
  partyId: string;
}

const EXAMPLE_PLAYER_INFOS = [
  {
    id: 1,
    username: '애벌레 1',
    avatarId: 0,
    isMember: true,
    totalGames: 10,
    totalWins: 5,
  },
  {
    id: 2,
    username: '애벌레 2',
    avatarId: 1,
    isMember: true,
    totalGames: 8,
    totalWins: 3,
  },
  {
    id: 3,
    username: '애벌레 3',
    avatarId: 2,
    isMember: true,
    totalGames: 12,
    totalWins: 6,
  },
  {
    id: 4,
    username: '애벌레 4',
    avatarId: 3,
    isMember: true,
    totalGames: 5,
    totalWins: 2,
  },
];

const EXAMPLE_GAME_DATA = {
  game_mode: GAME_MODE.BASIC,
  round_number: 1,
  game_status: GAME_STATUS.PLAYING,
  round_answer: '커피',
  player_keeper_ids: [1, 2, 3, 4],
  player_faker_ids: [5, 6],
  player_responses: [
    {
      id: '1',
      input: '귀여운 강아지',
      file_id: '../../assets/images/larva-0.png',
    },
    {
      id: '2',
      input: '귀여운 애벌레',
      file_id: '../../assets/images/larva-1.png',
    },
    {
      id: '3',
      input: null,
      file_id: null,
    },
    {
      id: '4',
      input: null,
      file_id: null,
    },
  ],
  round_turn_player_id: 1,
};

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
  const location = useLocation() as { state: GamePageState };

  const [isMyTurn, setIsMyTurn] = useState(true);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [generatedImageId, setGeneratedImageId] = useState<string | null>(null);

  const [userInput, setUserInput] = useState('');
  const [imageGenRemain, setImageGenRemain] = useState(IMAGE_GEN_MAX_TRIES);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

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

  useEffect(() => {
    if (!location.state || !location.state.partyId) {
      alert('잘못된 접근입니다.');
      navigate('/');
    }
  }, [location, navigate]);

  console.log('GamePage mounted with partyId:', location.state?.partyId);

  const game_data = EXAMPLE_GAME_DATA; // Replace with actual data fetching logic

  const generateImageButtonHandler = () => {
    if (!isMyTurn || isImageGenerating || imageGenRemain <= 0) return;

    setIsImageGenerating(true);
    setImageGenRemain(prev => prev - 1);

    // Simulate image generation
    setTimeout(() => {
      flipDownPage(() => {
        setGeneratedImageId(EXAMPLE_GENERATED_IMAGE_ID);
        setIsImageGenerating(false);
      });
    }, 2000); // Simulate a delay for image generation
  };

  const onConfirmImageButtonHandler = () => {
    if (!generatedImageId) return;
    // Handle image confirmation logic here
  };

  return (
    <>
      <p style={{ fontSize: '23px', margin: '15px' }}>
        {getGameModeName(game_data.game_mode)}
        {game_data.game_mode === GAME_MODE.FAKER && (
          <span style={{ fontSize: '19px' }}>
            &nbsp;({game_data.round_number}라운드)
          </span>
        )}
      </p>

      <Sketchbook show={true} flipping={upFlipping} height="260px">
        {isMyTurn ? (
          (() => {
            const previousResponse =
              game_data.player_responses[game_data.round_turn_player_id - 1];
            const previousPlayer = EXAMPLE_PLAYER_INFOS.find(
              player => player.id === game_data.round_turn_player_id
            );

            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '10px',
                }}
              >
                <p>{previousPlayer?.username}이 그린 그림</p>
                <img
                  src={
                    game_data.player_responses[
                      game_data.round_turn_player_id - 1
                    ].file_id || ''
                  }
                  alt="Previous Generated Image"
                  style={{
                    width: '100%',
                    height: '150px',
                    background: 'red',
                    margin: '10px 0',
                  }}
                />
              </div>
            );
          })()
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#D5D5D5',
              gap: '30px',
            }}
          >
            <p style={{ fontSize: '17px', color: theme.colors.darkGray }}>
              애벌레 1이 그림을 그리고 있습니다
            </p>
            <p style={{ fontSize: '17px', color: theme.colors.black }}>
              {
                LOADING_QUOTES[
                  Math.floor(Math.random() * LOADING_QUOTES.length)
                ]
              }
            </p>
          </div>
        )}
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
            console.log('User input changed:', value);
            setUserInput(value);
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

      <Sketchbook show={isMyTurn} flipping={downFlipping} height="290px">
        {isImageGenerating ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#D5D5D5',
            }}
          >
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
          </div>
        ) : generatedImageId ? (
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
              src={generatedImageId}
              alt="Generated"
              style={{
                width: '100%',
                height: '150px',
                background: 'red',
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
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#D5D5D5',
            }}
          >
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
          </div>
        )}
      </Sketchbook>
    </>
  );
};
