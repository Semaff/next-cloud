const { File, Folder } = require("../models/models");
const AppError = require("../error/AppError");
const fs = require("fs");
const FolderService = require("../services/FolderService");

class FolderController {
    async getAll(req, res, next) {
        try {
            const { curPath } = req.query;
            const { id: userId } = req.user;

            const parentFolderPath = FolderService.getFolderPath(userId, curPath);
            if (!fs.existsSync(parentFolderPath)) {
                throw new Error("There's no files in non-existing folder!");
            }

            const parentFolder = await Folder.findOne({ where: { path: parentFolderPath } });
            const folders = await Folder.findAll({ where: { userId, folderId: parentFolder.id } });
            return res.json(folders);
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }

    async createDir(req, res, next) {
        try {
            const { name, curPath } = req.body;
            const { id: userId } = req.user;

            const parentFolderPath = FolderService.getFolderPath(userId, curPath);
            console.log(parentFolderPath, curPath);

            if (!fs.existsSync(parentFolderPath)) {
                throw new Error("You can't create folder in non-existing one!");
            }

            const possibleFolderPath = FolderService.getFolderPath(userId, curPath + "\\" + name);
            if (fs.existsSync(possibleFolderPath)) {
                throw new Error("You can't create folder with the same names!");
            }

            const parentFolder = await Folder.findOne({ where: { path: parentFolderPath } });

            fs.mkdirSync(possibleFolderPath);
            const folder = await Folder.create({
                name,
                path: possibleFolderPath,
                folderId: parentFolder.id,
                userId
            });
            return res.json(folder);
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }

    async deleteDir(req, res, next) {
        try {
            const { name, curPath } = req.body;
            const { id: userId } = req.user;

            const folderPath = FolderService.getFolderPath(userId, curPath + "\\" + name);
            if (!fs.existsSync(folderPath)) {
                throw new Error("You can't delete non-existing folder!");
            }

            const folder = await Folder.findOne({ where: { path: folderPath } });
            const files = await File.findAll({ where: { folderId: folder.id, userId } });
            files.forEach(async (file) => await file.destroy());
            await folder.destroy();
            return res.json(folder);
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }
}

module.exports = new FolderController();