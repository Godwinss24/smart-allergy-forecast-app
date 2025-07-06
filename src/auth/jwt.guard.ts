import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JsonWebTokenError, JwtService, TokenExpiredError } from "@nestjs/jwt";
import { UserRole } from "../shared/enums/UserRole";
import { CustomRequest } from "../shared/interfaces/CustomRequest";
import { createNotSuccessfulResponse } from "../shared/utilities/createResponse";

@Injectable()
export class JwtGuard implements CanActivate {

    constructor(private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        try {
            const request = context.switchToHttp().getRequest<CustomRequest>();

            const authorizationHeader = request.headers['authorization'] as string;

            if (!authorizationHeader) {
                throw new HttpException(createNotSuccessfulResponse("Authorization header missing"), HttpStatus.UNAUTHORIZED);
            };

            const token = authorizationHeader.split(' ')[1];

            if (!token) {
                throw new HttpException(createNotSuccessfulResponse("Invalid Authorization header"), HttpStatus.UNAUTHORIZED);
            };

            const payload = this.jwtService.verify<{ id: string, role: UserRole }>(token);

            request.user = payload;

            return true;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            };

            if(error instanceof TokenExpiredError){
                throw new HttpException(createNotSuccessfulResponse("Token expired"), HttpStatus.UNAUTHORIZED);
            };

            if(error instanceof JsonWebTokenError){
                throw new HttpException(createNotSuccessfulResponse("Invalid JWT"), HttpStatus.UNAUTHORIZED);
            };

            throw new HttpException(createNotSuccessfulResponse("Something went wrong"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}