import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayNotEmpty, ArrayUnique, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { AllergenType } from 'src/shared/enums/AllergenType';

export class CreateUserPreferenceDto {

    @ApiProperty({
        description: 'Latitude of the user location',
        example: 6.5244,
    })
    @IsNotEmpty({ message: 'Latitude cannot be empty' })
    @IsNumber({}, { message: 'Latitude must be a number' })
    lat: number;

    @ApiProperty({
        description: 'Longitude of the user location',
        example: 3.3792,
    })
    @IsNotEmpty({ message: 'Longitude cannot be empty' })
    @IsNumber({}, { message: 'Longitude must be a number' })
    lng: number;

    @ApiProperty({
        description: 'List of allergens the user is sensitive to',
        example: ['tree', 'grass'],
        enum: AllergenType,
        isArray: true,
    })
    @IsArray()
    @ArrayNotEmpty({ message: 'Allergen list cannot be empty' })
    @ArrayUnique()
    @IsEnum(AllergenType, { each: true, message: 'Allergen must be one of: tree, grass, weed' })
    sensitiveTo: AllergenType[];

    @ApiProperty({
        description: 'Time of day to alert the user (in HH:mm format)',
        example: '08:00',
    })
    @IsOptional()
    @IsString({ message: 'Alert time must be a valid time string (e.g., 08:00)' })
    timeToAlert: string;
}
