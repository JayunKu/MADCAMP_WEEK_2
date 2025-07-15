import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RoomGateway } from '../room/room.gateway';
import { RoomRedisService } from 'src/config/redis/room-redis.service';
import { GameMode, GameStatus, Room } from 'src/config/redis/model';
import { ConfigService } from '@nestjs/config';

const FAKER_MODE_ROUND_LIMIT = 3;
@Injectable()
export class GameService {
  constructor(
    private readonly httpService: HttpService,
    private readonly roomRedisService: RoomRedisService,
    private readonly roomGateway: RoomGateway,
    private readonly configService: ConfigService,
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

  async generateImage(prompt: string): Promise<{
    id: string;
    url: string;
  }> {
    const imageGenApiUrl =
      `${this.configService.get<string>('image_gen_api.url')}/generate` ||
      'http://localhost:8001/generate';

    console.log('Image Generation API URL:', imageGenApiUrl);

    return {
      id: 'test',
      url: 'http://localhost:8000/test_gen_image.png',
    };
    // try {
    //   const data = (
    //     await this.httpService.axiosRef.post(imageGenApiUrl, {
    //       prompt: prompt,
    //     })
    //   ).data;

    //   console.log('AI Image Server Response:', data);
    //   return data;
    // } catch (error) {
    //   console.error('Error calling AI Image Server:', error);
    //   throw new Error('Failed to generate image');
    // }
  }

  async submitImage(
    roomId: string,
    playerId: string,
    input: string,
    fileId: string,
  ): Promise<void> {
    // Update the room with the submitted image
    await this.roomRedisService.addResponse(roomId, playerId, input, fileId);

    const room = (await this.roomRedisService.getRoomById(roomId)) as Room;

    if (room.turn_player_index + 1 === room.response_player_ids.length) {
      if (room.game_mode === GameMode.FAKER) {
        if (room.round_number + 1 === FAKER_MODE_ROUND_LIMIT) {
          // 페이커 모드: 모든 라운드 끝남
          const updatedRoom = await this.roomRedisService.updateRoom(roomId, {
            game_status: GameStatus.ENDED,
          });
          this.roomGateway.server.to(roomId).emit('game_finished', {
            room: updatedRoom,
          });
        } else {
          // 페이커 모드: 현재 라운드 끝남
          this.roomGateway.server.to(roomId).emit('round_finished', {
            room,
          });
        }
      } else {
        // 기본 모드: 게임 종료
        const updatedRoom = await this.roomRedisService.updateRoom(roomId, {
          game_status: GameStatus.ENDED,
        });
        this.roomGateway.server.to(roomId).emit('game_finished', {
          room: updatedRoom,
        });
      }
    } else {
      // 다음 플레이어로 턴 변경
      const updatedRoom = await this.roomRedisService.updateRoom(roomId, {
        turn_player_index: room.turn_player_index + 1,
      });
      this.roomGateway.server.to(roomId).emit('turn_changed', updatedRoom);
    }
  }
}
