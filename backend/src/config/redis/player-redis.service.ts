import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/config/redis/redis.service';
import { Player } from 'src/config/redis/model';

@Injectable()
export class PlayerRedisService {
  constructor(private readonly redisService: RedisService) {}

  async createPlayer(
    playerId: string,
    name: string,
    avatarId: number | null = null,
    roomId?: string,
  ): Promise<Player> {
    const player: Player = {
      id: playerId,
      name,
      avatar_id: avatarId || 0,
      is_member: false,
      room_id: roomId || null,
    };

    const playerKey = `players:${playerId}`;
    await this.redisService.hSet(playerKey, 'id', playerId);
    await this.redisService.hSet(playerKey, 'name', name);
    await this.redisService.hSet(
      playerKey,
      'avatar_id',
      avatarId !== null ? avatarId.toString() : '',
    );
    await this.redisService.hSet(playerKey, 'is_member', 'false');
    await this.redisService.hSet(playerKey, 'room_id', roomId || '');

    return player;
  }

  async getPlayerById(playerId: string): Promise<Player | null> {
    const playerKey = `players:${playerId}`;
    const playerData = await this.redisService.hGetAll(playerKey);

    if (!playerData || Object.keys(playerData).length === 0) {
      return null;
    }

    return {
      id: playerData.id,
      name: playerData.name,
      avatar_id: playerData.avatar_id ? Number(playerData.avatar_id) : 0,
      is_member: playerData.is_member === 'true',
      room_id: playerData.room_id || null,
    };
  }

  async updatePlayer(
    playerId: string,
    updates: Partial<Player>,
  ): Promise<Player | null> {
    const playerKey = `players:${playerId}`;
    const exists = await this.redisService.exists(playerKey);
    if (!exists) return null;

    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined || value === null) continue;

      switch (key) {
        case 'is_member':
          await this.redisService.hSet(playerKey, key, value.toString());
          break;
        case 'id':
        case 'room_id':
        case 'name':
          await this.redisService.hSet(playerKey, key, value as string);
          break;
        case 'avatar_id':
          await this.redisService.hSet(
            playerKey,
            key,
            value !== null ? value.toString() : '',
          );
          break;
      }
    }

    return await this.getPlayerById(playerId);
  }

  async deletePlayer(playerId: string): Promise<boolean> {
    const playerKey = `players:${playerId}`;
    const result = await this.redisService.del(playerKey);
    return result > 0;
  }

  async getAllPlayers(): Promise<Player[]> {
    const playerKeys = await this.redisService.keys('players:*');
    const players: Player[] = [];

    for (const key of playerKeys) {
      const playerData = await this.redisService.hGetAll(key);
      if (playerData && Object.keys(playerData).length > 0) {
        const player: Player = {
          id: playerData.id,
          name: playerData.name,
          avatar_id: playerData.avatar_id ? Number(playerData.avatar_id) : 0,
          is_member: playerData.is_member === 'true',
          room_id: playerData.room_id || null,
        };
        players.push(player);
      }
    }

    return players;
  }

  async getPlayersByRoomId(roomId: string): Promise<Player[]> {
    const allPlayers = await this.getAllPlayers();
    return allPlayers.filter(
      (player) => player.room_id === roomId && player.is_member,
    );
  }
}
