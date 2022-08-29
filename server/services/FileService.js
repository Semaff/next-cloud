const uuid = require("uuid");
const path = require("path");
const fs = require("fs-extra");
const { File, User } = require("../models/models");

class FileService {
    static getPublicPath() {
        const publicPath = path.resolve(__dirname, "..", "public", "db");
        return publicPath;
    }

    static getFilesPath() {
        const filesPath = path.resolve(__dirname, "..", "files");
        return filesPath;
    }

    static getUsersFilesPath(userId, curPath) {
        const folderPath = this.getFilesPath() + "\\" + userId;
        if (curPath) {
            return folderPath + "\\" + curPath;
        }

        return folderPath;
    }

    static parseFile(file, folderPath) {
        try {
            const fileType = file.mimetype.split('/')[0];
            const fileExt = file.name.split(".").pop();
            const fileName = uuid.v4() + "." + fileExt;
            const fileSize = file.size;
            const filePath = folderPath + "\\" + fileName;
            file.mv(filePath); // move file to DB with fileName
            return { filePath, fileExt, fileType, fileSize };
        } catch (err) {
            return new Error(err.message);
        }
    }

    static async updateFoldersSize(curFolder) {
        try {
            const files = await fs.readdir(curFolder.path); // get size in bytes
            const stats = files.map((file) => fs.statSync(path.join(curFolder.path, file)));
            const folderSize = stats.reduce((acc, item) => acc + +item.size, 0);
            await curFolder.update({ size: folderSize });

            // If this is the root user's folder, then return
            const parentFolder = await File.findByPk(curFolder.parent);
            if (!parentFolder.parent) {
                return;
            }

            this.updateFoldersSize(parentFolder);
        } catch (err) {
            return new Error(err.message);
        }
    }

    static async getAll(userId, curPath) {
        try {
            const folderPath = this.getUsersFilesPath(userId, curPath);
            const parentFolder = await File.findOne({ where: { path: folderPath } });
            if (!parentFolder) {
                throw new Error("This folder doesn't exist!");
            }

            const files = await File.findAll({ where: { userId, parent: parentFolder.id } });
            return files;
        } catch (err) {
            return new Error(err.message);
        }
    }

    static async getOne(userId, fileId) {
        try {
            const file = await File.findOne({ where: { id: fileId, userId } });
            if (!file) {
                throw new Error("File doesn't exist!");
            }
            return file;
        } catch (err) {
            return new Error(err.message);
        }
    }

    static async createFolder(userId, fileName, curPath) {
        try {
            const parentFolderPath = this.getUsersFilesPath(userId, curPath);
            if (!fs.existsSync(parentFolderPath)) {
                throw new Error("This folder doesn't exist!");
            }

            const parentFolder = await File.findOne({ where: { path: parentFolderPath, userId } });
            const folderPath = parentFolderPath + "\\" + fileName;
            const folder = await File.findOne({ where: { path: folderPath } });
            if (folder) {
                throw new Error("Folder already exists!");
            }

            const createdFolder = await File.create({
                userId,
                name: fileName,
                type: "dir",
                path: folderPath,
                parent: parentFolder.id
            });
            fs.mkdirSync(folderPath);
            return createdFolder;
        } catch (err) {
            return new Error(err.message);
        }
    }

    static async uploadFile(userId, fileName, file, curPath) {
        try {
            const user = await User.findByPk(userId);
            if (+user.usedSpace + file.size > user.diskSpace) {
                throw new Error("Your used space exceeds your disk space!")
            }

            const folderPath = this.getUsersFilesPath(userId, curPath);
            if (!fs.existsSync(folderPath)) {
                throw new Error("This folder doesn't exist!");
            }

            const parsedFile = this.parseFile(file, folderPath);
            if (parsedFile instanceof Error) {
                throw new Error(parsedFile.message);
            }

            const parentFolder = await File.findOne({ where: { path: folderPath, userId } });
            const createdFile = await File.create({
                userId,
                name: fileName,
                type: parsedFile.fileType,
                size: parsedFile.fileSize,
                path: parsedFile.filePath,
                parent: parentFolder.id
            });
            await this.updateFoldersSize(parentFolder);
            await user.update({ usedSpace: BigInt(user.usedSpace) + BigInt(parsedFile.fileSize) });
            return createdFile;
        } catch (err) {
            return new Error(err.message);
        }
    }

    static async rename(userId, fileId, name) {
        try {
            const file = await File.findOne({ where: { id: fileId, userId } });
            if (!file) {
                throw new Error("This file doesn't exist!");
            }

            const newName = name || file.name;
            if (file.type !== "dir") {
                await file.update({ name: newName });
                return file;
            }

            const parentFile = await File.findOne({ where: { id: file.parent } });
            const newPath = parentFile.path + "\\" + newName;

            // Rename file, including all contents
            fs.mkdirSync(newPath);
            fs.copySync(file.path, newPath);
            fs.rmSync(file.path, { recursive: true, force: true });
            await file.update({ path: newPath, name: newName });

            // Find every child in that file and change their path (recursive)
            const children = await File.findAll({ where: { parent: file.id } });
            children.forEach(async function renameEl(fileEl) {
                const fileElParent = await File.findOne({ where: { id: fileEl.parent } });
                const newPath = fileElParent.path + "\\" + fileEl.name;
                await fileEl.update({ path: newPath });

                // Repeat, if this file is folder too
                if (fileEl.type === "dir") {
                    const moreChildren = await File.findAll({ where: { parent: fileEl.id } });
                    moreChildren.forEach(fileEl => {
                        renameEl(fileEl);
                    });
                }
            });
            return file;
        } catch (err) {
            return new Error(err.message);
        }
    }

    static async delete(userId, fileId) {
        try {
            const user = await User.findByPk(userId);
            const file = await File.findOne({ where: { id: fileId, userId } });
            if (!file) {
                throw new Error("This file doesn't exist!");
            }
            fs.rmSync(file.path, { recursive: true, force: true });

            // Destroy all the childrens inside a folder
            const childFiles = await File.findAll({ where: { parent: file.id } });
            childFiles.forEach(async function remove(file) {
                if (file.type === "dir") {
                    const childs = await File.findAll({ where: { parent: file.id } });
                    childs.forEach(file => {
                        remove(file)
                    });
                }

                await file.destroy();
            });

            // we can update sizes before we destroy the file, because we already deleted it from fs
            const parentFile = await File.findOne({ where: { id: file.parent } });
            await this.updateFoldersSize(parentFile);

            await user.update({ usedSpace: user.usedSpace - file.size });
            await file.destroy();
            return file;
        } catch (err) {
            return new Error(err.message);
        }
    }
}

module.exports = FileService;