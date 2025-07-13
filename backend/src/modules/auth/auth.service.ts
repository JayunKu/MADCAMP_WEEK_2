import { ConfigService } from '@nestjs/config';
import { PrismaService } from './../../config/prisma/prisma.service';
import { Injectable, HttpException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { GoogleApiUserInfoDto } from './dtos/googleapi-userinfo.dto';
import { v1 } from 'uuid';
import { SessionPayload } from './session/session.payload';
import { Request } from 'express';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getUserFromGoogle(accessToken: string): Promise<GoogleApiUserInfoDto> {
    try {
      const response = await this.httpService.axiosRef.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return response.data as GoogleApiUserInfoDto;
    } catch (error) {
      Logger.error('Error validating user', error);
      throw new Error('Failed to validate user with Google');
    }
  }

  async login(req: Request, accessToken: string): Promise<User> {
    const googleUserInfo = await this.getUserFromGoogle(accessToken);

    if (!googleUserInfo || !googleUserInfo.email_verified) {
      throw new HttpException('Invalid Google access token', 401);
    }

    let user = await this.prismaService.user.findUnique({
      where: { google_user_id: googleUserInfo.sub },
    });

    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          id: v1(),
          name: googleUserInfo.name,
          google_user_id: googleUserInfo.sub,
          avartar_id: 0,
          total_games: 0,
          total_wins: 0,
        },
      });
    }

    req.session.auth = new SessionPayload(user.id, googleUserInfo.sub);
    req.session.save();

    return user;
  }
}
