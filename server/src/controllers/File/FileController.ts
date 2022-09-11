import { NextFunction, Request, Response } from "express";
import FileService from "../../services/FileService";
import { parsePath } from "../../utils/parsePath";
import { CreateFolderRequest, DeleteRequest, GetAllRequest, GetOneRequest, MoveRequest, RemoveShareRequest, RenameRequest, SearchRequest, ShareRequest, UploadFileRequest } from "./types";

class FileController {
    /*
      Get routes
      ==========
    */
    async getAll(req: GetAllRequest, res: Response, next: NextFunction) {
        try {
            const { path: curPath } = req.query;
            const { id: userId } = req.user;
            const { type } = req.params;

            if (type) {
                const files = await FileService.getAllByType(userId, type);
                return res.json(files);
            }

            const parsedPath = curPath && parsePath(curPath);
            const files = await FileService.getAll(userId, parsedPath);
            return res.json(files);
        } catch (err) {
            next(err);
        }
    }

    async getOne(req: GetOneRequest, res: Response, next: NextFunction) {
        try {
            const { link } = req.params;
            const file = await FileService.getOne(link);
            return res.json(file);
        } catch (err) {
            next(err);
        }
    }

    async search(req: SearchRequest, res: Response, next: NextFunction) {
        try {
            const { id: userId } = req.user;
            const { query } = req.query;

            if (!query) {
                return res.json({ message: "Can't search without a query!" });
            }

            const file = await FileService.search(userId, query);
            return res.json(file);
        } catch (err) {
            next(err);
        }
    }

    /*
      Create routes
      =============
    */
    async createFolder(req: CreateFolderRequest, res: Response, next: NextFunction) {
        try {
            const { id: userId } = req.user;
            const { path: curPath } = req.query;
            const { name } = req.body;

            const parsedPath = curPath && parsePath(curPath);
            const createdFile = await FileService.createFolder(userId, name, parsedPath);
            return res.json(createdFile);
        } catch (err) {
            next(err);
        }
    }

    async uploadFile(req: UploadFileRequest, res: Response, next: NextFunction) {
        try {
            const { id: userId } = req.user;
            const { path: curPath } = req.query;
            const { name } = req.body;
            const file = req.files?.file;

            const parsedPath = curPath && parsePath(curPath);
            const createdFile = await FileService.uploadFile(userId, name, file, parsedPath);
            return res.json(createdFile);
        } catch (err) {
            next(err);
        }
    }

    /*
      Update routes
      ==============
    */
    async share(req: ShareRequest, res: Response, next: NextFunction) {
        try {
            const { id: fileId } = req.params;
            const { id: userId } = req.user;

            const file = await FileService.share(userId, fileId);
            return res.json(file);
        } catch (err) {
            next(err);
        }
    }

    async removeShare(req: RemoveShareRequest, res: Response, next: NextFunction) {
        try {
            const { id: fileId } = req.params;
            const { id: userId } = req.user;

            const file = await FileService.removeShare(userId, fileId);
            return res.json(file);
        } catch (err) {
            next(err);
        }
    }

    async move(req: MoveRequest, res: Response, next: NextFunction) {
        try {
            const { id: userId } = req.user;
            const { fileId, parentId } = req.body;

            const file = await FileService.move(userId, fileId, parentId);
            return res.json(file);
        } catch (err) {
            next(err);
        }
    }

    async rename(req: RenameRequest, res: Response, next: NextFunction) {
        try {
            const { id: userId } = req.user;
            const { id: fileId } = req.params;
            const { name } = req.body;

            const file = await FileService.rename(userId, fileId, name);
            return res.json(file);
        } catch (err) {
            next(err);
        }
    }

    /*
      Delete routes
      ===============
    */
    async delete(req: DeleteRequest, res: Response, next: NextFunction) {
        try {
            const { id: userId } = req.user;
            const { id: fileId } = req.params;

            const file = await FileService.delete(userId, fileId);
            return res.json(file);
        } catch (err) {
            next(err);
        }
    }
}

export default new FileController();