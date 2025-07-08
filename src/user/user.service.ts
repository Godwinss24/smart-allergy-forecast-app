import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { createNotSuccessfulResponse, createResponse } from 'src/shared/utilities/createResponse';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  private saltRounds = 10;

  constructor(@InjectRepository(User) private userRepo: Repository<User>, private jwtService:JwtService) { }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = this.userRepo.create(createUserDto);
    return await this.userRepo.save(newUser);
  }

  async findAllUsers() {
    return await this.userRepo.find();
  }

  async findOneUser(userId: string) {
    return await this.userRepo.findOne({
      where: {
        id: userId
      }
    })
  };

  async findOneUserByEmail(userEmail: string) {
    return await this.userRepo.findOne({
      where: {
        email: userEmail
      }
    })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async hashPassword(plainPassword: string) {
    return await bcrypt.hash(plainPassword, this.saltRounds);
  };

  async comparePassword(plainPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  };

  async registerUser(createUserDto: CreateUserDto) {
    try {
      const user = await this.findOneUserByEmail(createUserDto.email);

      if (user !== null) {
        throw new HttpException(createNotSuccessfulResponse("An account with this email exists already"), HttpStatus.CONFLICT);
      };

      const hashedPassword = await this.hashPassword(createUserDto.password);

      createUserDto.password = hashedPassword;

      const newUser = await this.createUser(createUserDto);

      const apiResponse = createResponse(true, newUser, "User created");

      return apiResponse;

    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException(createNotSuccessfulResponse("Something went wrong"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  async loginUser(loginUserDto:LoginDto){
    try {
      const user = await this.findOneUserByEmail(loginUserDto.email);

      if (user === null) {
        throw new HttpException(createNotSuccessfulResponse("An account with this email does not exist"), HttpStatus.NOT_FOUND);
      };

      const isPassword =await this.comparePassword(loginUserDto.password, user.password);

      if(isPassword === false){
        throw new HttpException(createNotSuccessfulResponse("Invalid email or password"), HttpStatus.BAD_REQUEST);
      };

      const payload = {
        id: user.id,
        role: user.role
      };

      const accessToken = this.jwtService.sign(payload);

      const data = {
        email: user.email,
        accessToken
      };

      const apiResponse = createResponse(true, data, "Login successful");

      return apiResponse;
      
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException(createNotSuccessfulResponse("Something went wrong"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
