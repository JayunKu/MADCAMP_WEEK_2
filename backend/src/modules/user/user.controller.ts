import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CommonResponseDto } from 'src/common/dtos/common-response.dto';
import { CommonUserResponseDto } from 'src/common/dtos/common-user-response.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '@prisma/client';
import { UpdateUserRequestDto } from '../auth/dtos/update-user-request.dto';
import { CreateUserGameRequestDto } from '../auth/dtos/create-user-game-request.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: '회원 정보 조회' })
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return new CommonResponseDto(new CommonUserResponseDto(user));
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '나의 정보 조회' })
  async getMe(@CurrentUser() user: User) {
    if (!user) {
      throw new HttpException('User not authenticated', 401);
    }

    return new CommonResponseDto(new CommonUserResponseDto(user));
  }

  @Put('me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '나의 정보 업데이트' })
  async updateMe(
    @CurrentUser() user: User,
    @Body() updateUserRequestDto: UpdateUserRequestDto,
  ) {
    if (!user) {
      throw new HttpException('User not authenticated', 401);
    }

    const updatedUser = await this.userService.updateUser(
      user.id,
      updateUserRequestDto,
    );

    return new CommonResponseDto(new CommonUserResponseDto(updatedUser));
  }

  @Post('me/games')
  @HttpCode(201)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '게임 횟수 갱신' })
  async createUserGame(
    @CurrentUser() user: User,
    @Body() createUserGameRequestDto: CreateUserGameRequestDto,
  ) {
    const { isWin } = createUserGameRequestDto;

    if (!user) {
      throw new HttpException('User not authenticated', 401);
    }

    const updatedUser = await this.userService.createUserGame(user.id, isWin);

    return new CommonResponseDto(new CommonUserResponseDto(updatedUser));
  }

  @Delete('me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '나의 회원 탈퇴' })
  async deleteMe(@CurrentUser() user: User) {
    if (!user) {
      throw new HttpException('User not authenticated', 401);
    }

    await this.userService.deleteUser(user.id);

    return new CommonResponseDto({ message: 'User deleted successfully' });
  }
}
