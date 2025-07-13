import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/config/redis/redis.service';
import { v4 } from 'uuid';

const INITIAL_PLAYER_NAME = 'Guest';

@Injectable()
export class PlayerService {
  constructor(private readonly redisService: RedisService) {}

  async createPlayer(): Promise<string> {
    const playerId = v4();

    await this.redisService.set(`player:${playerId}`, INITIAL_PLAYER_NAME);
    return playerId;
  }

  async getPlayerName(playerId: string): Promise<string | null> {
    const playerName = await this.redisService.get(`player:${playerId}`);

    return playerName ? playerName : INITIAL_PLAYER_NAME;
  }
}
