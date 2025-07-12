import React, { useEffect } from 'react';
import { SketchbookCarousel } from '../../components/sketchbook/SketchbookCarousel';
import { useLocation, useNavigate } from 'react-router-dom';
import { EXAMPLE_GAME_DATA } from '../../types/mockData';
import { Spacer } from '../../components/Spacer';
import { SmallButton } from '../../components/Button';
import { useTheme } from '@emotion/react';

interface RoundResultPageState {
  partyId: string;
}

export const RoundResultPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation() as { state: RoundResultPageState };

  const game_data = EXAMPLE_GAME_DATA;

  const onGetWinnerButtonHandler = () => {
    navigate('/game/result');
  };

  //   useEffect(() => {
  //     if (!location.state || !location.state.partyId) {
  //       alert('잘못된 접근입니다.');
  //       navigate('/');
  //     }
  //   }, [location, navigate]);

  return (
    <>
      <p
        style={{
          fontSize: '30px',
          marginTop: 40,
          marginBottom: 100,
        }}
      >
        게임 결과
      </p>
      <SketchbookCarousel />

      <Spacer y={100} />

      <SmallButton
        backgroundColor={theme.colors.lightYellow}
        onClick={onGetWinnerButtonHandler}
      >
        승자는?
      </SmallButton>
    </>
  );
};
