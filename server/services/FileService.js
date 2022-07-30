const uuid = require("uuid");

class FileService {
    parseFile(file, folderPath) {
        if (!file) {
            const type = file.mimetype.split('/')[0];
            const ext = file.name.split(".").pop();
            const name = uuid.v4() + "." + ext;
            const path = folderPath + "\\" + name;
            file.mv(path);
            return { path, ext, type, size: file.size };
        }
    }
}

module.exports = new FileService();