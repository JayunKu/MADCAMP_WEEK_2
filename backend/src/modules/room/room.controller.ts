import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoomRequestDto } from './dtos/create-room-request.dto';
import { Player, Room } from 'src/config/redis/model';
import { CommonResponseDto } from 'src/common/dtos/common-response.dto';
import { CreateRoomResponseDto } from './dtos/create-room-response.dto';
import { PlayerGuard } from '../auth/guards/player.guard';
import { CurrentPlayer } from 'src/common/decorators/current-player.decorator';
import { PlayerRedisService } from '../../config/redis/player-redis.service';

@ApiTags('rooms')
@Controller('rooms')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly playerRedisService: PlayerRedisService,
  ) {}

  @Get()
  @ApiOperation({ summary: '모든 파티 조회' })
  async getAllRooms() {
    const rooms = await this.roomService.getAllRooms();

    return new CommonResponseDto({
      rooms: rooms.map((room: Room) => new CreateRoomResponseDto(room)),
    });
  }

  @Post()
  @UseGuards(PlayerGuard)
  @ApiOperation({ summary: '파티 생성' })
  async createRoom(
    @CurrentPlayer() currentPlayer: Player,
    @Body() createRoomRequestDto: CreateRoomRequestDto,
  ) {
    const { host_player_id } = createRoomRequestDto;

    // Check if the player exists
    const player = await this.playerRedisService.getPlayerById(host_player_id);
    if (!player) {
      throw new Error(`Player with ID ${host_player_id} does not exist.`);
    }

    const room = await this.roomService.createRoom(host_player_id);

    return new CommonResponseDto(new CreateRoomResponseDto(room));
  }

  // @Post(':id')
  // @UseGuards(PlayerGuard)
  // @ApiOperation({ summary: '파티 참여' })
  // async joinRoom(
  //   @CurrentPlayer() currentPlayer: Player,
  //   @Body('room_id') roomId: string,
  // ) {
  //   const room = await this.roomService.getRoomById(roomId);
  //   if (!room) {
  //     throw new Error(`Room with ID ${roomId} does not exist.`);
  //   }

  //   this.roomGateway.server.e

  //   // Add player to the room
  //   const updatedRoom = await this.roomService.updateRoom(roomId, {
  //     players: [...(room.players || []), currentPlayer.id],
  //   });

  //   return new CommonResponseDto(updatedRoom);
  // }
}
