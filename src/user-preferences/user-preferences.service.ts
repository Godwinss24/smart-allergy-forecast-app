import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserPreferenceDto } from './dto/create-user-preference.dto';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';
import { UserPreference } from './entities/user-preference.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { createNotSuccessfulResponse, createResponse } from 'src/shared/utilities/createResponse';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserPreferencesService {
  constructor(@InjectRepository(UserPreference) private preferenceRepo: Repository<UserPreference>,
    private userService: UserService
  ) { }

  async createPreferences(userId: string, user: User, createUserPreferenceDto: CreateUserPreferenceDto) {
    const newPreferences = this.preferenceRepo.create({
      userId, user, ...createUserPreferenceDto
    });

    return await this.preferenceRepo.save(newPreferences);
  }

  findAll() {
    return `This action returns all userPreferences`;
  }

  async findOnePreference(id: string) {
    return await this.preferenceRepo.findOne({
      where: {
        id
      }
    })
  };

  async findUserPreference(userId: string) {
    return await this.preferenceRepo.findOne({
      where: {
        userId
      }
    })
  }

  update(id: number, updateUserPreferenceDto: UpdateUserPreferenceDto) {
    return `This action updates a #${id} userPreference`;
  }

  remove(id: number) {
    return `This action removes a #${id} userPreference`;
  };

  async handlePreferencesCreation(userId: string, createUserPreferenceDto: CreateUserPreferenceDto) {
    try {
      const user = await this.userService.findOneUser(userId);

      if (user === null) {
        throw new HttpException(createNotSuccessfulResponse("User not found"), HttpStatus.NOT_FOUND);
      };

      const newPreferences = await this.createPreferences(user.id, user, createUserPreferenceDto);

      const apiResponse = createResponse(true, newPreferences, "Preferences created");

      return apiResponse;

    } catch (error) {
      console.log(error)
      if (error instanceof HttpException) {
        throw error
      };

      throw new HttpException(createNotSuccessfulResponse("Something went wrong"), HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }

  async retrievePreferences(userId: string) {
    try {
      const user = await this.userService.findOneUser(userId);

      if (user === null) {
        throw new HttpException(createNotSuccessfulResponse("User not found"), HttpStatus.NOT_FOUND);
      };

      const preference = await this.findUserPreference(userId);

      if(preference){
        const apiResponse = createResponse(true, preference, "Details retrieved");
        return apiResponse
      }
      else{
        throw new HttpException(createNotSuccessfulResponse("Preference not found"), HttpStatus.NOT_FOUND);
      }

    } catch (error) {
      console.log(error)
      if (error instanceof HttpException) {
        throw error
      };

      throw new HttpException(createNotSuccessfulResponse("Something went wrong"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updatePreferences(userId: string, updatePreferenceDto: UpdateUserPreferenceDto){
    try {

      const user = await this.userService.findOneUser(userId);

      if (user === null) {
        throw new HttpException(createNotSuccessfulResponse("User not found"), HttpStatus.NOT_FOUND);
      };

      const preference = await this.findUserPreference(userId);

      if(!preference){
        throw new HttpException(createNotSuccessfulResponse("Preference not found"), HttpStatus.NOT_FOUND);
      };
      
      preference.lat = updatePreferenceDto.lat ? updatePreferenceDto.lat : preference.lat;

      preference.lng = updatePreferenceDto.lng ? updatePreferenceDto.lng : preference.lng;

      preference.sensitiveTo = updatePreferenceDto.sensitiveTo ? updatePreferenceDto.sensitiveTo : preference.sensitiveTo;

      preference.timeToAlert = updatePreferenceDto.timeToAlert ? updatePreferenceDto.timeToAlert : preference.timeToAlert;

      const updatedPreference = await this.preferenceRepo.save(preference);

      const apiResponse = createResponse(true, updatedPreference, "Peference updated");

      return apiResponse;

    } catch (error) {
      console.log(error)
      if (error instanceof HttpException) {
        throw error
      };

      throw new HttpException(createNotSuccessfulResponse("Something went wrong"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
