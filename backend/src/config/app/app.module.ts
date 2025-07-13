import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import configuration from './configuration';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      ignoreEnvFile: process.env.APP_ENV === 'production',
      envFilePath: `.env.${process.env.APP_ENV}`,
    }),
    PrismaModule,
    RedisModule,
  ],
})
export class AppConfigModule {}
