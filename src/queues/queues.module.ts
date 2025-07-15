import { Module } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { QueuesController } from './queues.controller';
import { PollenForecastsModule } from 'src/pollen-forecasts/pollen-forecasts.module';
import { AlertProcessorService } from './alert-processor/alert-processor.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    PollenForecastsModule,
    BullModule.registerQueue({
      name: "alert-users"
    })
  ],
  controllers: [QueuesController],
  providers: [QueuesService, AlertProcessorService],
})
export class QueuesModule { }
