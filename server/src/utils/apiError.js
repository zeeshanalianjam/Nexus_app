class  ApiError {
    constructor(statusCode, message, error = null , success = false) {
        this.statusCode = statusCode;
        this.message = message;
        this.error = error;
        this.success = success;
    }
} 

export {ApiError };