import { Request, Response, NextFunction } from "express";
import { UserAuthService, UserDeletorService, UserGetterService, UserUpdatorService } from "../../services/User";
import { ActivateRequest, AuthRequest, ChangePasswordRequest, DeleteAvatarRequest, DeleteRequest, GetOneRequest, SignInRequest, SignUpRequest, UploadAvatarRequest } from "./types";
import { validationResult } from "express-validator";
import AppError from "../../error/AppError";

class UserController {
    async signup(req: SignUpRequest, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw AppError.badRequest("Error when validating data: " + errors.array().join(" "));
            }

            const { firstname, lastname, email, password } = req.body;
            const parsedUser = await UserAuthService.signup(firstname, lastname, email, password);

            // if we would have https, then we can add {secure: true}
            res.cookie("token", parsedUser.token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // maxAge: 1 day
            return res.json({ token: parsedUser.token, user: parsedUser.user });
        } catch (err) {
            next(err);
        }
    }

    async signin(req: SignInRequest, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw AppError.badRequest("Error when validating data: " + errors.array().join(" "));
            }

            const { email, password } = req.body;
            const parsedUser = await UserAuthService.signin(email, password);

            // if we would have https, then we can add {secure: true}
            res.cookie("token", parsedUser.token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // maxAge: 1 day
            return res.json({ token: parsedUser.token, user: parsedUser.user });
        } catch (err) {
            next(err);
        }
    }

    async auth(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id: userId } = req.user;

            const parsedUser = await UserAuthService.auth(userId);

            // if we would have https, then we can add {secure: true}
            res.cookie("token", parsedUser.token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // maxAge: 1 day
            return res.json({ token: parsedUser.token, user: parsedUser.user });
        } catch (err) {
            next(err);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            res.clearCookie("token");
            return res.json({ message: "Logged out!" });
        } catch (err) {
            next(err);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await UserGetterService.getAll();
            return res.json(users);
        } catch (err) {
            next(err);
        }
    }

    async getOne(req: GetOneRequest, res: Response, next: NextFunction) {
        try {
            const { id: userId } = req.params;
            const user = await UserGetterService.getOne(userId);
            return res.json(user);
        } catch (err) {
            next(err);
        }
    }

    async activate(req: ActivateRequest, res: Response, next: NextFunction) {
        try {
            const { link: activationLink } = req.params;
            await UserUpdatorService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (err) {
            next(err);
        }
    }

    async changePassword(req: ChangePasswordRequest, res: Response, next: NextFunction) {
        try {
            const { id: userId } = req.user;
            const { password } = req.body;

            const user = await UserUpdatorService.changePassword(userId, password);
            return res.json(user);
        } catch (err) {
            next(err);
        }
    }

    async uploadAvatar(req: UploadAvatarRequest, res: Response, next: NextFunction) {
        try {
            const { id: userId } = req.user;
            const avatar = req.files?.avatar;

            const user = await UserUpdatorService.uploadAvatar(userId, avatar);
            return res.json(user);
        } catch (err) {
            next(err);
        }
    }

    async deleteAvatar(req: DeleteAvatarRequest, res: Response, next: NextFunction) {
        try {
            const { id: userId } = req.user;
            const user = await UserUpdatorService.deleteAvatar(userId);
            return res.json(user);
        } catch (err) {
            next(err);
        }
    }

    async delete(req: DeleteRequest, res: Response, next: NextFunction) {
        try {
            const { id: userId } = req.user;
            const user = await UserDeletorService.delete(userId);

            res.clearCookie("token");
            return res.json(user);
        } catch (err) {
            next(err);
        }
    }
}

export default new UserController();