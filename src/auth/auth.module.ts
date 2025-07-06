import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { JwtGuard } from './jwt.guard';
dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '24h'
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard],
  exports: [JwtModule, JwtGuard]
})
export class AuthModule { }
