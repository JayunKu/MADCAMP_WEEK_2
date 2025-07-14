import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { PlayerRedisService } from '../../config/redis/player-redis.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonResponseDto } from 'src/common/dtos/common-response.dto';
import { RoomRedisService } from '../../config/redis/room-redis.service';
import { PlayerGuard } from '../auth/guards/player.guard';
import { CurrentPlayer } from 'src/common/decorators/current-player.decorator';
import { Player } from 'src/config/redis/model';
import { SubmitInputRequestDto } from './dtos/submit-input-request.dto';
import { SubmitImageRequestDto } from './dtos/submit-image-request.dto';

@ApiTags('games')
@Controller('games')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly playerRedisService: PlayerRedisService,
    private readonly roomRedisService: RoomRedisService,
  ) {}

  @Post(':id/inputs')
  //@UseGuards(PlayerGuard)
  @ApiOperation({ summary: '플레이어가 프롬프트 입력' })
  async submitInput(
    @Param('id') gameId: string,
    @CurrentPlayer() player: Player,
    @Body() submitInputRequestDto: SubmitInputRequestDto,
  ) {
    const { input } = submitInputRequestDto;
    console.log(input)
    // console.log(
    //   `Game ID: ${gameId}, Player ID: ${player.id}, Sending prompt to AI: ${input}`,
    // );

    // 1. AI 이미지 생성 요청
    const generatedImage = await this.gameService.generateImage(input);

    return new CommonResponseDto(generatedImage);
  }

  @Post(':id/images')
  @ApiOperation({ summary: '플레이어가 생성된 이미지 결정' })
  async submitImage(
    @Param('id') gameId: string,
    @CurrentPlayer() player: Player,
    @Body() submitImageRequestDto: SubmitImageRequestDto,
  ) {
    const { input, file_id } = submitImageRequestDto;
    console.log(input, file_id)

    await this.roomRedisService.addResponse(gameId, player.id, input, file_id);

    return new CommonResponseDto();
  }

}
