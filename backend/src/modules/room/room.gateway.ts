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

@WebSocketGateway({
  cors: true,
  namespace: 'ws/rooms',
})
export class RoomGateway {
  constructor() {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() payload: { roomCode: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.info(`Client ${client.id} joining room: ${payload.roomCode}`);
    client.join(payload.roomCode);
  }

  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @MessageBody() payload: { roomCode: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.info(`Client ${client.id} leaving room: ${payload.roomCode}`);
    client.leave(payload.roomCode);
  }
}
