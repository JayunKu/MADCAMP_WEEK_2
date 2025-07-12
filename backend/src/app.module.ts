import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/app.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthzModule } from './modules/healthz/healthz.module';

@Module({
  imports: [
    AppConfigModule,
    // AuthModule,
    HealthzModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
