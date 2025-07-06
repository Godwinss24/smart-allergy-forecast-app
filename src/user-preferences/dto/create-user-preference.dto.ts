import { ArrayNotEmpty, ArrayUnique, IsArray, IsEnum, IsNotEmpty, IsNumber,  IsOptional, IsString } from "class-validator";
import { AllergenType } from "src/shared/enums/AllergenType";

export class CreateUserPreferenceDto {

    @IsNotEmpty({ message: 'Latitude cannot be empty' })
    @IsNumber({}, { message: 'Latitude must be a number' })
    lat: number;

    @IsNotEmpty({ message: 'Longitude cannot be empty' })
    @IsNumber({}, { message: 'Longitude must be a number' })
    lng: number;

    @IsArray()
    @ArrayNotEmpty({ message: 'Allergen list cannot be empty' })
    @ArrayUnique()
    @IsEnum(AllergenType, { each: true, message: 'Allergen must be one of: tree, grass, weed' })
    sensitiveTo: AllergenType[];

    @IsOptional()
    @IsString({ message: 'Alert time must be a valid time string (e.g., 08:00)' })
    timeToAlert: string;
}
