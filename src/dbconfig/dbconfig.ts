import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { UserPreference } from "src/user-preferences/entities/user-preference.entity";

export default (): TypeOrmModuleOptions => ({
    url: process.env.DATABASE_URL,
    type: 'postgres',
    synchronize: false,
    entities: [User, UserPreference]
})