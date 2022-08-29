const { User, File } = require("../models/models");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const FileService = require("./FileService");

class UserService {
    static generateJWT(id, firstname, lastname, email) {
        return jwt.sign(
            { id, firstname, lastname, email },
            process.env.SECRET_KEY,
            { expiresIn: '24h' }
        )
    }

    static async signup(firstname, lastname, email, password) {
        try {
            const candidate = await User.findOne({ where: { email } });
            if (candidate) {
                throw new Error('User with that e-mail already exists!');
            }

            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({ firstname, lastname, email, password: hashPassword });
            const token = this.generateJWT(user.id, user.firstname, user.lastname, user.email);

            const filesPath = FileService.getUsersFilesPath(user.id);
            const publicPath = FileService.getPublicPath() + "\\" + user.id;
            fs.mkdirSync(publicPath);
            fs.mkdirSync(filesPath);
            await File.create({
                name: user.id,
                type: "dir",
                path: filesPath,
                userId: user.id,
            });
            return { token, user };
        } catch (err) {
            return new Error(err.message);
        }
    }

    static async signin(email, password) {
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                throw new Error("User doesn't exist!");
            }

            const comparePassword = bcrypt.compareSync(password, user.password);
            if (!comparePassword) {
                throw new Error('Wrong password!');
            }

            const token = this.generateJWT(user.id, user.firstname, user.lastname, user.email);
            return { token, user };
        } catch (err) {
            return new Error(err.message);
        }
    }

    static async auth(userId) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User does not exist!');
            }

            const token = this.generateJWT(user.id, user.firstname, user.lastname, user.email);
            return { token, user };
        } catch (err) {
            return new Error(err.message);
        }
    }

    static async getAll() {
        try {
            return User.findAll();
        } catch (err) {
            return new Error(err.message);
        }
    }

    static async getOne(userId) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User does not exist!')
            }
            return user;
        } catch (err) {
            return new Error(err.message);
        }
    }

    static async update(userId, password, avatar) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User was not found!');
            }

            let parsedAvatar;
            if (avatar) {
                fs.rmSync(user.avatar);
                const publicPath = FileService.getPublicPath() + "\\" + userId;
                parsedAvatar = FileService.parseFile(avatar, publicPath);
            }

            const newAvatar = parsedAvatar.filePath || user.avatar;
            const newPassword = password || user.password;
            const hashPassword = await bcrypt.hash(newPassword, 5);
            await user.update({ password: hashPassword, avatar: newAvatar });
            return user;
        } catch (err) {
            return new Error(err.message);
        }
    }

    static async delete(userId) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User does not exist!');
            }

            const filesPath = FileService.getUsersFilesPath(userId);
            const publicPath = FileService.getPublicPath() + "\\" + user.id;
            fs.rmSync(filesPath, { recursive: true, force: true });
            fs.rmSync(publicPath, { recursive: true, force: true });

            const files = await File.findAll({ where: { userId: user.id } });
            files.forEach(async (file) => await file.destroy());
            await user.destroy();
            return user;
        } catch (err) {
            return new Error(err.message);
        }
    }
}

module.exports = UserService;