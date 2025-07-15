import { Test, TestingModule } from '@nestjs/testing';
import { AlertProcessorService } from './alert-processor.service';

describe('AlertProcessorService', () => {
  let service: AlertProcessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlertProcessorService],
    }).compile();

    service = module.get<AlertProcessorService>(AlertProcessorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
