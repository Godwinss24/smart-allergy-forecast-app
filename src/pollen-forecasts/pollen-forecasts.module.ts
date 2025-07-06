import { Module } from '@nestjs/common';
import { PollenForecastsService } from './pollen-forecasts.service';
import { PollenForecastsController } from './pollen-forecasts.controller';

@Module({
  controllers: [PollenForecastsController],
  providers: [PollenForecastsService],
})
export class PollenForecastsModule {}
