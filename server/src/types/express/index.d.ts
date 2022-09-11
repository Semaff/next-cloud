import { JwtPayload } from "jsonwebtoken";
import { JWTUser } from "../JWTUser";

declare global {
    namespace Express {
        interface Request {
            user: JWTUser
        }
    }
}