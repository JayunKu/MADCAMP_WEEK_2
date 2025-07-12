import { CommonService } from 'src/common/common.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './../../config/prisma/prisma.service';
import { Injectable, HttpException, Logger } from '@nestjs/common';
import { LoginRequestDto } from './dtos/login-request.dto';
import { Request } from 'express';
import { SessionPayload } from './session/session.payload';
import { HashUtil } from 'src/common/utils/hash.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly commonService: CommonService,
  ) {}

  private logger = new Logger();

  private async createLoginLog(req: Request, success: boolean) {
    try {
      await this.prismaService.loginLog.create({
        data: {
          success,
          email: req.body.email,
          password: success ? null : req.body.password,
          ip: req.ip,
          time: new Date(),
        },
      });
    } catch (err) {
      this.logger.error(err);
      throw new HttpException('로그인 기록 생성에 문제가 발생하였습니다', 500);
    }
  }

  async login(req: Request, loginRequestDto: LoginRequestDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: loginRequestDto.email,
      },
    });

    if (!user) {
      await this.createLoginLog(req, false);
      throw new HttpException('해당 이메일의 유저가 없습니다', 401);
    } else if (
      this.configService.get('app.env') === 'production'
        ? !(await HashUtil.compare(loginRequestDto.password, user.password))
        : user.password !== loginRequestDto.password
    ) {
      await this.createLoginLog(req, false);
      throw new HttpException('비밀번호가 일치하지 않습니다', 401);
    }

    await this.createLoginLog(req, true);

    req.session.auth = new SessionPayload(user.id, user.type);
    req.session.save();
  }

  async loginUser(req: Request, userId: number) {
    const user = await this.commonService.checkUserExists(userId);

    req.session.auth = new SessionPayload(user.id, user.type);
    req.session.save();
  }

  logout(req: Request) {
    req.session.destroy((err) => {
      if (err) {
        this.logger.error(err);
        throw new HttpException('로그아웃에 문제가 발생하였습니다', 500);
      }
    });
  }
}
