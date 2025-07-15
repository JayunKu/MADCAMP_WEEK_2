import React, { useState, ReactNode, useEffect } from 'react';
import { AuthContext, AuthContextType } from './AuthContext';
import { axiosInstance } from '../hooks/useAxios';
import { parseUser, User } from '../types/user';
import { parsePlayer, Player } from '../types/game';

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
    const latestPlayer = parsePlayer(
      (
        await axiosInstance.post('/players', {
          player_id: userData.playerId,
        })
      ).data
    );
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
    const newPlayer = parsePlayer((await axiosInstance.post('/players')).data);
    setPlayer(newPlayer);
    localStorage.setItem(PLAYER_ID_KEY, newPlayer.id);
  };

  const isAuthenticated = user !== null;

  // 컴포넌트 마운트 시 playerId 초기화 및 사용자 정보 복원
  useEffect(() => {
    (async () => {
      let restoredPlayer = null;

      const savedUserId = localStorage.getItem(USER_ID_KEY);
      const savedPlayerId = localStorage.getItem(PLAYER_ID_KEY);

      console.log('Restoring user and player from localStorage:', {
        savedUserId,
        savedPlayerId,
      });

      if (savedUserId) {
        // 로그인한 사용자 정보 복원
        try {
          const parsedUserId = parseInt(savedUserId);
          const parsedUser = parseUser(
            (await axiosInstance.get(`/users/${parsedUserId}`)).data
          );
          setUser(parsedUser);

          // 최신 player 정보 가져오기
          const parsedPlayer = parsePlayer(
            (
              await axiosInstance.post('/players', {
                player_id: parsedUser.playerId,
              })
            ).data
          );

          console.log('Restored user and player:', {
            user: parsedUser,
            player: parsedPlayer,
          });

          restoredPlayer = parsedPlayer;
          localStorage.setItem(USER_ID_KEY, parsedUser.id.toString());
          localStorage.setItem(PLAYER_ID_KEY, parsedPlayer.id);
        } catch (err) {
          localStorage.removeItem(USER_ID_KEY);
          localStorage.removeItem(PLAYER_ID_KEY);
          console.error('Failed to parse saved user data:', err);
          alert('Failed to connect API server. Please try again later.');
        }
      } else if (savedPlayerId) {
        // playerId가 있지만 사용자 정보가 없는 경우
        try {
          const parsedPlayerId = savedPlayerId;
          const parsedPlayer = parsePlayer(
            (await axiosInstance.get(`/players/${parsedPlayerId}`)).data
          );

          console.log('Restored player:', parsedPlayer);

          restoredPlayer = parsedPlayer;
        } catch (err) {
          localStorage.removeItem(PLAYER_ID_KEY);
          console.error('Failed to parse saved player data:', err);
          alert('Failed to connect API server. Please try again later.');
        }
      } else {
        // playerId가 없으면 새로 생성
        try {
          const newPlayer = parsePlayer(
            (await axiosInstance.post('/players')).data
          );

          console.log('Created new player:', newPlayer);

          localStorage.setItem(PLAYER_ID_KEY, newPlayer.id);
          restoredPlayer = newPlayer;
        } catch (err) {
          localStorage.removeItem(PLAYER_ID_KEY);

          console.error('Failed to create new player:', err);
          alert('Failed to connect API server. Please try again later.');
        }
      }

      setPlayer(restoredPlayer);
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
