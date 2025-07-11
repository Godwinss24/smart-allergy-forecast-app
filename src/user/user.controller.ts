import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpCode, HttpStatus, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { createNotSuccessfulResponse } from '../shared/utilities/createResponse';
import { LoginDto } from './dto/login-user.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { ApiOperation } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: "Signs up the user", description: "Provide the user's email, password and names to create a user" })
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto) {
    try {

      return await this.userService.registerUser(createUserDto);

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      };

      throw new HttpException(createNotSuccessfulResponse("Something went wrong"), HttpStatus.INTERNAL_SERVER_ERROR);

    }
  };

  @ApiOperation({ summary: "Login ", description: "Provide the user's email, password to get JWT" })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {

      return await this.userService.loginUser(loginDto);

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      };

      throw new HttpException(createNotSuccessfulResponse("Something went wrong"), HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
