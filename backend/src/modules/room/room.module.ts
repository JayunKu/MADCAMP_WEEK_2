import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { RoomRedisService } from './services/room-redis.service';
import { UserRedisService } from './services/user-redis.service';

@Module({
  controllers: [RoomController],
  providers: [RoomService, RoomRedisService, UserRedisService],
})
export class RoomModule {}
