import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: true,
  namespace: 'ws/games',
})
export class GameGateway {
  constructor() {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join_game')
  async handleJoinRoom(
    @MessageBody() payload: { roomCode: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.info(`Game Client ${client.id} joining room: ${payload.roomCode}`);
    client.join(payload.roomCode);
  }
}
