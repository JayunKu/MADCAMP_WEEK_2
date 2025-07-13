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

  async createPlayer(playerId?: string): Promise<string> {
    let id = playerId;
    let name = INITIAL_PLAYER_NAME;
    let avatarId: number | null = null;

    if (!id) {
      id = v4();
    } else {
      const user = await this.prismaService.user.findUnique({
        where: { player_id: id },
      });
      if (user) {
        name = user.name;
        avatarId = user.avatar_id;
      }
    }

    await this.playerRedisService.createPlayer(id, name, avatarId);

    return id;
  }

  async getPlayer(playerId: string): Promise<Player | null> {
    return await this.playerRedisService.getPlayerById(playerId);
  }
}
