import { Test, TestingModule } from '@nestjs/testing';
import { PollenForecastsController } from './pollen-forecasts.controller';
import { PollenForecastsService } from './pollen-forecasts.service';

describe('PollenForecastsController', () => {
  let controller: PollenForecastsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PollenForecastsController],
      providers: [PollenForecastsService],
    }).compile();

    controller = module.get<PollenForecastsController>(PollenForecastsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
