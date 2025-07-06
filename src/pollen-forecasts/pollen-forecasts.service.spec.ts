import { Test, TestingModule } from '@nestjs/testing';
import { PollenForecastsService } from './pollen-forecasts.service';

describe('PollenForecastsService', () => {
  let service: PollenForecastsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PollenForecastsService],
    }).compile();

    service = module.get<PollenForecastsService>(PollenForecastsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
