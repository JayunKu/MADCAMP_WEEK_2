import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { UpdateUserRequestDto } from '../auth/dtos/update-user-request.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async updateUser(
    id: string,
    updateUserRequestDto: UpdateUserRequestDto,
  ): Promise<User> {
    const { name, avatarId } = updateUserRequestDto;

    const updateData = {
      ...(name !== null && { name }),
      ...(avatarId !== null && { avartar_id: avatarId }),
    };

    return this.prismaService.user.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.prismaService.user.delete({
      where: { id },
    });
  }

  async createUserGame(userId: string, isWin: boolean): Promise<User> {
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
