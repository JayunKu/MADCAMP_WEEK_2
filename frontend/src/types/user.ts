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
