import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/config/redis/redis.service';
import {
  Room,
  GameMode,
  GameStatus,
  FakerModeTeamType,
} from 'src/config/redis/model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RoomRedisService {
  constructor(private readonly redisService: RedisService) {}

  async createRoom(
    hostUserId: string,
    gameMode: GameMode = GameMode.BASIC,
  ): Promise<Room> {
    const roomId = uuidv4();
    const room: Room = {
      id: roomId,
      host_user_id: hostUserId,
      game_mode: gameMode,
      game_status: GameStatus.WAITING,
      round_number: null,
      round_winners: [],
      keeper_user_ids: [],
      fakers_user_ids: [],
      response_user_ids: [],
      response_user_inputs: [],
      response_user_file_ids: [],
      turn_player_id: null,
    };

    const roomKey = `rooms:${roomId}`;
    await this.redisService.hSet(roomKey, 'id', roomId);
    await this.redisService.hSet(roomKey, 'host_user_id', hostUserId);
    await this.redisService.hSet(roomKey, 'game_mode', gameMode.toString());
    await this.redisService.hSet(
      roomKey,
      'game_status',
      GameStatus.WAITING.toString(),
    );
    await this.redisService.hSet(roomKey, 'round_number', '');
    await this.redisService.hSet(roomKey, 'turn_player_id', '');

    await this.redisService.del(`${roomKey}:round_winners`);
    await this.redisService.del(`${roomKey}:keeper_user_ids`);
    await this.redisService.del(`${roomKey}:fakers_user_ids`);
    await this.redisService.del(`${roomKey}:response_user_ids`);
    await this.redisService.del(`${roomKey}:response_user_inputs`);
    await this.redisService.del(`${roomKey}:response_user_file_ids`);

    return room;
  }

  async getRoomById(roomId: string): Promise<Room | null> {
    const roomKey = `rooms:${roomId}`;
    const roomData = await this.redisService.hGetAll(roomKey);

    if (!roomData || Object.keys(roomData).length === 0) {
      return null;
    }

    const round_winners = await this.redisService.lRange(
      `${roomKey}:round_winners`,
      0,
      -1,
    );
    const keeper_user_ids = await this.redisService.lRange(
      `${roomKey}:keeper_user_ids`,
      0,
      -1,
    );
    const fakers_user_ids = await this.redisService.lRange(
      `${roomKey}:fakers_user_ids`,
      0,
      -1,
    );
    const response_user_ids = await this.redisService.lRange(
      `${roomKey}:response_user_ids`,
      0,
      -1,
    );
    const response_user_inputs = await this.redisService.lRange(
      `${roomKey}:response_user_inputs`,
      0,
      -1,
    );
    const response_user_file_ids = await this.redisService.lRange(
      `${roomKey}:response_user_file_ids`,
      0,
      -1,
    );

    return {
      id: roomData.id,
      host_user_id: roomData.host_user_id,
      game_mode: parseInt(roomData.game_mode) as GameMode,
      game_status: parseInt(roomData.game_status) as GameStatus,
      round_number: roomData.round_number
        ? parseInt(roomData.round_number)
        : null,
      round_winners: round_winners.map(
        (winner) => parseInt(winner) as FakerModeTeamType,
      ),
      keeper_user_ids: keeper_user_ids,
      fakers_user_ids: fakers_user_ids,
      response_user_ids: response_user_ids,
      response_user_inputs: response_user_inputs,
      response_user_file_ids: response_user_file_ids,
      turn_player_id: roomData.turn_player_id || null,
    };
  }

  async updateRoom(
    roomId: string,
    updates: Partial<Room>,
  ): Promise<Room | null> {
    const roomKey = `rooms:${roomId}`;
    const exists = await this.redisService.exists(roomKey);
    if (!exists) return null;

    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined && value === null) continue;

      switch (key) {
        // string
        case 'host_user_id':
        case 'round_answer':
        case 'turn_player_id':
          await this.redisService.hSet(roomKey, key, value as string);
          break;
        // number
        case 'game_mode':
        case 'round_number':
        case 'game_status':
          await this.redisService.hSet(
            roomKey,
            key,
            (value as number).toString(),
          );
          break;
        // list of strings
        case 'keeper_user_ids':
        case 'fakers_user_ids':
        case 'response_user_ids':
        case 'response_user_inputs':
        case 'response_user_file_ids':
          // 기존 리스트 삭제 후 새로 생성
          await this.redisService.del(`${roomKey}:${key}`);
          if (Array.isArray(value) && value.length > 0) {
            await this.redisService.rPush(
              `${roomKey}:${key}`,
              ...(value as string[]),
            );
          }
          break;
        // list of numbers
        case 'round_winners':
          await this.redisService.del(`${roomKey}:${key}`);
          if (Array.isArray(value) && value.length > 0) {
            await this.redisService.rPush(
              `${roomKey}:${key}`,
              ...value.map((item) => item.toString()),
            );
          }
          break;
      }
    }

    return await this.getRoomById(roomId);
  }

  async deleteRoom(roomId: string): Promise<boolean> {
    const roomKey = `rooms:${roomId}`;
    const hashResult = await this.redisService.del(roomKey);
    const listResult1 = await this.redisService.del(`${roomKey}:round_winners`);
    const listResult2 = await this.redisService.del(
      `${roomKey}:keeper_user_ids`,
    );
    const listResult3 = await this.redisService.del(
      `${roomKey}:fakers_user_ids`,
    );
    const listResult4 = await this.redisService.del(
      `${roomKey}:response_user_ids`,
    );
    const listResult5 = await this.redisService.del(
      `${roomKey}:response_user_inputs`,
    );
    const listResult6 = await this.redisService.del(
      `${roomKey}:response_user_file_ids`,
    );
    return (
      hashResult > 0 ||
      listResult1 > 0 ||
      listResult2 > 0 ||
      listResult3 > 0 ||
      listResult4 > 0 ||
      listResult5 > 0 ||
      listResult6 > 0
    );
  }

  async getAllRooms(): Promise<Room[]> {
    const roomKeys = await this.redisService.keys('rooms:*');
    const rooms: Room[] = [];

    for (const key of roomKeys) {
      // 리스트 키는 제외
      if (
        key.includes(':round_winners') ||
        key.includes(':keeper_user_ids') ||
        key.includes(':fakers_user_ids') ||
        key.includes(':response_user_ids') ||
        key.includes(':response_user_inputs') ||
        key.includes(':response_user_file_ids')
      ) {
        continue;
      }

      const roomData = await this.redisService.hGetAll(key);
      if (roomData && Object.keys(roomData).length > 0) {
        // 리스트 데이터 조회
        const round_winners = await this.redisService.lRange(
          `${key}:round_winners`,
          0,
          -1,
        );
        const keeper_user_ids = await this.redisService.lRange(
          `${key}:keeper_user_ids`,
          0,
          -1,
        );
        const fakers_user_ids = await this.redisService.lRange(
          `${key}:fakers_user_ids`,
          0,
          -1,
        );
        const response_user_ids = await this.redisService.lRange(
          `${key}:response_user_ids`,
          0,
          -1,
        );
        const response_user_inputs = await this.redisService.lRange(
          `${key}:response_user_inputs`,
          0,
          -1,
        );
        const response_user_file_ids = await this.redisService.lRange(
          `${key}:response_user_file_ids`,
          0,
          -1,
        );

        const room: Room = {
          id: roomData.id,
          host_user_id: roomData.host_user_id,
          game_mode: parseInt(roomData.game_mode) as GameMode,
          game_status: parseInt(roomData.game_status) as GameStatus,
          round_number: roomData.round_number
            ? parseInt(roomData.round_number)
            : null,
          round_winners: round_winners.map(
            (winner) => parseInt(winner) as FakerModeTeamType,
          ),
          keeper_user_ids: keeper_user_ids,
          fakers_user_ids: fakers_user_ids,
          response_user_ids: response_user_ids,
          response_user_inputs: response_user_inputs,
          response_user_file_ids: response_user_file_ids,
          turn_player_id: roomData.turn_player_id || null,
        };
        rooms.push(room);
      }
    }

    return rooms;
  }

  async addResponse(
    roomId: string,
    userId: string,
    input?: string,
    fileId?: string,
  ): Promise<Room | null> {
    const roomKey = `rooms:${roomId}`;
    const exists = await this.redisService.exists(roomKey);
    if (!exists) return null;

    // 각 응답 요소를 해당 리스트에 추가
    await this.redisService.rPush(`${roomKey}:response_user_ids`, userId);
    await this.redisService.rPush(
      `${roomKey}:response_user_inputs`,
      input || '',
    );
    await this.redisService.rPush(
      `${roomKey}:response_user_file_ids`,
      fileId || '',
    );

    return await this.getRoomById(roomId);
  }

  async addRoundWinner(
    roomId: string,
    winner: FakerModeTeamType,
  ): Promise<Room | null> {
    const roomKey = `rooms:${roomId}`;
    const exists = await this.redisService.exists(roomKey);
    if (!exists) return null;

    await this.redisService.rPush(
      `${roomKey}:round_winners`,
      winner.toString(),
    );
    return await this.getRoomById(roomId);
  }

  async clearResponses(roomId: string): Promise<boolean> {
    const roomKey = `rooms:${roomId}`;
    const result1 = await this.redisService.del(`${roomKey}:response_user_ids`);
    const result2 = await this.redisService.del(
      `${roomKey}:response_user_inputs`,
    );
    const result3 = await this.redisService.del(
      `${roomKey}:response_user_file_ids`,
    );
    return result1 > 0 || result2 > 0 || result3 > 0;
  }

  async getRoundResultCount(roomId: string): Promise<number> {
    const roomKey = `rooms:${roomId}`;
    return await this.redisService.lLen(`${roomKey}:round_results`);
  }

  async addKeeperUser(roomId: string, userId: string): Promise<Room | null> {
    const roomKey = `rooms:${roomId}`;
    const exists = await this.redisService.exists(roomKey);
    if (!exists) return null;

    await this.redisService.rPush(`${roomKey}:keeper_user_ids`, userId);
    return await this.getRoomById(roomId);
  }

  async addFakerUser(roomId: string, userId: string): Promise<Room | null> {
    const roomKey = `rooms:${roomId}`;
    const exists = await this.redisService.exists(roomKey);
    if (!exists) return null;

    await this.redisService.rPush(`${roomKey}:fakers_user_ids`, userId);
    return await this.getRoomById(roomId);
  }

  async removeKeeperUser(roomId: string, userId: string): Promise<Room | null> {
    const roomKey = `rooms:${roomId}`;
    const exists = await this.redisService.exists(roomKey);
    if (!exists) return null;

    await this.redisService.lRem(`${roomKey}:keeper_user_ids`, 0, userId);
    return await this.getRoomById(roomId);
  }

  async removeFakerUser(roomId: string, userId: string): Promise<Room | null> {
    const roomKey = `rooms:${roomId}`;
    const exists = await this.redisService.exists(roomKey);
    if (!exists) return null;

    await this.redisService.lRem(`${roomKey}:fakers_user_ids`, 0, userId);
    return await this.getRoomById(roomId);
  }

  async clearKeeperUsers(roomId: string): Promise<boolean> {
    const roomKey = `rooms:${roomId}`;
    const result = await this.redisService.del(`${roomKey}:keeper_user_ids`);
    return result > 0;
  }

  async clearFakerUsers(roomId: string): Promise<boolean> {
    const roomKey = `rooms:${roomId}`;
    const result = await this.redisService.del(`${roomKey}:fakers_user_ids`);
    return result > 0;
  }

  async getResponseCount(roomId: string): Promise<number> {
    const roomKey = `rooms:${roomId}`;
    return await this.redisService.lLen(`${roomKey}:response_user_ids`);
  }

  async getRoundWinnerCount(roomId: string): Promise<number> {
    const roomKey = `rooms:${roomId}`;
    return await this.redisService.lLen(`${roomKey}:round_winners`);
  }

  // 응답 관련 추가 함수들
  async getResponseByIndex(
    roomId: string,
    index: number,
  ): Promise<{ userId: string; input: string; fileId: string } | null> {
    const roomKey = `rooms:${roomId}`;

    const userId = await this.redisService.lIndex(
      `${roomKey}:response_user_ids`,
      index,
    );
    const input = await this.redisService.lIndex(
      `${roomKey}:response_user_inputs`,
      index,
    );
    const fileId = await this.redisService.lIndex(
      `${roomKey}:response_user_file_ids`,
      index,
    );

    if (!userId) return null;

    return {
      userId,
      input: input || '',
      fileId: fileId || '',
    };
  }
}
