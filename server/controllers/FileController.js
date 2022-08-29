const AppError = require("../error/AppError");
const FileService = require("../services/FileService");

class FileController {
    async getAll(req, res, next) {
        try {
            const { path: curPath } = req.query;
            const { id: userId } = req.user;

            const files = await FileService.getAll(userId, curPath);
            if (files instanceof Error) {
                throw new Error(files.message);
            }

            return res.json(files);
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }

    async getOne(req, res, next) {
        try {
            const { id: userId } = req.user;
            const { id: fileId } = req.params;

            const file = await FileService.getOne(userId, fileId);
            if (file instanceof Error) {
                throw new Error(file.message);
            }

            return res.json(file);
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }

    async createFolder(req, res, next) {
        try {
            const { id: userId } = req.user;
            const { path: curPath, name } = req.body;

            const createdFile = await FileService.createFolder(userId, name, curPath);
            if (createdFile instanceof Error) {
                throw new Error(createdFile.message);
            }

            return res.json(createdFile);
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }

    async uploadFile(req, res, next) {
        try {
            const { id: userId } = req.user;
            const { path: curPath, name } = req.body;
            const { file } = req.files;

            const createdFile = await FileService.uploadFile(userId, name, file, curPath);
            if (createdFile instanceof Error) {
                throw new Error(createdFile.message);
            }

            return res.json(createdFile);
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }

    async rename(req, res, next) {
        try {
            const { id: userId } = req.user;
            const { id: fileId } = req.params;
            const { name } = req.body;

            const file = await FileService.rename(userId, fileId, name);
            if (file instanceof Error) {
                throw new Error(file.message);
            }

            return res.json(file);
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }

    async delete(req, res, next) {
        try {
            const { id: userId } = req.user;
            const { id: fileId } = req.params;

            const file = await FileService.delete(userId, fileId);
            if (file instanceof Error) {
                throw new Error(file.message);
            }

            return res.json(file);
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }
}

module.exports = new FileController();