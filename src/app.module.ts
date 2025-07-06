import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './dbconfig/dbconfig';
@Module({
  imports: [UserModule, TypeOrmModule.forRootAsync({
    useFactory: config
  }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
