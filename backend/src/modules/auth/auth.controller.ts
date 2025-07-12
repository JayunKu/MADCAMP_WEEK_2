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
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { LoginRequestDto } from './dtos/login-request.dto';
import { Request } from 'express';
import { CommonResponseDto } from 'src/common/dtos/common-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: '로그인' })
  async login(@Req() req: Request, @Body() loginRequestDto: LoginRequestDto) {
    await this.authService.login(req, loginRequestDto);

    return new CommonResponseDto();
  }

  @Delete()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '로그아웃' })
  async logout(@Req() req: Request) {
    this.authService.logout(req);

    return new CommonResponseDto();
  }
}
