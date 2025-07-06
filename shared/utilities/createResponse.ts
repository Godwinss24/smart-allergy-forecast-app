import { aResponse } from "shared/interfaces/aResponse";

export function createResponse<T>(successful: boolean, data: T, message: string): aResponse<T> {
    return {
        data,
        successful,
        message
    }
};

export function createNotSuccessfulResponse(message: string): aResponse<null> {
    return {
        data: null,
        successful:false,
        message
    }
}