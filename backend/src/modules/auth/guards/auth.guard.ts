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

    if (req.query.key) {
      const validKey = await this.prismaService.key.findUnique({
        where: {
          key: req.query.key.toString(),
        },
      });

      if (!validKey) {
        throw new HttpException('유효하지 않은 키입니다', 401);
      }
      req.keyAuth = true;

      return true;
    }

    if (!req.session.auth) {
      throw new HttpException('로그인이 필요한 서비스입니다', 401);
    }

    const user: User = await this.prismaService.user.findUnique({
      where: {
        id: req.session.auth.uid,
      },
    });
    req.user = user;

    return true;
  }
}
