'use strict';

const StatusCode = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
};

const ReasonStatusCode = {
    BAD_REQUEST: 'Bad request error',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Forbidden error',
    NOT_FOUND: 'Resource not found',
    CONFLICT: 'Conflict error',
    INTERNAL_SERVER_ERROR: 'Internal server error',
};

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT) {
        super(message, StatusCode.CONFLICT);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.BAD_REQUEST) {
        super(message, StatusCode.BAD_REQUEST);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = ReasonStatusCode.NOT_FOUND) {
        super(message, StatusCode.NOT_FOUND);
    }
}

class InternalServerError extends ErrorResponse {
    constructor(message = 'Internal Server Error', status = StatusCode.INTERNAL_SERVER_ERROR) {
        super(message, status);
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    NotFoundError,
    InternalServerError
};
