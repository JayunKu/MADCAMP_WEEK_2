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
} from '@nestjs/common';
import { LoginRequestDto } from './dtos/login-request.dto';
import { Request, Response } from 'express';
import { CommonResponseDto } from 'src/common/dtos/common-response.dto';
import { CommonUserResponseDto } from 'src/common/dtos/common-user-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: '구글 계정으로 로그인' })
  async login(@Req() req: Request, @Body() loginRequestDto: LoginRequestDto) {
    const { accessToken } = loginRequestDto;

    const user = await this.authService.login(req, accessToken);

    return new CommonResponseDto(new CommonUserResponseDto(user));
  }

  @Delete()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '로그아웃' })
  async logout(@Req() req: Request) {
    this.authService.logout(req);

    return new CommonResponseDto();
  }
}
