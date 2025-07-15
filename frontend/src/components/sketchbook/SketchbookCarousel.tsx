import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Sketchbook } from './Sketchbook';
import { useTheme } from '@emotion/react';
import { Spacer } from '../Spacer';
import { useRoom } from '../../context/RoomContext';
import { useUI } from '../../context/UIContext';
import { Player } from '../../types/game';

const KOREAN_ORDINALS = [
  '첫번째',
  '두번째',
  '세번째',
  '네번째',
  '다섯번째',
  '여섯번째',
  '일곱번째',
  '여덟번째',
];

export const SketchbookCarousel = () => {
  const theme = useTheme();
  const { setLoading } = useUI();
  const { room, roomPlayers } = useRoom();
  const [centerIdx, setCenterIdx] = useState(0);

  useEffect(() => {
    setLoading(!room || !roomPlayers);
  }, [room, roomPlayers]);

  if (!room || !roomPlayers) return <></>;

  console.log('room players', roomPlayers);
  const total = room.responsePlayerIds.length;

  const gameResponses = room.responsePlayerIds.map((playerId, index) => {
    const player = roomPlayers.find(p => p.id === playerId) as Player;
    return {
      name: player.name,
      input: room.responsePlayerInputs[index],
      file_url: room.responsePlayerFileUrls[index],
    };
  });

  const getVisibleIndices = () => {
    return [
      centerIdx - 1 >= 0 ? centerIdx - 1 : null,
      centerIdx,
      centerIdx + 1 < total ? centerIdx + 1 : null,
    ];
  };

  const visibleIndices = getVisibleIndices();

  return (
    <SketchbookList>
      {visibleIndices.map((idx, i) => {
        if (idx === null) {
          return <SketchbookItem key={`empty-${i}`} $center={false} />;
        }

        const resp = gameResponses[idx];
        const isCenter = idx === centerIdx;

        return (
          <SketchbookItem
            key={idx}
            $center={isCenter}
            onClick={() => setCenterIdx(idx)}
          >
            <Sketchbook
              flipping={false}
              show={true}
              height="330px"
              width="230px"
              ringCount={7}
            >
              <Spacer y={10} />
              <p
                style={{
                  fontSize: '14px',
                  color: theme.colors.darkGray,
                  marginBottom: '4px',
                }}
              >
                {KOREAN_ORDINALS[idx]}
              </p>
              <p
                style={{
                  fontSize: '18px',
                  marginBottom: '10px',
                }}
              >
                {resp.name}이 그린 그림
              </p>
              <img
                src={resp.file_url}
                alt="Player Image"
                style={{
                  width: '100%',
                  height: '180px',
                  padding: '0 15px',
                  objectFit: 'contain',
                }}
              />
              <p
                style={{
                  fontSize: '18px',
                  marginTop: '10px',
                }}
              >
                "{resp.input}"
              </p>
            </Sketchbook>
          </SketchbookItem>
        );
      })}
    </SketchbookList>
  );
};

const SketchbookList = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const SketchbookItem = styled.div<{ $center: boolean }>`
  width: 230px;
  height: 330px;
  transition: transform 0.4s ease, z-index 0.2s;
  transform: scale(${({ $center }) => ($center ? 1.15 : 0.8)});
  z-index: ${({ $center }) => ($center ? 2 : 1)};
  margin: 0 6px;
`;
