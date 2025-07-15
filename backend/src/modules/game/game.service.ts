import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { RoomGateway } from '../room/room.gateway';
import { RoomRedisService } from 'src/config/redis/room-redis.service';
import { GameMode, GameStatus } from 'src/config/redis/model';

@Injectable()
export class GameService {
  constructor(
    private readonly httpService: HttpService,
    private readonly roomRedisService: RoomRedisService,
    private readonly roomGateway: RoomGateway,
  ) {}

  async startGame(roomId: string, gameMode: GameMode): Promise<void> {
    const roomPlayers = await this.roomRedisService.getRoomPlayers(roomId);

    // randomize room players
    const randomizedPlayers = roomPlayers.sort(() => Math.random() - 0.5);

    this.roomRedisService.updateRoom(roomId, {
      game_mode: gameMode,
      round_number: 1,
      game_status: GameStatus.ANSWER_INPUT,
      round_winners: [],
      response_player_ids: randomizedPlayers.map((player) => player.id),
      response_player_inputs: [],
      response_player_file_ids: [],
      turn_player_index: 0,
    });

    this.roomGateway.server
      .to(roomId)
      .emit('game_started', { room_id: roomId });

    // await this.roomGateway.server
    //   .in(roomId)
    //   .fetchSockets()
    //   .then((sockets) => {
    //     sockets.forEach((socket) => {
    //       socket.leave(roomId);
    //     });
    //   });
  }

  async submitAnswer(roomId: string, answer: string) {
    // Update the room with the submitted answer
    const room = await this.roomRedisService.updateRoom(roomId, {
      round_answer: answer,
      game_status: GameStatus.STARTED,
    });

    console.log(`Answer submitted for room ${roomId}: ${answer}`);
    // Notify players in the room
    this.roomGateway.server.to(roomId).emit('turn_changed', room);
    console.log(`Turn changed for room ${roomId}`);
  }

  async generateImage(prompt: string): Promise<any> {
    const aiServerUrl = 'http://localhost:8001/generate'; // Should be in a config file
    try {
      const response = await firstValueFrom(
        this.httpService.post(aiServerUrl, { prompt }),
      );
      return response.data;
    } catch (error) {
      console.error('Error calling AI Image Server:', error);
      throw new Error('Failed to generate image');
    }
  }
}
