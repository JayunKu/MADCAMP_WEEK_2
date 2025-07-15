import { createContext, useContext } from 'react';
import { User } from '../types/user';
import { Player } from '../types/game';

export interface AuthContextType {
  user: User | null;
  player: Player | null;
  setUser: (user: User | null) => void;
  setPlayer: (player: Player | null) => void;
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
