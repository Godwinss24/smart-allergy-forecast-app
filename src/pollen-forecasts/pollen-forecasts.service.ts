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

  /**
   * This method estimates pollen levels based on weather data.
   * 
   * @param weather the weather data object containing average temperature, wind speed, rain accumulation, humidity, and UV index.
   * 
   * @example estimatePollenLevels({  temperatureAvg: 25, windSpeedAvg: 4, rainAccumulation: 0, humidityAvg: 50, uvIndexMax: 7 });
   * 
   * @returns a PollenLevel object containing estimated pollen levels for tree, grass, and weed. e.g (tree: PollenStatus.HIGH, grass: PollenStatus.MODERATE, weed: PollenStatus.LOW)
   */
  estimatePollenLevels(weather: WeatherData) {
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

  /**
   * This method generates an alert for a user if they are sensitive to a specific pollen type and the pollen level is high or moderate.
   * @param user the user preference object containing the user's sensitivity information.
   * @param pollenType the type of pollen (tree, grass, or weed) to check against the user's sensitivity.
   * @param level the pollen level to check against the user's sensitivity. e.g PollenStatus.HIGH or PollenStatus.MODERATE.
   * @returns it returns a promise that resolves to the created alert or undefined if no alert was generated.
   */
   generateAlertIfSensitive(user: UserPreference, pollenType: AllergenType, level: PollenStatus) {
    if ((level === PollenStatus.HIGH || level === PollenStatus.MODERATE) &&
      user.sensitiveTo.includes(pollenType)) {

      const createAlertDto: CreateAlertDto = {
        message: defaultAlertMessages[pollenType][level],
        risk_level: level
      };

      return this.alertService.createAlert(user.userId, createAlertDto);
    }
  };

  /**
   * Adds a job to the BullMQ queue to fetch forecasts for a user.
   * 
   * Check the queue service for the job processing logic.
   * 
   * @param user the user preference object containing the user's location.
   */
  async fetchForecasts(user: UserPreference) {
    const date = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    console.log(`Adding job to fetch forecasts for user: ${user.userId}`);
    await this.queue.add("get-forecasts", user, { jobId: `${user.userId}-${date}` });
  }

  @Cron(CronExpression.EVERY_DAY_AT_7PM)
  async fetchAndStoreForecastForEachUser() {

    console.log("Fetching forecasts for all users...");
    try {
      // 🔍 STEP 1: Get all users who have allergy preferences
      const users = await this.userPreferenceService.findAllPreferences();

      if (!users || users.length === 0) {
        // ❌ No users found with preferences
        return createResponse(false, null, "No users with preferences found");
      };

      /**
       * For each user, we will:
       * add a job to the BullMQ queue to fetch their forecasts.
       */
      for (const user of users) {
        console.log(`Fetching forecasts for user: ${user.userId}`);
        // Add a job to the queue to fetch forecasts for this user
        await this.fetchForecasts(user);
      }

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
