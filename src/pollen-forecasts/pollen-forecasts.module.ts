import { Module } from '@nestjs/common';
import { PollenForecastsService } from './pollen-forecasts.service';
import { PollenForecastsController } from './pollen-forecasts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollenForecast } from './entities/pollen-forecast.entity';
import { UserPreferencesModule } from 'src/user-preferences/user-preferences.module';
import { AlertModule } from 'src/alert/alert.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [TypeOrmModule.forFeature([PollenForecast]), UserPreferencesModule, AlertModule,
  BullModule.registerQueue({
    name: "fetch-forecasts"
  })
  ],
  controllers: [PollenForecastsController],
  providers: [PollenForecastsService],
  exports: [PollenForecastsService]
})
export class PollenForecastsModule { }
