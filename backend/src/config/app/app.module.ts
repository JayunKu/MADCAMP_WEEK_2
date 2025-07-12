import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import configuration from './configuration';

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
  ],
})
export class AppConfigModule {}
