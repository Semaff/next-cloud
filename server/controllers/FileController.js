const { File, Folder } = require("../models/models");
const AppError = require("../error/AppError");
const fs = require("fs");
const FileService = require("../services/FileService");
const FolderService = require("../services/FolderService");

class FileController {
    async getAll(req, res, next) {
        try {
            const { curPath } = req.query;
            const { id: userId } = req.user;

            const folderPath = FolderService.getFolderPath(userId, curPath);
            if (!fs.existsSync(folderPath)) {
                throw new Error("There's no files in non-existing folder!");
            }

            const folder = await Folder.findOne({ where: { path: folderPath } });
            const files = await File.findAll({ where: { userId, folderId: folder.id } });
            return res.json(files);
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }

    async getOne(req, res, next) {
        try {
            const { id: userId } = req.user;

            const file = await File.findOne({ where: { id: req.params.id, userId } });
            if (!file) {
                throw new Error('File does not exist!')
            }

            return res.json(file);
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }

    async create(req, res, next) {
        try {
            const { id: userId } = req.user;
            const { name, curPath } = req.body;

            const parentFolderPath = FolderService.getFolderPath(userId, curPath);
            if (!fs.existsSync(parentFolderPath)) {
                throw new Error("You can't create files in non-existing folder!");
            }

            // Parse Files
            const parsedCover = FileService.parseFile(req.files.cover, parentFolderPath);
            const parsedFile = FileService.parseFile(req.files.file,)

            if (!parsedFile) {
                throw new Error("You need to upload file to create one!");
            }

            if (parsedFile.type === "application" && parsedFile.ext !== "zip" && parsedFile.ext !== "rar") {
                throw new Error("You can't download this kind of Applications!")
            }

            const parentFolder = await Folder.findOne({ where: { path: parentFolderPath } })
            const file = await File.create({
                name,
                userId,
                type: parsedFile.type,
                size: parsedFile.size,
                path: parsedFile.path,
                cover: parsedCover.path,
                folderId: parentFolder.id
            });
            return res.json(file);
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }

    async updateOne(req, res, next) {
        try {
            const { id: userId } = req.user;
            const { name } = req.body;

            const file = await File.findOne({ where: { id: req.params.id, userId } });
            if (!file) {
                throw new Error('File does not exist!');
            }

            const newName = name || file.name;
            await file.update({ name: newName });
            return res.json(file);
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }

    async deleteOne(req, res, next) {
        try {
            const { id: userId } = req.user;

            const file = await File.findOne({ where: { id: req.params.id, userId } });
            if (!file) {
                throw new Error('File does not exist!');
            }

            fs.rmSync(file.path, { recursive: true, force: true });
            await file.destroy();
            return res.json(file);
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }
}

module.exports = new FileController();