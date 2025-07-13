import { User } from '@prisma/client';

export class CommonUserResponseDto {
  id: string;
  name: string;
  avatarId: number;
  totalGames: number;
  totalWins: number;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.avatarId = user.avartar_id;
    this.totalGames = user.total_games;
    this.totalWins = user.total_wins;
  }
}
