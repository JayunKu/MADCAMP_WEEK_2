import { createContext, useContext } from 'react';
export interface User {
  id: number;
  name: string;
  avatarId: number;
  totalGames: number;
  totalWins: number;
}

export interface AuthContextType {
  user: User | null;
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
