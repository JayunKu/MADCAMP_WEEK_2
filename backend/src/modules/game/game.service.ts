import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RoomGateway } from '../room/room.gateway';
import { RoomRedisService } from 'src/config/redis/room-redis.service';
import {
  FakerModeTeamType,
  GameMode,
  GameStatus,
  Room,
} from 'src/config/redis/model';
import { ConfigService } from '@nestjs/config';

export const FAKER_MODE_ROUND_LIMIT = 3;
@Injectable()
export class GameService {
  constructor(
    private readonly roomRedisService: RoomRedisService,
    private readonly roomGateway: RoomGateway,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async startGame(roomId: string, gameMode: GameMode): Promise<void> {
    const roomPlayers = await this.roomRedisService.getRoomPlayers(roomId);

    // 최초 전체 셔플 (응답 순서용)
    const randomizedPlayers = [...roomPlayers].sort(() => Math.random() - 0.5);
    const firstPlayer = randomizedPlayers[0];

    const fakerCount = Math.round(randomizedPlayers.length / 3);

    let reRandomizedPlayers: typeof roomPlayers;
    let fakerPlayers: typeof roomPlayers = [];

    do {
      reRandomizedPlayers = [...roomPlayers].sort(() => Math.random() - 0.5);
      fakerPlayers = reRandomizedPlayers.slice(0, fakerCount);
    } while (fakerPlayers.find((p) => p.id === firstPlayer.id)); // ✅ 첫번째 플레이어가 faker면 다시 섞음

    const keeperPlayers = reRandomizedPlayers.slice(fakerCount);

    this.roomRedisService.updateRoom(roomId, {
      game_mode: gameMode,
      round_number: 1,
      game_status: GameStatus.ANSWER_INPUT,
      round_winners: [],
      response_player_ids: randomizedPlayers.map((player) => player.id),
      response_player_inputs: [],
      response_player_file_urls: [],
      keeper_player_ids:
        gameMode === GameMode.FAKER
          ? keeperPlayers.map((player) => player.id)
          : [],
      fakers_player_ids:
        gameMode === GameMode.FAKER
          ? fakerPlayers.map((player) => player.id)
          : [],
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

    // return {
    //   id: 'test',
    //   url: 'http://localhost:8000/test_gen_image.png',
    // };
    try {
      const data = (
        await this.httpService.axiosRef.post(imageGenApiUrl, {
          prompt: prompt,
        })
      ).data;

      console.log('AI Image Server Response:', data);

      return {
        id: data.image_id,
        url: `https://storage.googleapis.com/madcamp-malgreem-image/${data.image_id}`,
      };
    } catch (error) {
      console.error('Error calling AI Image Server:', error);
      throw new Error('Failed to generate image');
    }
  }

  async submitImage(
    roomId: string,
    playerId: string,
    input: string,
    file_url: string,
  ): Promise<void> {
    // Update the room with the submitted image
    await this.roomRedisService.addResponse(roomId, playerId, input, file_url);

    const room = (await this.roomRedisService.getRoomById(roomId)) as Room;

    if (room.turn_player_index + 1 === room.response_player_ids.length) {
      if (room.game_mode === GameMode.FAKER) {
        // 페이커 모드
        this.roomGateway.server.to(roomId).emit('round_finished', room);
      } else {
        // 기본 모드
        const updatedRoom = await this.roomRedisService.updateRoom(roomId, {
          game_status: GameStatus.FINISHED,
        });
        this.roomGateway.server.to(roomId).emit('round_finished', updatedRoom);
      }
    } else {
      // 다음 플레이어로 턴 변경
      const updatedRoom = await this.roomRedisService.updateRoom(roomId, {
        turn_player_index: room.turn_player_index + 1,
      });
      this.roomGateway.server.to(roomId).emit('turn_changed', updatedRoom);
    }
  }

  async nextRound(roomId: string): Promise<Room | null> {
    const room = (await this.roomRedisService.getRoomById(roomId)) as Room;

    // randomize room players
    const randomizedPlayers = room.response_player_ids.sort(
      () => Math.random() - 0.5,
    );

    // 페이커 모드: 라운드 증가
    const updatedRoom = await this.roomRedisService.updateRoom(roomId, {
      round_number: room.round_number + 1,
      game_status: GameStatus.ANSWER_INPUT,
      turn_player_index: 0,
      response_player_ids: randomizedPlayers,
      response_player_inputs: [],
      response_player_file_urls: [],
    });
    this.roomGateway.server.to(roomId).emit('round_start_next', updatedRoom);

    return updatedRoom;
  }

  async submitRoundWinner(roomId: string, winner: FakerModeTeamType) {
    // 라운드 승리자 추가
    let room = (await this.roomRedisService.addRoundWinner(
      roomId,
      winner,
    )) as Room;

    if (room.round_number === FAKER_MODE_ROUND_LIMIT) {
      // 마지막 라운드 승리자 제출 후 게임 종료
      room = (await this.roomRedisService.updateRoom(roomId, {
        game_status: GameStatus.FINISHED,
      })) as Room;
    }

    this.roomGateway.server.to(roomId).emit('round_winner_submitted', room);

    return room;
  }
}
