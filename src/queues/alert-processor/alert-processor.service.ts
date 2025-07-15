import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PollenForecastsService } from 'src/pollen-forecasts/pollen-forecasts.service';
import { AllergenType } from 'src/shared/enums/AllergenType';
import { PollenStatus } from 'src/shared/enums/PollenStatus';
import { UserPreference } from 'src/user-preferences/entities/user-preference.entity';

/**
 * This service processes alerts for users based on their pollen sensitivity preferences.
 */
@Processor({ name: "alert-users" })
export class AlertProcessorService extends WorkerHost {
    constructor(private foreCastService: PollenForecastsService) {
        super();
    }

    async process(job: Job<{ user: UserPreference, levels: { tree: PollenStatus, grass: PollenStatus, weed: PollenStatus, } }>, token?: string): Promise<any> {
        await this.handleAlert(job.data.user, job.data.levels);
    }

    /**
     * This method processes the alert for a user based on their preferences and the pollen levels.
     * @param user UserPreference - The user for whom the alert is being processed.
     * @param level An object containing pollen levels for tree, grass, and weed.
     */
    async handleAlert(user: UserPreference, level: { tree: PollenStatus, grass: PollenStatus, weed: PollenStatus, }): Promise<void> {
        console.log(`Processing alert for user: ${user.id} with levels:`, level);
        await this.foreCastService.generateAlertIfSensitive(user, AllergenType.TREE, level.tree);
        await this.foreCastService.generateAlertIfSensitive(user, AllergenType.GRASS, level.grass);
        await this.foreCastService.generateAlertIfSensitive(user, AllergenType.WEED, level.weed);
    }

}
