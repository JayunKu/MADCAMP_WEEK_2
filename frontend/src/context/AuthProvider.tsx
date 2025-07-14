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

  const login = async (userData: User) => {
    setUser(userData);

    // 최신 player 정보 가져오기
    const latestPlayer = (
      await axiosInstance.post('/players', {
        player_id: userData.playerId,
      })
    ).data as Player;
    setPlayer(latestPlayer);

    // 로컬 스토리지에 저장
    localStorage.setItem(USER_ID_KEY, userData.id.toString());
    localStorage.setItem(PLAYER_ID_KEY, userData.playerId);
  };

  const logout = async () => {
    setUser(null);
    setPlayer(null);

    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(PLAYER_ID_KEY);

    // playerId 다시 받아오기
    const newPlayer = (await axiosInstance.post('/players')).data;
    setPlayer(newPlayer);
  };

  const isAuthenticated = user !== null;

  // 컴포넌트 마운트 시 playerId 초기화 및 사용자 정보 복원
  useEffect(() => {
    (async () => {
      const savedUserId = localStorage.getItem(USER_ID_KEY);
      const savedPlayerId = localStorage.getItem(PLAYER_ID_KEY);

      console.log('Restoring user and player from localStorage:', {
        savedUserId,
        savedPlayerId,
      });

      if (savedUserId) {
        // 로그인한 사용자 정보 복원
        try {
          const parsedUserId = JSON.parse(savedUserId);
          const parsedUser = (await axiosInstance.get(`/users/${parsedUserId}`))
            .data as User;
          setUser(parsedUser);

          // 최신 player 정보 가져오기
          const parsedPlayer = (
            await axiosInstance.post('/players', {
              player_id: parsedUser.playerId,
            })
          ).data as Player;

          console.log('Restored user and player:', {
            user: parsedUser,
            player: parsedPlayer,
          });

          setPlayer(parsedPlayer);
        } catch (err) {
          localStorage.removeItem(USER_ID_KEY);
          console.error('Failed to parse saved user data:', err);
          alert('Failed to connect API server. Please try again later.');
        }
      } else if (savedPlayerId) {
        // playerId가 있지만 사용자 정보가 없는 경우
        try {
          const parsedPlayerId = JSON.parse(savedPlayerId);
          const parsedPlayer = (
            await axiosInstance.get(`/players/${parsedPlayerId}`)
          ).data as Player;

          console.log('Restored player:', parsedPlayer);

          setPlayer(parsedPlayer);
        } catch (err) {
          localStorage.removeItem(PLAYER_ID_KEY);
          console.error('Failed to parse saved player data:', err);
          alert('Failed to connect API server. Please try again later.');
        }
      }

      if (!player) {
        // playerId가 없으면 새로 생성
        const newPlayer = (await axiosInstance.post('/players')).data;

        setPlayer(newPlayer);
        localStorage.setItem(PLAYER_ID_KEY, JSON.stringify(newPlayer.id));
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
