import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { createNotSuccessfulResponse } from "shared/utilities/createResponse";

@Injectable()
export class CustomValidationPipe implements PipeTransform {

    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        };

        const object = plainToInstance(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            const newArr = errors.map((err) => {
                const objectValues = Object.values(err.constraints || {}).join(', ')
                return `Invalid ${err.property}: ${objectValues}`
            }).join(',');
            throw new HttpException(createNotSuccessfulResponse(`${newArr}`), HttpStatus.BAD_REQUEST);
        }
        return value;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}