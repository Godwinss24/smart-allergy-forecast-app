import { Module } from '@nestjs/common';
import { PollenForecastsService } from './pollen-forecasts.service';
import { PollenForecastsController } from './pollen-forecasts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollenForecast } from './entities/pollen-forecast.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PollenForecast])],
  controllers: [PollenForecastsController],
  providers: [PollenForecastsService],
})
export class PollenForecastsModule {}
