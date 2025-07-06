import { IsEmail, IsNotEmpty, IsString, Matches, Min, MinLength } from "class-validator";


export class CreateUserDto {

    @IsEmail({}, { message: 'Email must be a valid email address.' })
    @IsString({ message: 'Email must be a string.' })
    @IsNotEmpty({ message: 'Email is required.' })
    email: string;

    @IsNotEmpty({ message: 'Password is required.' })
    @IsString({ message: 'Password must be a string.' })
    @MinLength(8, { message: 'Password must be at least 8 characters long.' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/, {
        message: 'Password must include lowercase, uppercase, number, and special character.',
    })
    password: string;

    @IsString({ message: 'First name must be a string.' })
    @IsNotEmpty({ message: 'First name is required.' })
    @MinLength(1, { message: 'First name must be at least 1 character long.' })
    firstName: string;

    @IsString({ message: 'Last name must be a string.' })
    @IsNotEmpty({ message: 'Last name is required.' })
    @MinLength(1, { message: 'Last name must be at least 1 character long.' })
    lastName: string;
}
