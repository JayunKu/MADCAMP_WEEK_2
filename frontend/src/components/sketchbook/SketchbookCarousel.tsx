import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Sketchbook } from './Sketchbook';
import { useTheme } from '@emotion/react';
import { Spacer } from '../Spacer';
import { useRoom } from '../../context/RoomContext';
import { useUI } from '../../context/UIContext';

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

  if (!room || !roomPlayers) {
    return <></>;
  }

  const total = room.responsePlayerIds.length;
  const getIdx = (offset: number) => (centerIdx + offset + total) % total; // 캐러셀 인덱스 계산 (순환)

  const gameResponses = room.responsePlayerIds.map((playerId, index) => {
    const player = roomPlayers?.find(p => p.id === playerId);
    return {
      id: playerId,
      username: player?.name || '알 수 없음',
      avatarId: player?.avatarId ?? 0,
      input: room.responsePlayerInputs[index] || '',
      file_url: room.responsePlayerFileUrls[index] || '',
    };
  });

  // 3개 미만인 경우 렌더링할 오프셋 계산
  const getVisibleOffsets = () => {
    if (total === 1) return [0];
    if (total === 2) return [-1, 1];
    return [-1, 0, 1];
  };

  const visibleOffsets = getVisibleOffsets();

  return (
    <SketchbookList>
      {visibleOffsets.map(offset => {
        const idx = getIdx(offset);
        const resp = gameResponses[idx];
        const isCenter =
          offset === 0 || total === 1 || (total === 2 && offset === -1);
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
                {resp.username}이 그린 그림
              </p>
              <img
                src={resp.file_url}
                alt="Player Images"
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
`;

const SketchbookItem = styled.div<{ $center: boolean }>`
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), z-index 0.2s;
  transform: scale(${({ $center }) => ($center ? 1.15 : 0.8)});
  z-index: ${({ $center }) => ($center ? 2 : 1)};
  margin: 0 3px;
`;
