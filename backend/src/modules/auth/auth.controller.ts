import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Post,
  Req,
  HttpCode,
  UseGuards,
  Res,
} from '@nestjs/common';
import { LoginRequestDto } from './dtos/login-request.dto';
import { Request, Response } from 'express';
import { CommonResponseDto } from 'src/common/dtos/common-response.dto';
import { CommonUserResponseDto } from 'src/common/dtos/common-user-response.dto';
import { PLAYER_COOKIE_NAME } from '../player/player.controller';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: '구글 계정으로 로그인' })
  async login(
    @Res() res: Response,
    @Req() req: Request,
    @Body() loginRequestDto: LoginRequestDto,
  ) {
    const { accessToken } = loginRequestDto;

    const user = await this.authService.login(req, accessToken);

    // 쿠키로 저장
    res.cookie(PLAYER_COOKIE_NAME, user.player_id, { httpOnly: true });

    return res.json(new CommonResponseDto(new CommonUserResponseDto(user)));
  }

  @Delete()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '로그아웃' })
  async logout(@Req() req: Request) {
    // this.authService.logout(req);

    return new CommonResponseDto();
  }
}
