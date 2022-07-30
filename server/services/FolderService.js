const fs = require("fs");
const path = require("path");

class FolderService {
    getRootFolder(userId) {
        const rootPath = path.resolve(__dirname, "..", "public", "db", String(userId));
        if (!fs.existsSync(rootPath)) {
            fs.mkdirSync(rootPath);
        }
        return rootPath;
    }

    getFolderPath(userId, path) {
        let folderPath = this.getRootFolder(userId); // part of folderPath
        console.log(path);
        if (path?.length > 0) {
            folderPath += "\\" + path;
        }

        return folderPath;
    }
}

module.exports = new FolderService();