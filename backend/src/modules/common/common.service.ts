import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Player } from 'src/common/types/player';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RedisService } from 'src/config/redis/redis.service';

@Injectable()
export class CommonService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async getUserById(userId: number): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }

  async getPlayerById(playerId: string): Promise<Player | null> {
    const playerName = await this.redisService.get(`players:${playerId}`);

    if (!playerName) {
      return null;
    }

    return {
      id: playerId,
      name: playerName,
    };
  }
}
