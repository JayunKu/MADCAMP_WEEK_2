import { PrismaService } from '../../../config/prisma/prisma.service';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '@prisma/client';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    if (!req.session.auth) {
      throw new HttpException('로그인이 필요한 서비스입니다', 401);
    }

    const user: User | null = await this.prismaService.user.findUnique({
      where: {
        id: req.session.auth.uid,
      },
    });

    if (!user) {
      throw new HttpException('사용자를 찾을 수 없습니다', 401);
    }

    req.user = user;

    return true;
  }
}
