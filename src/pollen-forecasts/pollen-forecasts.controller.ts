import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PollenForecastsService } from './pollen-forecasts.service';
import { CreatePollenForecastDto } from './dto/create-pollen-forecast.dto';
import { UpdatePollenForecastDto } from './dto/update-pollen-forecast.dto';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller('pollen-forecasts')
export class PollenForecastsController {
  constructor(private readonly pollenForecastsService: PollenForecastsService) { }

  // @Post()
  // create(@Body() createPollenForecastDto: CreatePollenForecastDto) {
  //   return this.pollenForecastsService.create(createPollenForecastDto);
  // }


  // @Get()
  // async findAll(@Query('lat') lat: number, @Query('lng') lng: number) {
  //   return this.pollenForecastsService.fetchAndStoreForecast(lat, lng);
  // }

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
