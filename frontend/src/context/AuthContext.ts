import { createContext, useContext } from 'react';
export interface User {
  id: number;
  playerId: string;
  name: string;
  avatarId: number;
  totalGames: number;
  totalWins: number;
}
export const parseUser = (data: any): User => {
  return {
    id: data.id,
    playerId: data.player_id,
    name: data.name,
    avatarId: data.avatar_id,
    totalGames: data.total_games,
    totalWins: data.total_wins,
  };
};

export interface Player {
  id: string;
  name: string;
  avatarId: number;
  isMember: boolean;
  roomId?: string;
}
export const parsePlayer = (data: any): Player => {
  return {
    id: data.id,
    name: data.name,
    avatarId: data.avatar_id,
    isMember: data.is_member,
    roomId: data.room_id,
  };
};

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
