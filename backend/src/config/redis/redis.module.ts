import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RoomRedisService } from './room-redis.service';
import { PlayerRedisService } from './player-redis.service';

@Global()
@Module({
  imports: [],
  providers: [RedisService, PlayerRedisService, RoomRedisService],
  exports: [PlayerRedisService, RoomRedisService],
})
export class RedisModule {}
