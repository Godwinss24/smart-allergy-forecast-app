import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePollenForecastDto } from './dto/create-pollen-forecast.dto';
import { UpdatePollenForecastDto } from './dto/update-pollen-forecast.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PollenForecast } from './entities/pollen-forecast.entity';
import { Repository } from 'typeorm';
import { PollenLevel, WeatherData, WeatherResponse } from 'src/shared/interfaces/pollen';
import { createNotSuccessfulResponse } from 'src/shared/utilities/createResponse';
import { PollenStatus } from 'src/shared/enums/PollenStatus';

@Injectable()
export class PollenForecastsService {
  private readonly apiKey = process.env.TOMORROW_IO_API_KEY;
  private readonly apiUrl = 'https://api.tomorrow.io/v4/weather/forecast';

  constructor(@InjectRepository(PollenForecast)
  private pollenRepo: Repository<PollenForecast>,) {

  }

  async createForecast(createPollenForecastDto: CreatePollenForecastDto) {
    const newForecast = this.pollenRepo.create(createPollenForecastDto);
    return this.pollenRepo.save(newForecast);
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
  };

  private estimatePollenLevels(weather: WeatherData) {
    const { temperatureAvg, windSpeedAvg, rainAccumulation, humidityAvg, uvIndexMax } = weather;

    const dry = rainAccumulation === 0;
    const warm = temperatureAvg >= 22;
    const windy = windSpeedAvg >= 3;
    const sunny = uvIndexMax >= 6;

    function inferLevel(activeSeason: boolean): PollenStatus {
      if (!activeSeason) return PollenStatus.LOW;
      if (dry && warm && windy && sunny) return PollenStatus.HIGH;
      if (dry && (warm || windy)) return PollenStatus.MODERATE;
      return PollenStatus.LOW;
    }

    return {
      tree: inferLevel(true),
      grass: inferLevel(true),
      weed: inferLevel(true),
    };
  };

  async getForecasts(lat: number, lng: number): Promise<WeatherResponse | null> {
    try {
      const url = `${this.apiUrl}?location=${lat},${lng}&timesteps=daily&apikey=${this.apiKey}`;

      const response = await fetch(url);

      if (!response.ok) {
        return null;
      };

      const res: WeatherResponse = await response.json();

      return res;
    } catch (error) {
      console.error(error)
      return null
    }
  };

  async fetchAndStoreForecast(lat: number, lng: number): Promise<void> {
    try {
      const forecast = await this.getForecasts(lat, lng);

      if (!forecast) {
        throw new HttpException(createNotSuccessfulResponse("Unable to fetch forecasts"), HttpStatus.NOT_FOUND);
      };

      for (const day of forecast.timelines.daily) {
        const values = day.values;
        const weather: WeatherData = {
          temperatureAvg: values.temperatureAvg,
          windSpeedAvg: values.windSpeedAvg,
          rainAccumulation: values.rainAccumulationSum ?? 0,
          humidityAvg: values.humidityAvg,
          uvIndexMax: values.uvIndexMax,
        };

        const levels = this.estimatePollenLevels(weather);

        const createForecastDto: CreatePollenForecastDto = {
          lat,
          lng,
          date: day.time,
          tree_pollen: levels.tree,
          grass_pollen: levels.grass,
          weed_pollen: levels.weed,
        };

        const newForecast = await this.createForecast(createForecastDto);
        
      }


    } catch (error) {
      console.log(error)
    }
  }
}
