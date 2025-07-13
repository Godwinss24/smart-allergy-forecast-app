import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';

@Controller('queues')
export class QueuesController {
  constructor(private readonly queuesService: QueuesService) {}

 
}
