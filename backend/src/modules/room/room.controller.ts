import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Player, Room } from 'src/config/redis/model';
import { CommonResponseDto } from 'src/common/dtos/common-response.dto';
import { CommonRoomResponseDto } from '../../common/dtos/common-room-response.dto';
import { PlayerGuard } from '../auth/guards/player.guard';
import { CurrentPlayer } from 'src/common/decorators/current-player.decorator';
import { PlayerRedisService } from '../../config/redis/player-redis.service';
import { CommonPlayerResponseDto } from 'src/common/dtos/common-player-response.dto';

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
      rooms: rooms.map((room: Room) => new CommonRoomResponseDto(room)),
    });
  }

  @Get(':id')
  @ApiOperation({ summary: '파티 정보 조회' })
  async getRoom(@Param('id') roomId: string) {
    const room = await this.roomService.getRoomById(roomId);
    if (!room) {
      throw new HttpException(`Room with ID ${roomId} does not exist.`, 404);
    }

    return new CommonResponseDto(new CommonRoomResponseDto(room));
  }

  @Post()
  @UseGuards(PlayerGuard)
  @ApiOperation({ summary: '파티 생성' })
  async createRoom(@CurrentPlayer() currentPlayer: Player) {
    const room = await this.roomService.createRoom(currentPlayer.id);
    const roomPlayers = await this.roomService.getRoomPlayers(room.id);

    return new CommonResponseDto({
      room: new CommonRoomResponseDto(room),
      players: roomPlayers.map((player) => new CommonPlayerResponseDto(player)),
    });
  }

  @Post(':id')
  @UseGuards(PlayerGuard)
  @ApiOperation({ summary: '파티 참여' })
  async joinRoom(
    @CurrentPlayer() currentPlayer: Player,
    @Param('id') roomId: string,
  ) {
    const room = await this.roomService.getRoomById(roomId);
    if (!room) {
      throw new HttpException(`Room with ID ${roomId} does not exist.`, 404);
    }

    const roomPlayers = await this.roomService.joinRoom(
      roomId,
      currentPlayer.id,
    );
    if (!roomPlayers) {
      throw new HttpException(`Failed to join room ${roomId}.`, 400);
    }

    return new CommonResponseDto({
      room: new CommonRoomResponseDto(room),
      players: roomPlayers.map((player) => new CommonPlayerResponseDto(player)),
    });
  }

  @Put(':id')
  @UseGuards(PlayerGuard)
  @ApiOperation({ summary: '파티 정보 수정' })
  async updateRoom(
    @Param('id') roomId: string,
    @Body() updates: Partial<Room>,
  ) {
    const updatedRoom = await this.roomService.updateRoom(roomId, updates);
    if (!updatedRoom) {
      throw new HttpException(`Failed to update room ${roomId}.`, 400);
    }

    return new CommonResponseDto(new CommonRoomResponseDto(updatedRoom));
  }

  @Delete(':id/me')
  @UseGuards(PlayerGuard)
  @ApiOperation({ summary: '파티 탈퇴' })
  async leaveRoom(
    @CurrentPlayer() currentPlayer: Player,
    @Param('id') roomId: string,
  ) {
    const room = await this.roomService.getRoomById(roomId);
    if (!room) {
      throw new HttpException(`Room with ID ${roomId} does not exist.`, 404);
    }

    const players = await this.roomService.leaveRoom(roomId, currentPlayer.id);
    if (!players) {
      throw new HttpException(`Failed to leave room ${roomId}.`, 400);
    }

    return new CommonResponseDto(
      players.map((player) => new CommonPlayerResponseDto(player)),
    );
  }
}
