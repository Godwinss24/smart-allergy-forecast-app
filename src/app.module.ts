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
import { ScheduleModule } from '@nestjs/schedule';
import { AlertModule } from './alert/alert.module';
import { BullModule } from '@nestjs/bullmq';
import { QueuesModule } from './queues/queues.module';

@Module({
  imports: [UserModule, TypeOrmModule.forRootAsync({
    useFactory: config
  }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          connection: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
          }
        }
      }
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserPreferencesModule,
    PollenForecastsModule,
    AlertModule,
    QueuesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
