import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sketchbook } from '../../components/sketchbook/Sketchbook';
import { Spacer } from '../../components/Spacer';
import { GAME_MODE, GAME_STATUS } from '../../types/gameType';
import { useTheme } from '@emotion/react';
import { UserInput } from '../../components/UserInput';
import { GenerateButton } from '../../components/GenerateButton';

interface GamePageState {
  partyId: string;
}

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
  const location = useLocation() as { state: GamePageState };

  const [isMyTurn, setIsMyTurn] = useState(false);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [generatedImageId, setGeneratedImageId] = useState<string | null>(null);

  const [userInput, setUserInput] = useState('');
  const [imageGenRemain, setImageGenRemain] = useState(IMAGE_GEN_MAX_TRIES);

  useEffect(() => {
    if (!location.state || !location.state.partyId) {
      alert('잘못된 접근입니다.');
      navigate('/');
    }
  }, [location, navigate]);

  console.log('GamePage mounted with partyId:', location.state?.partyId);

  const game_data = EXAMPLE_GAME_DATA; // Replace with actual data fetching logic

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

      <Sketchbook show={true} flipping={false} height="280px">
        {isMyTurn ? (
          <p style={{ fontSize: '20px', color: 'green' }}>내 차례입니다!</p>
        ) : (
          <p style={{ fontSize: '20px', color: 'red' }}>
            아직 내 차례가 아닙니다.
          </p>
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
          disabled={!isMyTurn || isImageGenerating}
        />
        <GenerateButton
          onClick={() => {}}
          maxTries={IMAGE_GEN_MAX_TRIES}
          remain={imageGenRemain}
          disabled={!isMyTurn || isImageGenerating}
        />
      </div>

      <Sketchbook show={isMyTurn} flipping={false} height="280px">
        {isImageGenerating ? (
          <p style={{ fontSize: '20px', color: 'blue' }}>이미지 생성 중...</p>
        ) : generatedImageId ? (
          <img
            src={generatedImageId}
            alt="Generated"
            style={{ width: '100%', height: 'auto' }}
          />
        ) : (
          <p style={{ fontSize: '20px', color: 'gray' }}>
            아직 생성된 이미지가 없습니다.
          </p>
        )}
      </Sketchbook>
    </>
  );
};
