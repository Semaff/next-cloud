import { Request, Response, NextFunction } from "express";
import { ActivateRequest, AuthRequest, ChangePasswordRequest, DeleteAvatarRequest, DeleteRequest, GetOneRequest, SignInRequest, SignUpRequest, UploadAvatarRequest } from "./types";
import { validationResult } from "express-validator";
import AppError from "../../error/AppError";
import UserService from "../../services/UserService";

class UserController {
    /*
      Authentificate routes
      ===========
    */
    async signup(req: SignUpRequest, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw AppError.badRequest("Error when validating data: " + errors.array().join(" "));
            }

            const { firstname, lastname, email, password } = req.body;
            const parsedUser = await UserService.signup(firstname, lastname, email, password);

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
            const parsedUser = await UserService.signin(email, password);

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

            const parsedUser = await UserService.auth(userId);

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

    /*
      Get routes
      ===========
    */
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await UserService.getAll();
            return res.json(users);
        } catch (err) {
            next(err);
        }
    }

    async getOne(req: GetOneRequest, res: Response, next: NextFunction) {
        try {
            const { id: userId } = req.params;
            const user = await UserService.getOne(userId);
            return res.json(user);
        } catch (err) {
            next(err);
        }
    }

    /*
      Update routes
      =============
    */
    async activate(req: ActivateRequest, res: Response, next: NextFunction) {
        try {
            const { link: activationLink } = req.params;
            await UserService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (err) {
            next(err);
        }
    }

    async changePassword(req: ChangePasswordRequest, res: Response, next: NextFunction) {
        try {
            const { id: userId } = req.user;
            const { password } = req.body;

            const user = await UserService.changePassword(userId, password);
            return res.json(user);
        } catch (err) {
            next(err);
        }
    }

    async uploadAvatar(req: UploadAvatarRequest, res: Response, next: NextFunction) {
        try {
            const { id: userId } = req.user;
            const avatar = req.files?.avatar;

            const user = await UserService.uploadAvatar(userId, avatar);
            return res.json(user);
        } catch (err) {
            next(err);
        }
    }

    async deleteAvatar(req: DeleteAvatarRequest, res: Response, next: NextFunction) {
        try {
            const { id: userId } = req.user;
            const user = await UserService.deleteAvatar(userId);
            return res.json(user);
        } catch (err) {
            next(err);
        }
    }

    /*
      Delete routes
      =============
    */
    async delete(req: DeleteRequest, res: Response, next: NextFunction) {
        try {
            const { id: userId } = req.user;
            const user = await UserService.delete(userId);

            res.clearCookie("token");
            return res.json(user);
        } catch (err) {
            next(err);
        }
    }
}

export default new UserController();