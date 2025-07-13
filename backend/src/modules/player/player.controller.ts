import { Controller, HttpCode, Post, Res } from '@nestjs/common';
import { PlayerService } from './player.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonResponseDto } from 'src/common/dtos/common-response.dto';
import { Response } from 'express';

export const PLAYER_COOKIE_NAME = 'malgreem_pid';

@ApiTags('player')
@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: '비회원용 플레이어 생성' })
  async createPlayer(@Res() res: Response) {
    const playerId = await this.playerService.createPlayer();
    const playerName = await this.playerService.getPlayerName(playerId);

    // 쿠키로 저장 (httpOnly 옵션 권장)
    res.cookie(PLAYER_COOKIE_NAME, playerId, { httpOnly: true });

    return res.json(
      new CommonResponseDto({
        id: playerId,
        name: playerName,
      }),
    );
  }
}
