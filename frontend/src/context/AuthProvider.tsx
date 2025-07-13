import React, { useState, ReactNode, useEffect } from 'react';
import { AuthContext, User, AuthContextType, Player } from './AuthContext';
import { axiosInstance } from '../hooks/useAxios';

const PLAYER_ID_KEY = 'malgreem_pid';
const USER_ID_KEY = 'malgreem_uid';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);

  // playerId를 서버에서 받아오거나, 이미 있으면 로드
  const initializePlayer = async () => {
    const savedPlayer = localStorage.getItem(PLAYER_ID_KEY);
    if (savedPlayer) {
      const parsedPlayer = JSON.parse(savedPlayer);

      // Redis에 playerId 등록하기 위함
      await axiosInstance.post('/players', {
        player_id: parsedPlayer.id,
      });

      return parsedPlayer;
    } else {
      try {
        const newPlayer = (await axiosInstance.post('/players')).data;

        localStorage.setItem(PLAYER_ID_KEY, JSON.stringify(newPlayer));

        return newPlayer;
      } catch (e) {
        console.error('Failed to get playerId from server:', e);
      }
    }
  };

  const login = (userData: User) => {
    setUser(userData);

    // 로컬 스토리지에 저장
    localStorage.setItem(USER_ID_KEY, JSON.stringify(userData));
    localStorage.setItem(PLAYER_ID_KEY, userData.playerId);
  };

  const logout = async () => {
    setUser(null);

    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(PLAYER_ID_KEY);

    // playerId 다시 받아오기
    const newPlayer = await initializePlayer();
    setPlayer(newPlayer);
  };

  const isAuthenticated = user !== null;

  // 컴포넌트 마운트 시 playerId 초기화 및 사용자 정보 복원
  useEffect(() => {
    (async () => {
      // 1. 로그인한 사용자 정보 복원
      const savedUser = localStorage.getItem(USER_ID_KEY);
      let restoredPlayerId = null;

      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setPlayer({
            id: parsedUser.playerId,
            name: parsedUser.name,
            avatarId: parsedUser.avatarId,
            isMember: true,
          });
          restoredPlayerId = parsedUser.playerId;
        } catch (error) {
          console.error('Failed to parse saved user data:', error);
          localStorage.removeItem(USER_ID_KEY);
        }
      }

      // 2. playerId 초기화 (로그인 정보에 없으면 서버에서 받아옴, 있으면 로드)
      if (!restoredPlayerId) {
        const currentPlayer = await initializePlayer();
        setPlayer(currentPlayer);
      }
    })();
  }, []);

  const value: AuthContextType = {
    user,
    player,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
