import { ConfigService } from '@nestjs/config';
import { PrismaService } from './../../config/prisma/prisma.service';
import { Injectable, HttpException, Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}
}
