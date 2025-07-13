import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class CommonService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserById(userId: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }
}
