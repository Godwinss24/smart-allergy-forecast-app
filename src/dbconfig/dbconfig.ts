import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";

export default (): TypeOrmModuleOptions => ({
    url: process.env.DATABASE_URL,
    type: 'postgres',
    synchronize: false,
    entities: [User]
})