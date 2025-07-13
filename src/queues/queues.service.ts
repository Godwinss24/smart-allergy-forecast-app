import { Injectable } from '@nestjs/common';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Worker } from 'bullmq';
import { UserPreference } from 'src/user-preferences/entities/user-preference.entity';

@Processor('fetch-forecasts')
export class QueuesService extends WorkerHost {
  async process(job: Job<UserPreference>, token?: string): Promise<any> {
    await this.showSomething(`Worker 1: fetching forecast for ${job.data.userId}`);
  }

  async showSomething(data: string) {
    console.log(data);
  }

}


