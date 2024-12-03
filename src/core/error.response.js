'use strict';

const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCode');


class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.CONFLICT) {
        super(message, StatusCodes.CONFLICT);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.BAD_REQUEST) {
        super(message, StatusCodes.BAD_REQUEST);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_FOUND) {
        super(message, StatusCodes.NOT_FOUND);
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, status = StatusCodes.UNAUTHORIZED) {
        super(message, status);
    }
}

class InternalServerError extends ErrorResponse {
    constructor(message = ReasonPhrases.INTERNAL_SERVER_ERROR, status = StatusCodes.INTERNAL_SERVER_ERROR) {
        super(message, status);
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    NotFoundError,
    InternalServerError,
    AuthFailureError
};
