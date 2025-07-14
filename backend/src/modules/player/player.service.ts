import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { v4 } from 'uuid';
import { PlayerRedisService } from '../../config/redis/player-redis.service';
import { Player } from 'src/config/redis/model';

const INITIAL_PLAYER_NAME = 'Guest';

@Injectable()
export class PlayerService {
  constructor(
    private readonly playerRedisService: PlayerRedisService,
    private readonly prismaService: PrismaService,
  ) {}

  async createNewPlayer(): Promise<Player> {
    return await this.playerRedisService.createPlayer(
      v4(),
      INITIAL_PLAYER_NAME,
      0,
      false,
    );
  }

  async createPlayer(playerId?: string): Promise<Player> {
    if (playerId) {
      const existingPlayer =
        await this.playerRedisService.getPlayerById(playerId);

      if (existingPlayer) {
        return existingPlayer;
      }

      const user = await this.prismaService.user.findUnique({
        where: { player_id: playerId },
      });

      if (user) {
        return await this.playerRedisService.createPlayer(
          user.player_id,
          user.name,
          user.avatar_id,
          true,
        );
      }

      return await this.createNewPlayer();
    }
    return await this.createNewPlayer();
  }

  async getPlayer(playerId: string): Promise<Player | null> {
    return await this.playerRedisService.getPlayerById(playerId);
  }
}
