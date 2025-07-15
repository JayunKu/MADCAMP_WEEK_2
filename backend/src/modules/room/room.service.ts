import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RoomRedisService } from '../../config/redis/room-redis.service';
import { Room, GameMode, Player } from 'src/config/redis/model';
import { PlayerRedisService } from '../../config/redis/player-redis.service';
import { RoomGateway } from './room.gateway';

@Injectable()
export class RoomService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly roomRedisService: RoomRedisService,
    private readonly playerRedisService: PlayerRedisService,
    private readonly roomGateway: RoomGateway,
  ) {}

  async getAllRooms(): Promise<Room[]> {
    return await this.roomRedisService.getAllRooms();
  }

  async createRoom(hostUserId: string): Promise<Room> {
    const room = await this.roomRedisService.createRoom(hostUserId);

    await this.joinRoom(room.id, hostUserId);

    return room;
  }

  async getRoomById(roomId: string): Promise<Room | null> {
    return await this.roomRedisService.getRoomById(roomId);
  }

  async updateRoom(
    roomId: string,
    updates: Partial<Room>,
  ): Promise<Room | null> {
    const room = await this.roomRedisService.updateRoom(roomId, updates);

    this.roomGateway.server.to(roomId).emit('room_updated', room);

    return room;
  }

  async deleteRoom(roomId: string): Promise<boolean> {
    return await this.roomRedisService.deleteRoom(roomId);
  }

  async joinRoom(roomId: string, playerId: string): Promise<Player[] | null> {
    const players = await this.roomRedisService.addPlayerToRoom(
      roomId,
      playerId,
    );

    this.roomGateway.server.to(roomId).emit('player_joined', players);

    return players;
  }

  async getRoomPlayers(roomId: string): Promise<Player[]> {
    return await this.roomRedisService.getRoomPlayers(roomId);
  }

  async leaveRoom(roomId: string, playerId: string): Promise<Player[] | null> {
    const players = await this.roomRedisService.removePlayerFromRoom(
      roomId,
      playerId,
    );

    this.roomGateway.server.to(roomId).emit('player_left', players);

    return players;
  }
}
