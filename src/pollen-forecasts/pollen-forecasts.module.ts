import { Module } from '@nestjs/common';
import { PollenForecastsService } from './pollen-forecasts.service';
import { PollenForecastsController } from './pollen-forecasts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollenForecast } from './entities/pollen-forecast.entity';
import { UserPreferencesModule } from 'src/user-preferences/user-preferences.module';

@Module({
  imports: [TypeOrmModule.forFeature([PollenForecast]), UserPreferencesModule],
  controllers: [PollenForecastsController],
  providers: [PollenForecastsService],
})
export class PollenForecastsModule {}
