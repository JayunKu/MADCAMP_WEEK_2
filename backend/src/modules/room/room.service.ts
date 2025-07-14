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

  //   async startGame(roomId: string): Promise<Room | null> {
  //     return await this.roomRedisService.updateRoom(roomId, {
  //       gameStatus: GameStatus.STARTED,
  //       roundNumber: 1,
  //     });
  //   }

  //   async endGame(roomId: string): Promise<Room | null> {
  //     return await this.roomRedisService.updateRoom(roomId, {
  //       gameStatus: GameStatus.ENDED,
  //       turn_player_id: null,
  //     });
  //   }

  //   async addResponse(
  //     roomId: string,
  //     userId: string,
  //     input?: string,
  //     fileId?: string,
  //   ): Promise<Room | null> {
  //     return await this.roomRedisService.addResponse(
  //       roomId,
  //       userId,
  //       input,
  //       fileId,
  //     );
  //   }

  //   async addRoundResult(
  //     roomId: string,
  //     winner: FakerModeTeamType,
  //   ): Promise<Room | null> {
  //     return await this.roomRedisService.addRoundResult(roomId, winner);
  //   }

  //   async setTurnPlayer(roomId: string, playerId: string): Promise<Room | null> {
  //     return await this.roomRedisService.updateRoom(roomId, {
  //       turn_player_id: playerId,
  //     });
  //   }

  //   async nextRound(roomId: string): Promise<Room | null> {
  //     const room = await this.roomRedisService.getRoomById(roomId);
  //     if (!room) return null;

  //     const nextRoundNumber = (room.roundNumber || 0) + 1;
  //     return await this.roomRedisService.updateRoom(roomId, {
  //       roundNumber: nextRoundNumber,
  //       responses: [] as any, // 새 라운드에서는 응답 초기화
  //     });
  //   }

  //   // User 관련 함수들
  //   async createUser(userId: string, roomId?: string): Promise<User> {
  //     return await this.userRedisService.createUser(userId, roomId);
  //   }

  //   async getUserById(userId: string): Promise<User | null> {
  //     return await this.userRedisService.getUserById(userId);
  //   }

  //   async updateUser(
  //     userId: string,
  //     updates: Partial<User>,
  //   ): Promise<User | null> {
  //     return await this.userRedisService.updateUser(userId, updates);
  //   }

  //   async deleteUser(userId: string): Promise<boolean> {
  //     return await this.userRedisService.deleteUser(userId);
  //   }

  //   async joinRoom(userId: string, roomId: string): Promise<User | null> {
  //     return await this.userRedisService.updateUser(userId, {
  //       room_id: roomId,
  //       is_member: true,
  //     });
  //   }

  //   async getRoomMembers(roomId: string): Promise<User[]> {
  //     return await this.userRedisService.getUsersByRoomId(roomId);
  //   }
}
