import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/config/redis/redis.service';
import {
  Room,
  GameMode,
  GameStatus,
  FakerModeTeamType,
  Player,
} from 'src/config/redis/model';
import { v4 } from 'uuid';

@Injectable()
export class RoomRedisService {
  constructor(private readonly redisService: RedisService) {}

  async createRoom(hostPlayerId: string): Promise<Room> {
    const roomId = v4().toUpperCase().substring(0, 8);
    const room: Room = {
      id: roomId,
      host_player_id: hostPlayerId,
      game_mode: GameMode.BASIC,
      game_status: GameStatus.WAITING,
      round_number: 0,
      round_answer: null,
      round_winners: [],
      keeper_player_ids: [],
      fakers_player_ids: [],
      response_player_ids: [],
      response_player_inputs: [],
      response_player_file_ids: [],
      turn_player_index: 0,
    };

    const roomKey = `rooms:${roomId}`;
    await this.redisService.hSet(roomKey, 'id', roomId);
    await this.redisService.hSet(roomKey, 'host_player_id', hostPlayerId);
    await this.redisService.hSet(
      roomKey,
      'game_mode',
      room.game_mode.toString(),
    );
    await this.redisService.hSet(
      roomKey,
      'game_status',
      GameStatus.WAITING.toString(),
    );
    await this.redisService.hSet(
      roomKey,
      'round_number',
      room.round_number.toString(),
    );
    await this.redisService.hSet(roomKey, 'round_answer', '');
    await this.redisService.del(`${roomKey}:round_winners`);
    await this.redisService.del(`${roomKey}:keeper_player_ids`);
    await this.redisService.del(`${roomKey}:fakers_player_ids`);
    await this.redisService.del(`${roomKey}:response_player_ids`);
    await this.redisService.del(`${roomKey}:response_player_inputs`);
    await this.redisService.del(`${roomKey}:response_player_file_ids`);
    await this.redisService.hSet(
      roomKey,
      'turn_player_index',
      room.turn_player_index.toString(),
    );

    await this.redisService.del(`${roomKey}:players`);
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
    const keeper_player_ids = await this.redisService.lRange(
      `${roomKey}:keeper_player_ids`,
      0,
      -1,
    );
    const fakers_player_ids = await this.redisService.lRange(
      `${roomKey}:fakers_player_ids`,
      0,
      -1,
    );
    const response_player_ids = await this.redisService.lRange(
      `${roomKey}:response_player_ids`,
      0,
      -1,
    );
    const response_player_inputs = await this.redisService.lRange(
      `${roomKey}:response_player_inputs`,
      0,
      -1,
    );
    const response_player_file_ids = await this.redisService.lRange(
      `${roomKey}:response_player_file_ids`,
      0,
      -1,
    );

    return {
      id: roomData.id,
      host_player_id: roomData.host_player_id,
      game_mode: parseInt(roomData.game_mode) as GameMode,
      game_status: parseInt(roomData.game_status) as GameStatus,
      round_number: parseInt(roomData.round_number),
      round_answer: roomData.round_answer || null,
      round_winners: round_winners.map(
        (winner) => parseInt(winner) as FakerModeTeamType,
      ),
      keeper_player_ids: keeper_player_ids,
      fakers_player_ids: fakers_player_ids,
      response_player_ids: response_player_ids,
      response_player_inputs: response_player_inputs,
      response_player_file_ids: response_player_file_ids,
      turn_player_index: parseInt(roomData.turn_player_index),
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
        case 'host_player_id':
        case 'round_answer':
          await this.redisService.hSet(roomKey, key, value as string);
          break;
        // number
        case 'game_mode':
        case 'round_number':
        case 'game_status':
        case 'turn_player_index':
          await this.redisService.hSet(
            roomKey,
            key,
            (value as number).toString(),
          );
          break;
        // list of strings
        case 'keeper_player_ids':
        case 'fakers_player_ids':
        case 'response_player_ids':
        case 'response_player_inputs':
        case 'response_player_file_ids':
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
      `${roomKey}:keeper_player_ids`,
    );
    const listResult3 = await this.redisService.del(
      `${roomKey}:fakers_player_ids`,
    );
    const listResult4 = await this.redisService.del(
      `${roomKey}:response_player_ids`,
    );
    const listResult5 = await this.redisService.del(
      `${roomKey}:response_player_inputs`,
    );
    const listResult6 = await this.redisService.del(
      `${roomKey}:response_player_file_ids`,
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
        key.includes(':keeper_player_ids') ||
        key.includes(':fakers_player_ids') ||
        key.includes(':response_player_ids') ||
        key.includes(':response_player_inputs') ||
        key.includes(':response_player_file_ids')
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
        const keeper_player_ids = await this.redisService.lRange(
          `${key}:keeper_player_ids`,
          0,
          -1,
        );
        const fakers_player_ids = await this.redisService.lRange(
          `${key}:fakers_player_ids`,
          0,
          -1,
        );
        const response_player_ids = await this.redisService.lRange(
          `${key}:response_player_ids`,
          0,
          -1,
        );
        const response_player_inputs = await this.redisService.lRange(
          `${key}:response_player_inputs`,
          0,
          -1,
        );
        const response_player_file_ids = await this.redisService.lRange(
          `${key}:response_player_file_ids`,
          0,
          -1,
        );

        const room: Room = {
          id: roomData.id,
          host_player_id: roomData.host_player_id,
          game_mode: parseInt(roomData.game_mode) as GameMode,
          game_status: parseInt(roomData.game_status) as GameStatus,
          round_number: parseInt(roomData.round_number),
          round_answer: roomData.round_answer || null,
          round_winners: round_winners.map(
            (winner) => parseInt(winner) as FakerModeTeamType,
          ),
          keeper_player_ids: keeper_player_ids,
          fakers_player_ids: fakers_player_ids,
          response_player_ids: response_player_ids,
          response_player_inputs: response_player_inputs,
          response_player_file_ids: response_player_file_ids,
          turn_player_index: parseInt(roomData.turn_player_index),
        };
        rooms.push(room);
      }
    }

    return rooms;
  }

  async getRoomPlayers(roomId: string): Promise<Player[]> {
    const roomKey = `rooms:${roomId}`;
    const playerHashKey = `${roomKey}:players`;
    const playerHash = await this.redisService.hGetAll(playerHashKey);
    const players: Player[] = [];

    for (const [playerId, playerJson] of Object.entries(playerHash)) {
      try {
        const playerData = JSON.parse(playerJson);
        players.push({
          id: playerData.id,
          name: playerData.name,
          avatar_id: playerData.avatar_id ? Number(playerData.avatar_id) : 0,
          is_member:
            playerData.is_member === true || playerData.is_member === 'true',
          room_id: playerData.room_id || null,
        });
      } catch (e) {
        // skip invalid
      }
    }

    return players;
  }

  async addPlayerToRoom(
    roomId: string,
    playerId: string,
  ): Promise<Player[] | null> {
    const roomKey = `rooms:${roomId}`;
    const exists = await this.redisService.exists(roomKey);
    if (!exists) return null;

    // 플레이어 정보 가져오기
    const playerData = await this.redisService.hGetAll(`players:${playerId}`);

    if (!playerData) return null;

    // 방의 플레이어 해시에 추가
    await this.redisService.hSet(
      `${roomKey}:players`,
      playerId,
      JSON.stringify({
        id: playerData.id,
        name: playerData.name,
        avatar_id: playerData.avatar_id ? Number(playerData.avatar_id) : 0,
        is_member: true,
        room_id: roomId,
      }),
    );

    // 플레이어의 방 ID 업데이트
    await this.redisService.hSet(`players:${playerId}`, 'room_id', roomId);

    return await this.getRoomPlayers(roomId);
  }

  async removePlayerFromRoom(
    roomId: string,
    playerId: string,
  ): Promise<Player[] | null> {
    const roomKey = `rooms:${roomId}`;
    const exists = await this.redisService.exists(roomKey);
    if (!exists) return null;

    // 방의 플레이어 해시에서 제거
    await this.redisService.hDel(`${roomKey}:players`, playerId);

    // 플레이어의 방 ID 업데이트
    await this.redisService.hSet(`players:${playerId}`, 'room_id', '');

    return await this.getRoomPlayers(roomId);
  }

  // ------ 여기까지는 확인 ------

  async addResponse(
    roomId: string,
    playerId: string,
    input?: string,
    fileId?: string,
  ): Promise<Room | null> {
    const roomKey = `rooms:${roomId}`;
    const exists = await this.redisService.exists(roomKey);
    if (!exists) return null;

    // 각 응답 요소를 해당 리스트에 추가
    await this.redisService.rPush(`${roomKey}:response_player_ids`, playerId);
    await this.redisService.rPush(
      `${roomKey}:response_player_inputs`,
      input || '',
    );
    await this.redisService.rPush(
      `${roomKey}:response_player_file_ids`,
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
    const result1 = await this.redisService.del(
      `${roomKey}:response_player_ids`,
    );
    const result2 = await this.redisService.del(
      `${roomKey}:response_player_inputs`,
    );
    const result3 = await this.redisService.del(
      `${roomKey}:response_player_file_ids`,
    );
    return result1 > 0 || result2 > 0 || result3 > 0;
  }

  async getRoundResultCount(roomId: string): Promise<number> {
    const roomKey = `rooms:${roomId}`;
    return await this.redisService.lLen(`${roomKey}:round_results`);
  }

  async addKeeperPlayer(
    roomId: string,
    playerId: string,
  ): Promise<Room | null> {
    const roomKey = `rooms:${roomId}`;
    const exists = await this.redisService.exists(roomKey);
    if (!exists) return null;

    await this.redisService.rPush(`${roomKey}:keeper_player_ids`, playerId);
    return await this.getRoomById(roomId);
  }

  async addFakerPlayer(roomId: string, playerId: string): Promise<Room | null> {
    const roomKey = `rooms:${roomId}`;
    const exists = await this.redisService.exists(roomKey);
    if (!exists) return null;

    await this.redisService.rPush(`${roomKey}:fakers_player_ids`, playerId);
    return await this.getRoomById(roomId);
  }

  async removeKeeperPlayer(
    roomId: string,
    playerId: string,
  ): Promise<Room | null> {
    const roomKey = `rooms:${roomId}`;
    const exists = await this.redisService.exists(roomKey);
    if (!exists) return null;

    await this.redisService.lRem(`${roomKey}:keeper_player_ids`, 0, playerId);
    return await this.getRoomById(roomId);
  }

  async removeFakerPlayer(
    roomId: string,
    playerId: string,
  ): Promise<Room | null> {
    const roomKey = `rooms:${roomId}`;
    const exists = await this.redisService.exists(roomKey);
    if (!exists) return null;

    await this.redisService.lRem(`${roomKey}:fakers_player_ids`, 0, playerId);
    return await this.getRoomById(roomId);
  }

  async clearKeeperPlayers(roomId: string): Promise<boolean> {
    const roomKey = `rooms:${roomId}`;
    const result = await this.redisService.del(`${roomKey}:keeper_player_ids`);
    return result > 0;
  }

  async clearFakerPlayers(roomId: string): Promise<boolean> {
    const roomKey = `rooms:${roomId}`;
    const result = await this.redisService.del(`${roomKey}:fakers_player_ids`);
    return result > 0;
  }

  async getResponseCount(roomId: string): Promise<number> {
    const roomKey = `rooms:${roomId}`;
    return await this.redisService.lLen(`${roomKey}:response_player_ids`);
  }

  async getRoundWinnerCount(roomId: string): Promise<number> {
    const roomKey = `rooms:${roomId}`;
    return await this.redisService.lLen(`${roomKey}:round_winners`);
  }

  // 응답 관련 추가 함수들
  async getResponseByIndex(
    roomId: string,
    index: number,
  ): Promise<{ playerId: string; input: string; fileId: string } | null> {
    const roomKey = `rooms:${roomId}`;

    const playerId = await this.redisService.lIndex(
      `${roomKey}:response_player_ids`,
      index,
    );
    const input = await this.redisService.lIndex(
      `${roomKey}:response_player_inputs`,
      index,
    );
    const fileId = await this.redisService.lIndex(
      `${roomKey}:response_player_file_ids`,
      index,
    );

    if (!playerId) return null;

    return {
      playerId,
      input: input || '',
      fileId: fileId || '',
    };
  }
}
