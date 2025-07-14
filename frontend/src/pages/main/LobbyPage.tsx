import { LargeButton } from '../../components/Button';
import mainLogo from '../../assets/images/main-logo.png';
import gameAbstract from '../../assets/images/game-abstract.png';
import { useTheme } from '@emotion/react';
import { useGoogleLogin } from '@react-oauth/google';
import { axiosInstance } from '../../hooks/useAxios';
import { PlayAsGuestButton } from '../index.styles';
import { useAuth } from '../../context/AuthContext';

interface LobbyPageProps {
  flipToPage: (page: number) => void;
}

export const LobbyPage = ({ flipToPage }: LobbyPageProps) => {
  const theme = useTheme();
  const { login, logout, user, isAuthenticated } = useAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: async response => {
      console.log('Google login successful:', response);

      try {
        const authResponse = await axiosInstance.post('/auth', {
          accessToken: response.access_token,
        });

        console.log('Auth successful:', authResponse.data);

        // 사용자 정보를 AuthContext에 저장
        const userData = {
          id: authResponse.data.id,
          playerId: authResponse.data.player_id,
          name: authResponse.data.name,
          avatarId: authResponse.data.avatar_id,
          totalGames: authResponse.data.total_games,
          totalWins: authResponse.data.total_wins,
        };

        login(userData);
        flipToPage(1);
      } catch (err) {
        console.error('Failed to authenticate with server:', err);
        alert('Failed to connect API server. Please try again later.');
      }
    },
    onError: error => {
      console.error('Google login failed:', error);
    },
  });

  const onGoogleLoginButtonHandler = () => {
    googleLogin();
  };
  const onPlayAsGuestButtonHandler = () => {
    flipToPage(1);
  };

  return (
    <>
      <img
        src={mainLogo}
        alt="MalGreem"
        style={{ width: '80%', marginTop: '20px' }}
      />
      <img
        src={gameAbstract}
        alt="Game Abstract"
        style={{
          width: '90%',
          marginTop: '20px',
          marginBottom: '30px',
        }}
      />
      <LargeButton
        backgroundColor={theme.colors.lightYellow}
        onClick={() => {
          if (!isAuthenticated) onGoogleLoginButtonHandler();
          else flipToPage(1);
        }}
      >
        {isAuthenticated ? `${user?.name}으로 플레이` : 'Google로 로그인'}
      </LargeButton>
      <PlayAsGuestButton
        onClick={() => {
          if (!isAuthenticated) onPlayAsGuestButtonHandler();
          else logout();
        }}
      >
        {isAuthenticated ? `로그아웃` : '비회원으로 게임하기'}
      </PlayAsGuestButton>
    </>
  );
};
