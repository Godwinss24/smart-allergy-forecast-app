import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PollenForecastsService } from './pollen-forecasts.service';
import { CreatePollenForecastDto } from './dto/create-pollen-forecast.dto';
import { UpdatePollenForecastDto } from './dto/update-pollen-forecast.dto';

@Controller('pollen-forecasts')
export class PollenForecastsController {
  constructor(private readonly pollenForecastsService: PollenForecastsService) {}

  @Post()
  create(@Body() createPollenForecastDto: CreatePollenForecastDto) {
    return this.pollenForecastsService.create(createPollenForecastDto);
  }

  @Get()
  findAll() {
    return this.pollenForecastsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollenForecastsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePollenForecastDto: UpdatePollenForecastDto) {
    return this.pollenForecastsService.update(+id, updatePollenForecastDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pollenForecastsService.remove(+id);
  }
}
