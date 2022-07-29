const { File } = require("../models/models");
const AppError = require("../error/AppError");
const uuid = require("uuid");
const path = require("path");
const { Op } = require("sequelize");

class FileController {
    async getAll(req, res, next) {
        try {
            const { id: userId } = req.user;
            const files = await File.findAll({ where: { userId } });
            return res.json(files);
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }

    async getOne(req, res, next) {
        try {
            const { id: userId } = req.user;

            const file = await File.findOne({
                where: {
                    id: req.params.id,
                    userId
                }
            });

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
            const { name } = req.body;

            // Parse Cover
            const uploadedCover = req.files.cover;
            const coverExt = uploadedCover?.name?.split(".").pop();
            let coverFileName;
            if (coverExt) {
                coverFileName = uuid.v4() + "." + coverExt;
                uploadedCover.mv(path.resolve(__dirname, "..", "public", "db", coverFileName));
            }

            // Parse File
            const uploadedFile = req.files.file;
            const ext = uploadedFile.name.split(".").pop();
            const type = uploadedFile.mimetype.split('/')[0];

            if (type === "application" && ext !== "zip" && ext !== "rar") {
                throw new Error("You can't download this kind of Applications!")
            }

            const fileName = uuid.v4() + "." + ext;
            uploadedFile.mv(path.resolve(__dirname, "..", "public", "db", fileName));

            const file = await File.create({
                name,
                ext,
                size: uploadedFile.size,
                path: fileName,
                cover: coverFileName,
                userId
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

            const file = await File.findOne({
                where: {
                    id: req.params.id,
                    userId
                }
            });
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

            const file = await File.findOne({
                where: {
                    id: req.params.id,
                    userId
                }
            });

            if (!file) {
                throw new Error('File does not exist!');
            }

            await file.destroy();
            return res.json(file);
        } catch (err) {
            next(AppError.badRequest(err.message));
        }
    }
}

module.exports = new FileController();