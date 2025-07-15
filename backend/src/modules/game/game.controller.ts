import {
  Body,
  Controller,
  HttpException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GameService } from './game.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonResponseDto } from 'src/common/dtos/common-response.dto';
import { PlayerGuard } from '../auth/guards/player.guard';
import { CurrentPlayer } from 'src/common/decorators/current-player.decorator';
import { GameMode, GameStatus, Player } from 'src/config/redis/model';
import { SubmitInputRequestDto } from './dtos/submit-input-request.dto';
import { SubmitImageRequestDto } from './dtos/submit-image-request.dto';
import { RoomService } from '../room/room.service';
import { SubmitAnswerRequestDto } from './dtos/submit-answer-request.dto';

@ApiTags('games')
@Controller('games')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly roomService: RoomService,
  ) {}

  @Post(':id')
  @UseGuards(PlayerGuard)
  @ApiOperation({ summary: '게임 시작' })
  async startGame(
    @Param('id') roomId: string,
    @CurrentPlayer() player: Player,
  ) {
    const room = await this.roomService.getRoomById(roomId);
    if (!room) {
      throw new HttpException(`Room with ID ${roomId} does not exist.`, 404);
    }
    if (room.game_status !== GameStatus.WAITING) {
      throw new HttpException('Game is already started or ended', 403);
    }
    if (room.host_player_id !== player.id) {
      throw new HttpException('Only the host can start the game', 403);
    }

    await this.gameService.startGame(room.id, room.game_mode);

    return new CommonResponseDto();
  }

  @Post(':id/answer')
  @UseGuards(PlayerGuard)
  @ApiOperation({ summary: '첫 제시어 입력' })
  async submitAnswer(
    @Param('id') roomId: string,
    @CurrentPlayer() player: Player,
    @Body() submitAnswerRequestDto: SubmitAnswerRequestDto,
  ) {
    const { answer } = submitAnswerRequestDto;

    // Check if the player is in the room
    const room = await this.roomService.getRoomById(roomId);
    if (!room) {
      throw new HttpException(`Room with ID ${roomId} does not exist.`, 404);
    }
    if (room.response_player_ids[0] !== player.id) {
      throw new HttpException('Not your turn or not in the game', 403);
    }
    if (room.game_status !== GameStatus.ANSWER_INPUT) {
      throw new HttpException('Game is not in answer input status', 403);
    }

    await this.gameService.submitAnswer(roomId, answer);

    return new CommonResponseDto();
  }

  @Post(':id/inputs')
  @UseGuards(PlayerGuard)
  @ApiOperation({ summary: '플레이어가 프롬프트 입력' })
  async submitInput(
    @Param('id') roomId: string,
    @CurrentPlayer() player: Player,
    @Body() submitInputRequestDto: SubmitInputRequestDto,
  ) {
    const { input } = submitInputRequestDto;

    const room = await this.roomService.getRoomById(roomId);
    if (!room) {
      throw new HttpException(`Room with ID ${roomId} does not exist.`, 404);
    }
    if (room.game_status !== GameStatus.STARTED) {
      throw new HttpException('Game is not running', 403);
    }
    if (room.response_player_ids[room.turn_player_index] !== player.id) {
      throw new HttpException('Not your turn or not in the game', 403);
    }

    // AI 이미지 생성 요청
    const generatedImage = await this.gameService.generateImage(input);

    return new CommonResponseDto({
      file_id: generatedImage.id,
      file_url: generatedImage.url,
    });
  }

  @Post(':id/images')
  @UseGuards(PlayerGuard)
  @ApiOperation({ summary: '플레이어가 생성된 이미지 결정' })
  async submitImage(
    @Param('id') roomId: string,
    @CurrentPlayer() player: Player,
    @Body() submitImageRequestDto: SubmitImageRequestDto,
  ) {
    const { input, file_url } = submitImageRequestDto;

    const room = await this.roomService.getRoomById(roomId);
    if (!room) {
      throw new HttpException(`Room with ID ${roomId} does not exist.`, 404);
    }
    if (room.game_status !== GameStatus.STARTED) {
      throw new HttpException('Game is not running', 403);
    }
    if (room.response_player_ids[room.turn_player_index] !== player.id) {
      throw new HttpException('Not your turn or not in the game', 403);
    }

    await this.gameService.submitImage(roomId, player.id, input, file_url);

    return new CommonResponseDto();
  }

  @Post(':id/rounds')
  @UseGuards(PlayerGuard)
  @ApiOperation({ summary: '(방장만 가능) 다음 라운드로 이동' })
  async nextRound(
    @Param('id') roomId: string,
    @CurrentPlayer() player: Player,
  ) {
    const room = await this.roomService.getRoomById(roomId);
    if (!room) {
      throw new HttpException(`Room with ID ${roomId} does not exist.`, 404);
    }
    if (room.game_status !== GameStatus.STARTED) {
      throw new HttpException('Game is not running', 403);
    }
    if (room.game_mode !== GameMode.FAKER) {
      throw new HttpException(
        'Next round is only available in Faker mode',
        403,
      );
    }
    if (room.host_player_id !== player.id) {
      throw new HttpException('Only the host can start a new round', 403);
    }

    await this.gameService.nextRound(roomId);

    return new CommonResponseDto();
  }
}
