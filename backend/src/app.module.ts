import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/app.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthzModule } from './modules/healthz/healthz.module';
import { UserModule } from './modules/user/user.module';
import { UserController } from './modules/user/user.controller';
import { UserService } from './modules/user/user.service';
import { RoomModule } from './modules/room/room.module';
import { CommonModule } from './modules/common/common.module';
import { PlayerModule } from './modules/player/player.module';
import { GameModule } from './modules/game/game.module';

@Module({
  imports: [
    AppConfigModule,
    AuthModule,
    HealthzModule,
    UserModule,
    PlayerModule,
    RoomModule,
    CommonModule,
    GameModule
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
