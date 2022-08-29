const AppError = require("../error/AppError");
const UserService = require("../services/UserService");

class UserController {
    async signup(req, res, next) {
        try {
            const { firstname, lastname, email, password } = req.body;
            if (!firstname || !lastname || !email || !password) {
                throw new Error('Not enough fields!');
            };

            const parsedUser = await UserService.signup(firstname, lastname, email, password);
            if (parsedUser instanceof Error) {
                throw new Error(parsedUser.message);
            }

            return res.json({ token: parsedUser.token, user: parsedUser.user });
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }

    async signin(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new Error("Not enough fields!");
            }

            const parsedUser = await UserService.signin(email, password);
            if (parsedUser instanceof Error) {
                throw new Error(parsedUser.message);
            }

            return res.json({ token: parsedUser.token, user: parsedUser.user });
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }

    async auth(req, res, next) {
        try {
            const { id } = req.user;

            const parsedUser = await UserService.auth(id);
            if (parsedUser instanceof Error) {
                throw new Error(parsedUser.message);
            }

            return res.json({ token: parsedUser.token, user: parsedUser.user });
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const users = await UserService.getAll();
            if (users instanceof Error) {
                throw new Error(users.message);
            }

            return res.json(users);
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }

    async getOne(req, res, next) {
        try {
            const { id: userId } = req.params;

            const user = await UserService.getOne(userId);
            if (user instanceof Error) {
                throw new Error(user.message);
            }

            return res.json(user);
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }

    async update(req, res, next) {
        try {
            const { id: userId } = req.params;
            const { password } = req.body;
            const { avatar } = req.files;

            const user = await UserService.update(userId, password, avatar);
            if (user instanceof Error) {
                throw new Error(user.message);
            }

            return res.json(user);
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }

    async delete(req, res, next) {
        try {
            const { id: userId } = req.params;

            const user = await UserService.delete(userId);
            if (user instanceof Error) {
                throw new Error(user.message);
            }

            return res.json(user);
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }
}

module.exports = new UserController();