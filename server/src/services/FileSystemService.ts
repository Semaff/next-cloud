import path from "path";
import fs from "fs-extra";
import { UploadedFile } from "express-fileupload";

export interface ParsedFile {
    name: string,
    path: string,
    ext: string,
    type: string,
    size: number
};

class FileSystemService {
    /*
      Path functions
      ==============
    */
    static getRootPath() {
        const rootPath = path.resolve(__dirname, "..", "public");
        return rootPath;
    }

    static getRootFilesPath(userId: number | string, curPath?: string) {
        const folderPath = path.resolve(__dirname, "..", "public", "files", userId.toString());
        if (curPath) {
            return folderPath + "\\" + curPath;
        }

        return folderPath;
    }

    static getRootStoragePath(userId: number | string, curPath?: string) {
        const folderPath = path.resolve(__dirname, "..", "public", "storage", userId.toString());
        if (curPath) {
            return folderPath + "\\" + curPath;
        }

        return folderPath;
    }

    static getFilesPath(userId: number | string, curPath?: string) {
        const folderPath = "files" + "\\" + userId;
        if (curPath) {
            return folderPath + "\\" + curPath;
        }

        return folderPath;
    }

    static getStoragePath(userId: number | string, curPath?: string) {
        const folderPath = "storage" + "\\" + userId;
        if (curPath) {
            return folderPath + "\\" + curPath;
        }

        return folderPath;
    }

    /*
      Parse functions
      ===============
    */
    static async parseFile(file: UploadedFile, rootPath: string, curPath: string, fileName?: string): Promise<ParsedFile> {
        const type = file.mimetype.split('/')[0]; // type: image | application | ...
        const ext = file.name.split(".").pop(); // extension: .jpg .png .exe
        const size = file.size; // size in bytes
        const name = fileName === undefined ? file.name : fileName + "." + ext;

        const rootFilePath = rootPath + "\\" + name;
        const filePath = curPath + "\\" + name;
        await file.mv(rootFilePath);
        return {
            name,
            path: filePath,
            ext: ext!,
            type,
            size
        };
    }

    /*
      Get functions
      =============
    */
    static getFolderSize(folderPath: string): number {
        const files = fs.readdirSync(folderPath, { withFileTypes: true });

        const paths: number[] = files.map(file => {
            const childPath = path.join(folderPath, file.name);

            if (file.isDirectory()) {
                return FileSystemService.getFolderSize(childPath);
            }

            if (file.isFile()) {
                const { size } = fs.statSync(childPath);
                return size;
            }

            return 0;
        });

        return paths.flat(Infinity).reduce((acc, size) => acc + size, 0);
    }
}

export default FileSystemService;