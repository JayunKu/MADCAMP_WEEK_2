import { useEffect, useState } from 'react';
import { parseUser, User } from '../types/user';
import { FullScreenPopup } from './FullScreenPopup';
import { axiosInstance } from '../hooks/useAxios';
import { Spacer } from './Spacer';
import { useTheme } from '@emotion/react';
import { SmallButton } from './Button';

interface LeaderBoardProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const LeaderBoard = ({ open, setOpen }: LeaderBoardProps) => {
  const theme = useTheme();
  const [rankings, setRankings] = useState<User[]>([]);

  useEffect(() => {
    if (open) {
      const fetchRankings = async () => {
        try {
          const res = (await axiosInstance.get('/users/rankings')).data;
          console.log('Rankings fetched:', res);
          setRankings(res.rankings.map((u: any) => parseUser(u)));
        } catch (err) {
          console.error('Failed to fetch rankings:', err);
          alert('리더 보드를 불러오는 데 실패했습니다. 다시 시도해주세요.');
        }
      };

      fetchRankings();
    }
  }, [open]);

  return (
    <FullScreenPopup open={open} onClose={() => setOpen(false)}>
      <div style={{ padding: '10px', textAlign: 'center' }}>
        <h2
          style={{
            textAlign: 'center',
            fontSize: '24px',
          }}
        >
          리더 보드
        </h2>
        <Spacer y={15} />
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {rankings.map((user, index) => (
            <li
              key={user.id}
              style={{
                width: '240px',
                display: 'flex',
                alignItems: 'center',
                background:
                  index === 0 ? theme.colors.lightYellow : theme.colors.white,
                borderRadius: '10px',
                boxShadow: theme.shadows.default,
                marginBottom: '12px',
                padding: '6px 12px',
                fontSize: '18px',
                border: '2px solid black',
              }}
            >
              <span
                style={{
                  fontSize: '22px',
                  marginRight: '16px',
                  color: theme.colors.yellow,
                }}
              >
                {index === 0
                  ? '🥇'
                  : index === 1
                  ? '🥈'
                  : index === 2
                  ? '🥉'
                  : `${index + 1}.`}
              </span>
              <span style={{ marginRight: '12px' }}>{user.name}</span>
              <span
                style={{
                  marginLeft: 'auto',
                  color: 'green',
                }}
              >
                {user.totalGames}점
              </span>
            </li>
          ))}
        </ul>
        <Spacer y={10} />
        <SmallButton
          backgroundColor={theme.colors.lightYellow}
          onClick={() => setOpen(false)}
        >
          닫기
        </SmallButton>
      </div>
    </FullScreenPopup>
  );
};
