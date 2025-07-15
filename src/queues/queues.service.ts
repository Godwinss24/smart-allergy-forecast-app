import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue, Worker } from 'bullmq';
import { UserPreference } from 'src/user-preferences/entities/user-preference.entity';
import { PollenForecastsService } from 'src/pollen-forecasts/pollen-forecasts.service';
import { createNotSuccessfulResponse } from 'src/shared/utilities/createResponse';
import { WeatherData } from 'src/shared/interfaces/pollen';
import { CreatePollenForecastDto } from 'src/pollen-forecasts/dto/create-pollen-forecast.dto';

/**
 * This service is responsible for fetching pollen forecasts for users
 */
@Processor('fetch-forecasts')
export class QueuesService extends WorkerHost {
  constructor(private foreCastService: PollenForecastsService, @InjectQueue('alert-users') private alertQueue: Queue) {
    super();
  }

  async process(job: Job<UserPreference>, token?: string): Promise<any> {
    await this.fetchForecasts(job.data);
  }

  async fetchForecasts(user: UserPreference): Promise<void> {

    console.log(`Fetching forecasts for user: ${user.id} at location: (${user.lat}, ${user.lng})`);
    // Fetch the weather forecast for the user's location
    const forecast = await this.foreCastService.getForecasts(user.lat, user.lng);

    if (!forecast) {
      throw new HttpException(
        createNotSuccessfulResponse('Failed to fetch forecasts'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    };

    /**
     * Iterate through the daily timelines of the forecast,
     * estimate pollen levels based on the weather data,
     * create a job for each user in the alert queue,
     * and create a forecast for each day.
     */
    
    for (const day of forecast.timelines.daily) {

      const values = day.values;

      const weather: WeatherData = {
        temperatureAvg: values.temperatureAvg,
        windSpeedAvg: values.windSpeedAvg,
        rainAccumulation: values.rainAccumulationSum ?? 0,
        humidityAvg: values.humidityAvg,
        uvIndexMax: values.uvIndexMax,
      };

      /**
       * Estimate pollen levels based on the weather data.
       * e.g of returned levels: {tree: PollenStatus.HIGH, grass: PollenStatus.MODERATE, weed: PollenStatus.LOW}
       */
      const levels = this.foreCastService.estimatePollenLevels(weather);

      const createForecastDto: CreatePollenForecastDto = {
        lat: user.lat,
        lng: user.lng,
        date: day.time,
        tree_pollen: levels.tree,
        grass_pollen: levels.grass,
        weed_pollen: levels.weed,
      };

      // This because everyday's forecast is unique, we can use the date and user id as a job ID
      const date = new Date().toISOString().split('T')[0];

      // Add the job to the alert queue with a unique job ID
      // levels is an object containing pollen levels for tree, grass, and weed
      await this.alertQueue.add('alert-users', { user: user, levels: levels }, { jobId: `${user.id}-${date}` });

      // Store the forecast in the database
      await this.foreCastService.createForecast(createForecastDto);
    }
  }

}


