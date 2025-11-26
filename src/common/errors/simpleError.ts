export type AppError = Error & {
    statusCode?: number;
    code?: string;
};

export function createError(statusCode: number, message: string, code?: string): AppError {
    const error = new Error(message) as AppError;
    error.statusCode = statusCode;
    error.code = code;
    return error;
}
