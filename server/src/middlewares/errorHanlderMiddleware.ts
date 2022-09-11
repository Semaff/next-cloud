import { Request, Response, NextFunction } from "express";
import AppError from "../error/AppError";

const errorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err.message);
    if (err instanceof AppError) {
        return res.status(err.status).json({ message: err.message });
    }

    return res.status(500).json({ message: `${err}` });
}

export default errorHandlerMiddleware;