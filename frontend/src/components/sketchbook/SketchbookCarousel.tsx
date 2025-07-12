import { useState } from 'react';
import styled from '@emotion/styled';
import { Sketchbook } from './Sketchbook';
import { EXAMPLE_PLAYER_INFOS, EXAMPLE_GAME_DATA } from '../../types/mockData';
import { useTheme } from '@emotion/react';
import { Spacer } from '../Spacer';

// 각 플레이어의 응답 데이터와 플레이어 정보 매칭
const responses = EXAMPLE_GAME_DATA.player_responses.map(resp => {
  const player = EXAMPLE_PLAYER_INFOS.find(p => p.id.toString() === resp.id);
  return {
    ...resp,
    username: player?.username || '알 수 없음',
    avatarId: player?.avatarId ?? 0,
  };
});

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
  const [centerIdx, setCenterIdx] = useState(0);
  const total = responses.length;

  console.log(responses);

  // 캐러셀 인덱스 계산 (순환)
  const getIdx = (offset: number) => (centerIdx + offset + total) % total;

  return (
    <SketchbookList>
      {[-1, 0, 1].map(offset => {
        const idx = getIdx(offset);
        const resp = responses[idx];
        const isCenter = offset === 0;
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
                src={resp.file_id || ''}
                alt="Player Images"
                style={{
                  background: 'red',
                  width: '100%',
                  height: '180px',
                  padding: '0 15px',
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
