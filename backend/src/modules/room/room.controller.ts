import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoomRequestDto } from './dtos/create-room-request.dto';
import { Room } from 'src/config/redis/model';
import { CommonService } from '../common/common.service';
import { CommonResponseDto } from 'src/common/dtos/common-response.dto';
import { CreateRoomResponseDto } from './dtos/create-room-response.dto';

@ApiTags('room')
@Controller('room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly commonService: CommonService,
  ) {}

  @Get()
  @ApiOperation({ summary: '모든 파티 조회' })
  async getAllRooms() {
    return this.roomService.getAllRooms();
  }

  @Post()
  @ApiOperation({ summary: '파티 생성' })
  async createRoom(@Body() createRoomRequestDto: CreateRoomRequestDto) {
    const { host_player_id } = createRoomRequestDto;

    // Check if the player exists
    const player = await this.commonService.getPlayerById(host_player_id);
    if (!player) {
      throw new Error(`Player with ID ${host_player_id} does not exist.`);
    }

    const room = await this.roomService.createRoom(host_player_id);

    return new CommonResponseDto(new CreateRoomResponseDto(room));
  }
}
