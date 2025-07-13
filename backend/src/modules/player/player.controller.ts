import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { PlayerService } from './player.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonResponseDto } from 'src/common/dtos/common-response.dto';
import { Response } from 'express';
import { CreatePlayerRequestDto } from './dtos/create-player-request.dto';
import { Player } from 'src/config/redis/model';

export const PLAYER_COOKIE_NAME = 'malgreem_pid';

@ApiTags('player')
@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: '플레이어 생성' })
  async createPlayer(
    @Res() res: Response,
    @Body() createPlayerRequestDto: CreatePlayerRequestDto,
  ) {
    const { player_id } = createPlayerRequestDto;

    const playerId = await this.playerService.createPlayer(player_id);
    const player = (await this.playerService.getPlayer(playerId)) as Player;

    // 쿠키로 저장 (httpOnly 옵션 권장)
    res.cookie(PLAYER_COOKIE_NAME, playerId, { httpOnly: true });

    return res.json(
      new CommonResponseDto({
        id: player.id,
        name: player.name,
        avatar_id: player.avatar_id,
        is_member: player.is_member,
        room_id: player.room_id,
      }),
    );
  }
}
