import AppError from "../error/AppError";
import bcrypt from "bcrypt";
import fs from "fs-extra";
import MailService from "./MailService";
import FileSystemService from "./FileSystemService";
import { User } from "../models/UserModel";
import { v4 } from "uuid";
import { generateJWT } from "../utils/generateJWT";
import { File } from "../models/FileModel";
import { UploadedFile } from "express-fileupload";
import { AuthResponse } from "../controllers/User/types";

class UserService {
    /*
      Authentificate functions
      ========================
    */
    static async signup(firstname: string, lastname: string, email: string, password: string): Promise<AuthResponse> {
        const candidate = await User.findOne({ where: { email } });
        if (candidate) {
            throw AppError.badRequest("User with that email already exists!");
        }

        /* Create User */
        const activationLink = v4();
        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({ firstname, lastname, email, password: hashPassword, activationLink });
        const token = generateJWT(user.id, user.firstname, user.lastname, user.email);

        // async function, but we don't want user to 'wait' for the response
        new MailService().sendActivationLetter(email, `${process.env.SERVER_URL}/api/user/activate/${activationLink}`);

        /* Make folders in the FileSystem */
        const rootStoragePath = FileSystemService.getRootStoragePath(user.id);
        const rootFilesPath = FileSystemService.getRootFilesPath(user.id);
        fs.mkdirSync(rootStoragePath, { recursive: true });
        fs.mkdirSync(rootFilesPath, { recursive: true });

        /* Create File */
        const storagePath = FileSystemService.getStoragePath(user.id);
        await File.create({
            name: String(user.id),
            type: "dir",
            path: storagePath,
            userId: user.id
        });
        return { token, user };
    }

    static async signin(email: string, password: string): Promise<AuthResponse> {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw AppError.badRequest("User doesn't exist!");
        }

        const comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            throw AppError.badRequest('Wrong password!');
        }

        const token = generateJWT(user.id, user.firstname, user.lastname, user.email);
        return { token, user };
    }

    static async auth(userId: number | string): Promise<AuthResponse> {
        const user = await User.findByPk(userId);
        if (!user) {
            throw AppError.badRequest('User does not exist!');
        }

        const token = generateJWT(user.id, user.firstname, user.lastname, user.email);
        return { token, user };
    }

    /*
      Get functions
      =============
    */
    static async getAll(): Promise<User[]> {
        const users = await User.findAll();
        return users;
    }

    static async getOne(userId: number | string): Promise<User> {
        const user = await User.findByPk(userId);
        if (!user) {
            throw AppError.badRequest('User does not exist!')
        }
        return user;
    }

    /*
      Update functions
      ================
    */
    static async activate(activationLink: string): Promise<User> {
        const user = await User.findOne({ where: { activationLink } });
        if (!user) {
            throw AppError.badRequest("Incorrect activation link")
        }

        await user.update({ isActivated: true });
        return user;
    }

    static async changePassword(userId: number | string, password: string): Promise<User> {
        const user = await User.findByPk(userId);
        if (!user) {
            throw AppError.badRequest('User was not found!');
        }

        if (bcrypt.compareSync(password, user.password)) {
            throw AppError.badRequest("Password is the same as old!");
        }

        const newPassword = password || user.password;
        const hashPassword = await bcrypt.hash(newPassword, 5);
        await user.update({ password: hashPassword });
        return user;
    }

    static async uploadAvatar(userId: number | string, avatar?: UploadedFile): Promise<User> {
        if (!avatar) {
            throw AppError.badRequest("You must upload avatar!")
        }

        const user = await User.findByPk(userId);
        if (!user) {
            throw AppError.badRequest('User was not found!');
        }

        if (user.avatar) {
            fs.rmSync(FileSystemService.getRootPath() + "\\" + user.avatar);
        }

        const rootFilesPath = FileSystemService.getRootFilesPath(userId);
        const filesPath = FileSystemService.getFilesPath(userId);
        const parsedAvatar = await FileSystemService.parseFile(avatar, rootFilesPath, filesPath);

        const newAvatar = parsedAvatar.path || user.avatar;
        await user.update({ avatar: newAvatar });
        return user;
    }

    static async deleteAvatar(userId: number | string): Promise<User> {
        const user = await User.findByPk(userId);
        if (!user) {
            throw AppError.badRequest('User was not found!');
        }

        if (!user.avatar) {
            throw AppError.badRequest("You don't have avatar to delete!");
        }

        const avatarPath = FileSystemService.getRootPath() + "\\" + user.avatar;
        fs.rmSync(avatarPath);
        await user.update({ avatar: null });
        return user;
    }

    /*
      Delete functions
    */
    static async delete(userId: number | string): Promise<User> {
        const user = await User.findByPk(userId);
        if (!user) {
            throw AppError.badRequest('User does not exist!');
        }

        /* Delete all the user's folders from server */
        const rootFilesPath = FileSystemService.getRootFilesPath(userId);
        const rootStoragePath = FileSystemService.getRootStoragePath(userId);
        fs.rmSync(rootFilesPath, { recursive: true, force: true });
        fs.rmSync(rootStoragePath, { recursive: true, force: true });

        /* Delete all the user's files */
        const files = await File.findAll({ where: { userId } });
        files.forEach(async (file) => {
            await file.destroy()
        });

        await user.destroy();
        return user;
    }
}

export default UserService;