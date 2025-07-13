import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePollenForecastDto } from './dto/create-pollen-forecast.dto';
import { UpdatePollenForecastDto } from './dto/update-pollen-forecast.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PollenForecast } from './entities/pollen-forecast.entity';
import { Repository } from 'typeorm';
import { PollenLevel, WeatherData, WeatherResponse } from 'src/shared/interfaces/pollen';
import { createNotSuccessfulResponse, createResponse } from 'src/shared/utilities/createResponse';
import { PollenStatus } from 'src/shared/enums/PollenStatus';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from 'src/user/user.service';
import { UserPreference } from 'src/user-preferences/entities/user-preference.entity';
import { UserPreferencesService } from 'src/user-preferences/user-preferences.service';
import { AllergenType } from 'src/shared/enums/AllergenType';
import { CreateAlertDto } from 'src/alert/dto/create-alert.dto';
import { defaultAlertMessages } from 'src/alert/dto/defaultMessages';
import { AlertService } from 'src/alert/alert.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PollenForecastsService {
  private readonly apiKey = process.env.TOMORROW_IO_API_KEY;
  private readonly apiUrl = 'https://api.tomorrow.io/v4/weather/forecast';

  constructor(@InjectRepository(PollenForecast)
  private pollenRepo: Repository<PollenForecast>, private userPreferenceService: UserPreferencesService,
    private alertService: AlertService, @InjectQueue('fetch-forecasts') private queue: Queue
  ) { }

  async createForecast(createPollenForecastDto: CreatePollenForecastDto) {
    const newForecast = this.pollenRepo.create(createPollenForecastDto);
    return this.pollenRepo.save(newForecast);
  }

  findAllPreferences() {
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
        console.log(response)
        return null;
      };

      const res: WeatherResponse = await response.json();

      return res;
    } catch (error) {
      console.error(error)
      return null
    }
  };

  private generateAlertIfSensitive(user: UserPreference, pollenType: AllergenType, level: PollenStatus) {
    if ((level === PollenStatus.HIGH || level === PollenStatus.MODERATE) &&
      user.sensitiveTo.includes(pollenType)) {

      const createAlertDto: CreateAlertDto = {
        message: defaultAlertMessages[pollenType][level],
        risk_level: level
      };

      return this.alertService.createAlert(user.userId, createAlertDto);
    }
  };

  async fetchForecasts(user: UserPreference) {
    await this.queue.add("get-forecasts", user, { jobId: user.userId });
  }

  @Cron(CronExpression.EVERY_10_SECONDS, { waitForCompletion: true })
  async fetchAndStoreForecastForEachUser() {
    try {
      // 🔍 STEP 1: Get all users who have allergy preferences
      const users = await this.userPreferenceService.findAllPreferences();

      for (const user of users) {
        // console.log(user.userId); // Debug: log current user ID being processed

        // // 🌦 STEP 2: Fetch weather forecast data for the user’s location (lat/lng)
        // const forecast = await this.getForecasts(user.lat, user.lng);

        // // 🔥 Fail early if forecast is missing (e.g., API down)
        // if (!forecast) {
        //   throw new HttpException(
        //     createNotSuccessfulResponse("Unable to fetch forecasts"),
        //     HttpStatus.NOT_FOUND
        //   );
        // }

        // // 📆 STEP 3: Loop through each day in the forecast timeline
        // for (const day of forecast.timelines.daily) {
        //   const values = day.values;

        //   // 🧪 STEP 4: Extract relevant weather data needed for pollen estimation
        //   const weather: WeatherData = {
        //     temperatureAvg: values.temperatureAvg,
        //     windSpeedAvg: values.windSpeedAvg,
        //     rainAccumulation: values.rainAccumulationSum ?? 0,
        //     humidityAvg: values.humidityAvg,
        //     uvIndexMax: values.uvIndexMax,
        //   };

        //   // 🌼 STEP 5: Estimate pollen levels (tree, grass, weed) using weather heuristics
        //   const levels = this.estimatePollenLevels(weather);

        //   // 🌍 STEP 6: Prepare DTO to store forecast data in the DB
        //   const createForecastDto: CreatePollenForecastDto = {
        //     lat: user.lat,
        //     lng: user.lng,
        //     date: day.time,
        //     tree_pollen: levels.tree,
        //     grass_pollen: levels.grass,
        //     weed_pollen: levels.weed,
        //   };

        //   // 🚨 STEP 7: Check if forecast poses a risk based on user's sensitivity.
        //   // If yes, generate personalized alert for that allergen type.
        //   await this.generateAlertIfSensitive(user, AllergenType.TREE, levels.tree);
        //   await this.generateAlertIfSensitive(user, AllergenType.GRASS, levels.grass);
        //   await this.generateAlertIfSensitive(user, AllergenType.WEED, levels.weed);

        //   // 🧾 STEP 8: Store this forecast in the database
        //   await this.createForecast(createForecastDto);
        // }
        await this.fetchForecasts(user);
      }

      // ✅ STEP 9: Done. Forecasts and alerts successfully processed for all users.
      return createResponse(true, null, "Forecasts fetched");
    } catch (error) {
      console.log(error);

      if (error instanceof HttpException) {
        throw error;
      }

      // ❌ Unexpected error fallback
      throw new HttpException(
        createNotSuccessfulResponse("Unable to fetch forecasts"),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }



}
