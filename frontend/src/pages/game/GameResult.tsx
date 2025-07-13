import { useLocation } from 'react-router-dom';
import { SmallButton } from '../../components/Button';
import { Footer } from '../../components/Footer';
import { Sketchbook } from '../../components/sketchbook/Sketchbook';
import { Spacer } from '../../components/Spacer';
import { theme } from '../../styles/theme';
import { getAvartarTypeFromId, getAvatarImage } from '../../types/avatar';
import { EXAMPLE_GAME_DATA, EXAMPLE_PLAYER_INFOS } from '../../types/mockData';

interface GameResultPageState {}

export const GameResultPage = () => {
  const location = useLocation() as { state: GameResultPageState };
  const game_data = EXAMPLE_GAME_DATA;

  const winner_ids = game_data.player_keeper_ids.slice(0, 3);
  const winners = EXAMPLE_PLAYER_INFOS.filter(response =>
    winner_ids.includes(response.id)
  );

  //   useEffect(() => {
  //     if (!location.state || !location.state.roomId) {
  //       alert('잘못된 접근입니다.');
  //       navigate('/');
  //     }
  //   }, [location, navigate]);

  const onReplayButtonHandler = () => {};

  const onHomeButtonHandler = () => {};

  return (
    <>
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
          <img
            src={getAvatarImage(getAvartarTypeFromId(winners[0].avatarId))}
            alt="Winner Avatar 1"
            style={{
              width: '160px',
              height: '160px',
              position: 'absolute',
            }}
          />
          <img
            src={getAvatarImage(getAvartarTypeFromId(winners[1].avatarId))}
            alt="Winner Avatar 2"
            style={{
              width: '160px',
              height: '160px',
              position: 'absolute',
              top: '60px',
              left: '50px',
            }}
          />
          <img
            src={getAvatarImage(getAvartarTypeFromId(winners[2].avatarId))}
            alt="Winner Avatar 3"
            style={{
              width: '160px',
              height: '160px',
              position: 'absolute',
              top: '120px',
            }}
          />
        </div>

        <p
          style={{
            fontSize: '30px',
            marginBottom: '20px',
          }}
        >
          승리!
        </p>

        <SmallButton
          backgroundColor={theme.colors.lightYellow}
          onClick={onReplayButtonHandler}
        >
          다시하기
        </SmallButton>
        <Spacer y={10} />
        <SmallButton
          backgroundColor={theme.colors.lighterYellow}
          onClick={onHomeButtonHandler}
        >
          처음으로
        </SmallButton>
      </Sketchbook>
      <Footer show={true} />
    </>
  );
};
