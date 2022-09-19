import AppError from "../error/AppError";
import FileSystemService from "./FileSystemService";
import fs from "fs-extra";
import { UploadedFile } from "express-fileupload";
import { File, User } from "../models/models";
import { EGetFilesTypes } from "../types/EGetFilesTypes";
import { Op } from "sequelize";
import { v4 } from "uuid";

class FileService {
    /*
      Get functions
      =============
    */
    static async getAll(userId: number, curPath: string | undefined) {
        const parentFolderPath = FileSystemService.getStoragePath(userId, curPath);
        const parentFolder = await File.findOne({ where: { path: parentFolderPath } });
        if (!parentFolder) {
            throw AppError.badRequest("This folder doesn't exist!");
        }

        const files = await File.findAll({
            where: {
                userId,
                parent: parentFolder.id
            }
        });
        return files;
    }

    static async getAllByType(userId: number, type: EGetFilesTypes) {
        const whereStatements: any = {};
        if (type === EGetFilesTypes.SHARED) {
            whereStatements.accessLink = {
                [Op.not]: null
            }
        }

        const files = await File.findAll({
            where: {
                ...whereStatements,
                userId
            }
        });
        return files;
    }

    static async getOne(link: string): Promise<File> {
        const file = await File.findOne({ where: { accessLink: link } });
        if (!file) {
            throw AppError.badRequest("File doesn't exist!");
        }
        return file;
    }

    static async search(userId: number | string, query: string): Promise<File[]> {
        const files = await File.findAll({ where: { userId } });

        const filteredFiles = files.filter(file => {
            const fileName = file.name.toLowerCase();
            if (fileName.includes(query) && file.parent) {
                return true;
            }

            return false;
        });

        return filteredFiles;
    }

    static async download(fileId: number | string): Promise<string> {
        const file = await File.findOne({ where: { id: fileId } });
        if (!file) {
            throw AppError.badRequest("File doesn't exist!");
        }

        const rootFilePath = FileSystemService.getRootPath() + "\\" + file.path;
        return rootFilePath;
    }

    /*
      Create functions
      ==================
    */
    static async createFolder(userId: number | string, fileName: string, curPath?: string): Promise<File> {
        const parentFolderPath = FileSystemService.getStoragePath(userId, curPath);
        const parentFolder = await File.findOne({ where: { path: parentFolderPath, userId } });
        if (!parentFolder) {
            throw AppError.badRequest("This folder doesn't exist!");
        }

        const folderPath = parentFolderPath + "\\" + fileName;
        const folder = await File.findOne({ where: { path: folderPath } });
        if (folder) {
            throw AppError.badRequest("Folder already exists!");
        }

        /* Create Folder in server */
        const rootFolderPath = FileSystemService.getRootPath() + "\\" + folderPath;
        fs.mkdirSync(rootFolderPath);

        const createdFolder = await File.create({
            userId,
            name: fileName,
            type: "dir",
            path: folderPath,
            parent: parentFolder.id
        });
        return createdFolder;
    }

    static async uploadFile(userId: number, fileName: string | undefined, file: UploadedFile | undefined, curPath?: string): Promise<File> {
        if (!file) {
            throw AppError.badRequest("You must attach file to upload it!");
        }

        const user = await User.findByPk(userId);
        if (!user) {
            throw AppError.badRequest("This user doesn't exist!")
        }

        if (Number(user.usedSpace) + file.size > user.diskSpace) {
            throw AppError.badRequest("Your used space exceeds your disk space!")
        }

        /* Find Parent Folder */
        const parentFolderPath = FileSystemService.getStoragePath(userId, curPath);
        const parentFolder = await File.findOne({ where: { path: parentFolderPath, userId } });
        if (!parentFolder) {
            throw AppError.badRequest("This folder doesn't exist!");
        }

        /* Check if File already exists */
        let filePath: string = parentFolderPath + "\\";
        if (fileName) {
            filePath += fileName + "." + file.name.split(".").pop(); // file ext
        } else {
            filePath += file.name;
        }

        const possibleFile = await File.findOne({ where: { path: filePath } })
        if (possibleFile) {
            throw AppError.badRequest("This file is already exists!");
        }

        /* Parse File (create instanse on the server and get file's properties) */
        const rootParentFolderPath = FileSystemService.getRootPath() + "\\" + parentFolderPath;
        const parsedFile = await FileSystemService.parseFile(file, rootParentFolderPath, parentFolderPath, fileName);
        const createdFile = await File.create({
            userId,
            name: parsedFile.name,
            type: parsedFile.type,
            size: parsedFile.size,
            path: parsedFile.path,
            parent: parentFolder.id
        });

        await FileService.updateFolderSize(parentFolder);
        await user.update({ usedSpace: BigInt(user.usedSpace) + BigInt(parsedFile.size) });
        return createdFile;
    }

    /*
      Update functions
      ================
    */
    static async share(userId: number | string, fileId: number | string): Promise<File> {
        const file = await File.findOne({ where: { id: fileId, userId } });
        if (!file) {
            throw AppError.badRequest("This file doesn't exist!");
        }

        const shareLink = v4();
        await file.update({ accessLink: shareLink });
        return file;
    }

    static async removeShare(userId: number | string, fileId: number | string): Promise<File> {
        const file = await File.findOne({ where: { id: fileId, userId } });
        if (!file) {
            throw AppError.badRequest("This file doesn't exist!");
        }

        await file.update({ accessLink: null });
        return file;
    }

    static async move(userId: number | string, fileId: number | string, parentId: number | string): Promise<File[]> {
        const file = await File.findOne({ where: { id: fileId, userId } });
        if (!file) {
            throw AppError.badRequest("This file doesn't exist!");
        }

        const oldParentFolder = await File.findOne({ where: { id: file.parent } });
        if (!oldParentFolder) {
            throw AppError.badRequest("You can't move root folder!");
        }

        const newParentFolder = await File.findOne({ where: { id: parentId, userId } });
        if (!newParentFolder) {
            throw AppError.badRequest("This folder doesn't exist!");
        }

        /* Get server path's and db path's */
        const rootFilePath = FileSystemService.getRootPath() + "\\" + file.path;
        const rootNewParentFolderPath = FileSystemService.getRootPath() + "\\" + newParentFolder.path;
        const newRootFilePath = rootNewParentFolderPath + "\\" + file.name;

        const newFilePath = newParentFolder.path + "\\" + file.name;
        const possibleFile = await File.findOne({ where: { path: newFilePath } });
        if (possibleFile) {
            throw AppError.badRequest("File/Folder with this name already exists in this folder!");
        }

        if (file.type !== "dir") {
            // Move file
            fs.renameSync(rootFilePath, newRootFilePath);
        } else {
            // Move file, including all contents
            fs.mkdirSync(newRootFilePath);
            fs.copySync(rootFilePath, newRootFilePath);
            fs.rmSync(rootFilePath, { recursive: true, force: true });
        }

        /* Update File and his parents sizes */
        await file.update({ parent: newParentFolder.id, path: newFilePath });
        await FileService.updateFolderSize(oldParentFolder);
        await FileService.updateFolderSize(newParentFolder);

        /* Find every child in that file and change their path (recursive) */
        const children = await File.findAll({ where: { parent: file.id } });
        children.forEach(FileService.updatePathRelativeToParent);

        const oldParentFolderChilds = await File.findAll({ where: { parent: oldParentFolder.id } });
        return oldParentFolderChilds;
    }

    static async rename(userId: number | string, fileId: number | string, name: string): Promise<File> {
        const file = await File.findOne({ where: { id: fileId, userId } });
        if (!file) {
            throw AppError.badRequest("This file doesn't exist!");
        }

        const newName = name + "." + file.name.split(".").pop() || file.name;
        if (file.type !== "dir") {
            await file.update({ name: newName });
            return file;
        }

        const parentFolder = await File.findOne({ where: { id: file.parent } });
        if (!parentFolder) {
            throw AppError.badRequest("You can't rename root folder!");
        }

        const newFilePath = parentFolder.path + "\\" + newName;
        const rootFilePath = FileSystemService.getRootPath() + "\\" + file.path;
        const newRootFilePath = FileSystemService.getRootPath() + "\\" + newFilePath;

        /* Rename file, including all the contents */
        fs.mkdirSync(newRootFilePath);
        fs.copySync(rootFilePath, newRootFilePath);
        fs.rmSync(rootFilePath, { recursive: true, force: true });
        await file.update({ path: newFilePath, name: newName });

        /* Find every child in that file and change their path (recursive) */
        const children = await File.findAll({ where: { parent: file.id } });
        children.forEach(FileService.updatePathRelativeToParent);
        return file;
    }

    static async updatePathRelativeToParent(file: File) {
        const parentFolder = await File.findOne({ where: { id: file.parent } }) as File;
        const newPath = parentFolder.path + "\\" + file.path.split("\\").pop();
        await file.update({ path: newPath });

        // Repeat, if this file is folder too
        if (file.type === "dir") {
            const children = await File.findAll({ where: { parent: file.id } });
            children.forEach(FileService.updatePathRelativeToParent);
        }
    }

    static async updateFolderSize(curFolder: File) {
        const rootFolderPath = FileSystemService.getRootPath() + "\\" + curFolder.path;
        const folderSize = FileSystemService.getFolderSize(rootFolderPath); // get the size in bytes
        await curFolder.update({ size: folderSize }); // update the folderSize

        /* If this is the root user's folder, then return */
        const parentFolder = await File.findByPk(curFolder.parent);
        if (!parentFolder) {
            return;
        }

        FileService.updateFolderSize(parentFolder);
    }

    /*
      Delete functions
      =================
    */
    static async delete(userId: number | string, fileId: number | string): Promise<File> {
        const user = await User.findByPk(userId);
        if (!user) {
            throw AppError.badRequest("User does not exist!");
        }

        const file = await File.findOne({ where: { id: fileId, userId } });
        if (!file) {
            throw AppError.badRequest("File doesn't exist!");
        }

        if (file.parent === null) {
            throw AppError.badRequest("You can't delete your root folder!");
        }

        /* Delete folder from the server */
        const rootFilePath = FileSystemService.getRootPath() + "\\" + file.path;
        fs.rmSync(rootFilePath, { recursive: true, force: true });

        /* Destroy all the childrens inside a folder */
        await FileService.deleteFileChildren(file);

        /* Must update sizes before we destroy the file from DB */
        const parentFile = await File.findOne({ where: { id: file.parent } });
        if (parentFile) {
            await FileService.updateFolderSize(parentFile);
        }

        await user.update({ usedSpace: BigInt(Number(user.usedSpace) - file.size) });
        await file.destroy();
        return file;
    }

    static async deleteFileChildren(file: File) {
        const children = await File.findAll({ where: { parent: file.id } });
        children.forEach(async (file) => {
            if (file.type === "dir") {
                FileService.deleteFileChildren(file);
            }

            await file.destroy();
        });
    }
}

export default FileService;