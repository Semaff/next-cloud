import { authRequest } from "../api/requests";

class FolderService {
    async getAllFolders(path: string) {
        const response = await authRequest.get("api/folder/getall?curPath=" + path);
        return response.data;
    }

    async createFolder(path: string, name: string) {
        const response = await authRequest.post("api/folder/create", { curPath: path, name });
        return response.data;
    }
}

export default new FolderService();