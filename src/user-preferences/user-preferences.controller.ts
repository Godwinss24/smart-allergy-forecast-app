import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, HttpStatus, HttpCode, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { CreateUserPreferenceDto } from './dto/create-user-preference.dto';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { CustomRequest } from 'src/shared/interfaces/CustomRequest';
import { createNotSuccessfulResponse } from 'src/shared/utilities/createResponse';

@UseGuards(JwtGuard)
@Controller('user-preferences')
export class UserPreferencesController {
  constructor(private readonly userPreferencesService: UserPreferencesService) { }

  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createPreferences(@Body() createUserPreferenceDto: CreateUserPreferenceDto, @Req() req: CustomRequest) {
    try {

      const userId = req.user.id;

      return await this.userPreferencesService.handlePreferencesCreation(userId, createUserPreferenceDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      };

      throw new HttpException(createNotSuccessfulResponse("Something went wrong"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Req() req: CustomRequest) {
    try {
      const userId = req.user.id;

      return await this.userPreferencesService.retrievePreferences(userId);

    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      };

      throw new HttpException(createNotSuccessfulResponse("Something went wrong"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  @HttpCode(HttpStatus.OK)
  @Post('update')
  async updateUserPreference(@Body() updatePreferenceDto: UpdateUserPreferenceDto,@Req() req: CustomRequest) {
    try {
      const userId = req.user.id;

      return await this.userPreferencesService.updatePreferences(userId, updatePreferenceDto);

    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      };

      throw new HttpException(createNotSuccessfulResponse("Something went wrong"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userPreferencesService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserPreferenceDto: UpdateUserPreferenceDto) {
    return this.userPreferencesService.update(+id, updateUserPreferenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userPreferencesService.remove(+id);
  }
}
