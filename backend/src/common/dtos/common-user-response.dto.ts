import { User } from '@prisma/client';

export class CommonUserResponseDto {
  id: number;
  player_id: string;
  name: string;
  avatar_id: number;
  total_games: number;
  total_wins: number;

  constructor(user: User) {
    this.id = user.id;
    this.player_id = user.player_id;
    this.name = user.name;
    this.avatar_id = user.avatar_id;
    this.total_games = user.total_games;
    this.total_wins = user.total_wins;
  }
}
