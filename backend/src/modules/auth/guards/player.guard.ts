import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Request } from 'express';
import { RedisService } from 'src/config/redis/redis.service';
import { PLAYER_COOKIE_NAME } from 'src/modules/player/player.controller';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    const playerId = req.cookies?.[PLAYER_COOKIE_NAME];

    if (!playerId) {
      throw new HttpException('플레이어 ID가 필요합니다', 401);
    }

    const playerName = await this.redisService.get(`player:${playerId}`);

    if (!playerName) {
      throw new HttpException('플레이어를 찾을 수 없습니다', 401);
    }

    req.player = {
      id: playerId,
      name: playerName,
    };

    return true;
  }
}
