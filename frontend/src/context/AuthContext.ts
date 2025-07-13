import { createContext, useContext } from 'react';
export interface User {
  id: number;
  playerId: string;
  name: string;
  avatarId: number;
  totalGames: number;
  totalWins: number;
}

export interface Player {
  id: string;
  name: string;
  avatarId: number;
  isMember: boolean;
  roomId?: string;
}

export interface AuthContextType {
  user: User | null;
  player: Player | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
