import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { PlayerService } from './player.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonResponseDto } from 'src/common/dtos/common-response.dto';
import { Response } from 'express';
import { CreatePlayerRequestDto } from './dtos/create-player-request.dto';
import { Player } from 'src/config/redis/model';
import { UpdatePlayerRequestDto } from './dtos/update-player-request.dto';

export const PLAYER_COOKIE_NAME = 'malgreem_pid';

@ApiTags('players')
@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get(':id')
  @ApiOperation({ summary: '플레이어 정보 조회' })
  async getPlayer(@Param('id') playerId: string) {
    const player = await this.playerService.getPlayer(playerId);

    if (!player) {
      throw new HttpException('Player not found', 404);
    }

    return new CommonResponseDto(player);
  }

  @Put(':id')
  @ApiOperation({ summary: '(비회원) 플레이어 정보 업데이트' })
  async updatePlayer(
    @Param('id') playerId: string,
    @Body() updatePlayerRequestDto: UpdatePlayerRequestDto,
  ) {
    const { name } = updatePlayerRequestDto;

    const player = await this.playerService.getPlayer(playerId);
    if (!player) {
      throw new HttpException('Player not found', 404);
    }
    if (player.is_member) {
      throw new HttpException(
        'Member player cannot update name. Please try update user',
        400,
      );
    }

    const updatedPlayer = await this.playerService.updatePlayer(playerId, name);

    return new CommonResponseDto(updatedPlayer);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: '플레이어 생성' })
  async createPlayer(
    @Res() res: Response,
    @Body() createPlayerRequestDto: CreatePlayerRequestDto,
  ) {
    const { player_id } = createPlayerRequestDto;

    const player = await this.playerService.createPlayer(player_id);

    // 쿠키로 저장 (httpOnly 옵션 권장)
    res.cookie(PLAYER_COOKIE_NAME, player.id, { httpOnly: true });

    return res.json(new CommonResponseDto(player));
  }
}
