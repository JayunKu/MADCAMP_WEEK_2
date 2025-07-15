import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { UpdateUserRequestDto } from '../auth/dtos/update-user-request.dto';
import { PlayerRedisService } from 'src/config/redis/player-redis.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly playerRedisService: PlayerRedisService,
  ) {}

  async updateUser(
    id: number,
    updateUserRequestDto: UpdateUserRequestDto,
  ): Promise<User> {
    const { name, avatar_id } = updateUserRequestDto;

    const updateData = {
      ...(name !== null && { name }),
      ...(avatar_id !== null && { avatar_id: avatar_id }),
    };

    const user = (await this.prismaService.user.findUnique({
      where: { id },
    })) as User;

    await this.playerRedisService.updatePlayer(user.player_id, {
      name: name,
      avatar_id: avatar_id,
    });

    return this.prismaService.user.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteUser(id: number): Promise<void> {
    await this.prismaService.user.delete({
      where: { id },
    });
  }

  async createUserGame(userId: number, isWin: boolean): Promise<User> {
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        total_games: { increment: 1 },
        total_wins: isWin ? { increment: 1 } : undefined,
      },
    });

    return user;
  }
}
