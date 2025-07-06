import { Injectable } from '@nestjs/common';
import { CreatePollenForecastDto } from './dto/create-pollen-forecast.dto';
import { UpdatePollenForecastDto } from './dto/update-pollen-forecast.dto';

@Injectable()
export class PollenForecastsService {
  create(createPollenForecastDto: CreatePollenForecastDto) {
    return 'This action adds a new pollenForecast';
  }

  findAll() {
    return `This action returns all pollenForecasts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pollenForecast`;
  }

  update(id: number, updatePollenForecastDto: UpdatePollenForecastDto) {
    return `This action updates a #${id} pollenForecast`;
  }

  remove(id: number) {
    return `This action removes a #${id} pollenForecast`;
  }
}
