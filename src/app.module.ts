import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserPreferencesModule } from './user-preferences/user-preferences.module';
import { PollenForecastsModule } from './pollen-forecasts/pollen-forecasts.module';
import config from './dbconfig/dbconfig';

@Module({
  imports: [UserModule, TypeOrmModule.forRootAsync({
    useFactory: config
  }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    AuthModule,
    UserPreferencesModule,
    PollenForecastsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
