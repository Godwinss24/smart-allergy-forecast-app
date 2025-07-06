import { IsNotEmpty, IsNumber, IsDateString, IsEnum } from 'class-validator';
import { PollenStatus } from 'src/shared/enums/PollenStatus';


export class CreatePollenForecastDto {
  @IsNotEmpty({ message: 'Latitude cannot be empty' })
  @IsNumber({}, { message: 'Latitude must be a number' })
  lat: number;

  @IsNotEmpty({ message: 'Longitude cannot be empty' })
  @IsNumber({}, { message: 'Longitude must be a number' })
  lng: number;

  @IsNotEmpty({ message: 'Date is required' })
  @IsDateString({}, { message: 'Date must be a valid ISO string (e.g., 2025-07-06T00:00:00Z)' })
  date: string;

  @IsNotEmpty({ message: 'Tree pollen level is required' })
  @IsEnum(PollenStatus, { message: 'Tree pollen must be Low, Moderate, or High' })
  tree_pollen: PollenStatus;

  @IsNotEmpty({ message: 'Grass pollen level is required' })
  @IsEnum(PollenStatus, { message: 'Grass pollen must be Low, Moderate, or High' })
  grass_pollen: PollenStatus;

  @IsNotEmpty({ message: 'Weed pollen level is required' })
  @IsEnum(PollenStatus, { message: 'Weed pollen must be Low, Moderate, or High' })
  weed_pollen: PollenStatus;
}
