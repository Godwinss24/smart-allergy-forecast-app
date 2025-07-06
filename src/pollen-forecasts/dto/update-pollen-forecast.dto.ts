import { PartialType } from '@nestjs/mapped-types';
import { CreatePollenForecastDto } from './create-pollen-forecast.dto';

export class UpdatePollenForecastDto extends PartialType(CreatePollenForecastDto) {}
