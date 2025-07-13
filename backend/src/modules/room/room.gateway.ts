import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PlayerGuard } from '../auth/guards/player.guard';
import { Player } from 'src/config/redis/model';
import { RoomRedisService } from 'src/config/redis/room-redis.service';
import { PlayerRedisService } from 'src/config/redis/player-redis.service';
import { CurrentPlayer } from 'src/common/decorators/current-player.decorator';

@UseGuards(PlayerGuard)
@WebSocketGateway({
  cors: true,
  path: '/room/ws',
  namespace: 'room/ws',
})
export class RoomGateway {
  constructor(
    private readonly roomRedisService: RoomRedisService,
    private playerRedisService: PlayerRedisService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() room_id: string,
    @ConnectedSocket() client: Socket,
    @CurrentPlayer() currentPlayer: Player,
  ) {
    client.join(room_id);
  }
}
