import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { UserPreference } from "src/user-preferences/entities/user-preference.entity";
import { PollenForecast } from "src/pollen-forecasts/entities/pollen-forecast.entity";
import { Alert } from "src/alert/entities/alert.entity";

export default (): TypeOrmModuleOptions => ({
    url: process.env.DATABASE_URL,
    type: 'postgres',
    synchronize: true,
    entities: [User, UserPreference, PollenForecast, Alert]
})