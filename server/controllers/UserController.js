const { User, Folder, File } = require("../models/models");
const AppError = require("../error/AppError");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const FolderService = require("../services/FolderService");
const UserService = require("../services/UserService");

class UserController {
    async signup(req, res, next) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                throw new Error('Wrong Username or Password');
            };

            const candidate = await User.findOne({ where: { username } });
            if (candidate) {
                throw new Error('User with that E-mail already exists!');
            }

            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({ username, password: hashPassword });
            const token = UserService.generateJWT(user.id, user.username);

            const rootFolder = FolderService.getRootFolder(user.id);
            await Folder.create({
                name: user.id,
                userId: user.id,
                path: rootFolder
            });
            return res.json({ token: token })
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }

    async signin(req, res, next) {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({ where: { username } });
            if (!user) {
                throw new Error('User does not exist!');
            }

            let comparePassword = bcrypt.compareSync(password, user.password);
            if (!comparePassword) {
                throw new Error('Wrong password!');
            }

            const token = UserService.generateJWT(user.id, user.username);
            return res.json({ token: token })
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }

    async checkAuth(req, res, next) {
        try {
            const { id, username } = req.user;

            const user = await User.findByPk(id);
            if (!user) {
                throw new Error('User does not exist!');
            }

            const token = UserService.generateJWT(user.id, user.username);
            return res.json({ token: token });
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const users = await User.findAll();
            return res.json(users);
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error("Wrong id!");
            }

            const user = await User.findByPk(req.params.id);
            if (!user) {
                throw new Error('User does not exist!')
            }

            return res.json(user);
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }

    async updateOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Wrong id!');
            }

            const user = await User.findByPk(req.params.id);
            if (!user) {
                throw new Error('User does not found!');
            }

            let comparePassword = bcrypt.compareSync(req.body.password, user.password);
            if (comparePassword) {
                throw new Error('Password is the same as old!');
            }

            const password = req.body.password || user.password;
            const hashPassword = await bcrypt.hash(password, 5);
            await user.update({ password: hashPassword });
            return res.json(user);
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }

    async deleteOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Wrong id!');
            }

            const user = await User.findByPk(req.params.id);
            if (!user) {
                throw new Error('User does not found!');
            }

            const rootPath = FolderService.getRootFolder(user.id);
            fs.rmSync(rootPath, { recursive: true, force: true });

            const folders = await Folder.findAll({ where: { userId: user.id } });
            const files = await File.findAll({ where: { userId: user.id } });
            files.forEach(async (file) => await file.destroy());
            folders.forEach(async (folder) => await folder.destroy());
            await user.destroy();
            return res.json(user);
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }
}

module.exports = new UserController();