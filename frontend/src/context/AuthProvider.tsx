import React, { useState, ReactNode, useEffect } from 'react';
import { AuthContext, User, AuthContextType } from './AuthContext';
import { axiosInstance } from '../hooks/useAxios';

const PLAYER_ID_KEY = 'malgreem_pid';
const USER_ID_KEY = 'malgreem_uid';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);

  // playerId를 서버에서 받아오거나, 이미 있으면 로드
  const initializePlayerId = async () => {
    const savedPlayerId = localStorage.getItem(PLAYER_ID_KEY);
    if (savedPlayerId) {
      setPlayerId(savedPlayerId);

      // Redis에 playerId 등록하기 위함
      await axiosInstance.post('/players', {
        player_id: savedPlayerId,
      });

      return savedPlayerId;
    } else {
      try {
        const res = await axiosInstance.post('/players');
        const newPlayerId = res.data.playerId || res.data.id;
        if (newPlayerId) {
          localStorage.setItem(PLAYER_ID_KEY, newPlayerId);
          setPlayerId(newPlayerId);
          return newPlayerId;
        }
      } catch (e) {
        console.error('Failed to get playerId from server:', e);
      }
      return null;
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
    await initializePlayerId();
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
          if (parsedUser.playerId) {
            setPlayerId(parsedUser.playerId);
            restoredPlayerId = parsedUser.playerId;
          }
        } catch (error) {
          console.error('Failed to parse saved user data:', error);
          localStorage.removeItem(USER_ID_KEY);
        }
      }

      // 2. playerId 초기화 (로그인 정보에 없으면 서버에서 받아옴, 있으면 로드)
      if (!restoredPlayerId) {
        const currentPlayerId = await initializePlayerId();
        console.log('Player ID initialized:', currentPlayerId);
      } else {
        console.log('Player ID restored from user info:', restoredPlayerId);
      }
    })();
  }, []);

  const value: AuthContextType = {
    user,
    playerId,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
