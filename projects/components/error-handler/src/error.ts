/* eslint-disable @typescript-eslint/naming-convention */

export class AppError extends Error {

    override message: string;
    statusCode: string;
    isOperational: boolean;
    description: string;

    constructor(message, isOperational, statusCode?, description?) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype);
        this.message = message;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
    }
}

export const httpStatusCodes = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500
};
