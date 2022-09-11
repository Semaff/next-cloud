class AppError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }

    static badRequest(message: string) {
        return new AppError(400, message);
    }

    static notAuthorized(message: string) {
        return new AppError(401, message);
    }

    static forbidden(message: string) {
        return new AppError(403, message);
    }

    static notFound(message: string) {
        return new AppError(404, message);
    }

    static internal(message: string) {
        return new AppError(500, message);
    }
}

export default AppError;