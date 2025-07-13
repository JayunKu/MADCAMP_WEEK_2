import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/app.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthzModule } from './modules/healthz/healthz.module';
import { UserModule } from './modules/user/user.module';
import { UserController } from './modules/user/user.controller';
import { UserService } from './modules/user/user.service';

@Module({
  imports: [AppConfigModule, AuthModule, HealthzModule, UserModule],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
