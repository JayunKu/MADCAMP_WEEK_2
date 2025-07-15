import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { HttpModule } from '@nestjs/axios';
import { RoomGateway } from '../room/room.gateway';
import { RoomService } from '../room/room.service';

@Module({
  imports: [HttpModule],
  controllers: [GameController],
  providers: [GameService, RoomGateway, RoomService],
})
export class GameModule {}
