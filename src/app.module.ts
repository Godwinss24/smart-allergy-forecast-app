import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [UserModule, TypeOrmModule.forRoot({
    url: process.env.DATABASE_URL,
    entities: [User],
    type: 'postgres',
    synchronize: true
  }), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
