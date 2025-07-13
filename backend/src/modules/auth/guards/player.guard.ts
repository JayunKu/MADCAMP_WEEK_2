import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Request } from 'express';
import { PLAYER_COOKIE_NAME } from 'src/modules/player/player.controller';
import { PlayerRedisService } from 'src/config/redis/player-redis.service';

@Injectable()
export class PlayerGuard implements CanActivate {
  constructor(private readonly playerRedisService: PlayerRedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    const playerId = req.cookies?.[PLAYER_COOKIE_NAME];

    if (!playerId) {
      throw new HttpException('플레이어 ID가 필요합니다', 401);
    }

    const player = await this.playerRedisService.getPlayerById(playerId);
    if (!player) {
      throw new HttpException('플레이어를 찾을 수 없습니다', 404);
    }

    req.player = player;

    return true;
  }
}
