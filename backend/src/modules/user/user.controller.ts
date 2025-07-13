import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return new CommonResponseDto(new CommonUserResponseDto(user));
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@CurrentUser() user: User) {
    if (!user) {
      throw new HttpException('User not authenticated', 401);
    }

    return new CommonResponseDto(new CommonUserResponseDto(user));
  }

  @Put('me')
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
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
  async deleteMe(@CurrentUser() user: User) {
    if (!user) {
      throw new HttpException('User not authenticated', 401);
    }

    await this.userService.deleteUser(user.id);

    return new CommonResponseDto({ message: 'User deleted successfully' });
  }
}
