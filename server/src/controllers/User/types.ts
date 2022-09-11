import { Request } from "express";
import { UploadedFile } from "express-fileupload";
import { User } from "src/models/UserModel";
import { JWTUser } from "../../types/JWTUser";

export interface AuthResponse {
    token: string,
    user: User
}

/* Auth Requests */
export interface SignUpRequest extends Request {
    body: {
        firstname: string,
        lastname: string,
        email: string,
        password: string
    }
}

export interface SignInRequest extends Request {
    body: {
        email: string,
        password: string
    }
}

export interface AuthRequest extends Request {
    user: JWTUser
}

/* Get Requests */
export interface GetOneRequest extends Request {
    params: {
        id: string
    }
}

/* Update Requests */
export interface ActivateRequest extends Request {
    params: {
        link: string
    }
}

export interface ChangePasswordRequest extends Request {
    user: JWTUser,
    body: {
        password: string
    }
}

export interface UploadAvatarRequest extends Request {
    user: JWTUser,
    files?: {
        avatar?: UploadedFile
    } | null
}

export interface DeleteAvatarRequest extends Request {
    user: JWTUser
}

/* Delete Requests */
export interface DeleteRequest extends Request {
    user: JWTUser
}