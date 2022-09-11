import jwt from "jsonwebtoken";

export function generateJWT(id: number | string, firstname: string, lastname: string, email: string): string {
    return jwt.sign(
        { id, firstname, lastname, email },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    )
}