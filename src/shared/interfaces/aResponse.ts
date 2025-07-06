export interface aResponse<T> {
    successful: boolean,
    data: T,
    message: string
}