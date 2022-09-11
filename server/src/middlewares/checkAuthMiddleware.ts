import { Request, Response, NextFunction } from "express";
import { JWTUser } from "../types/JWTUser";
import jwt from "jsonwebtoken";
import AppError from "../error/AppError";

function checkAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // token=... || Bearer ...
        if (!token) {
            throw new Error("Not authorized");
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY) as JWTUser;
        if (!decoded) {
            throw new Error("Wrong token!");
        }
        req.user = decoded;
        next();
    } catch (err) {
        next(AppError.badRequest((err as Error).message));
    }
}

export default checkAuth;