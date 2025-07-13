import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoomRequestDto } from './dtos/create-room-request.dto';
import { Room } from 'src/config/redis/model';

@ApiTags('room')
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  @ApiOperation({ summary: '모든 파티 조회' })
  async getAllRooms() {
    return this.roomService.getAllRooms();
  }

  @Post()
  @ApiOperation({ summary: '파티 생성' })
  async createRoom(
    @Body() createRoomRequestDto: CreateRoomRequestDto,
  ): Promise<Room> {
    const { host_user_id } = createRoomRequestDto;

    return this.roomService.createRoom(host_user_id);
  }
}
