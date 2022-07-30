import { authRequest } from "../api/requests";
import { TFile } from "../types/TFile";

class FileService {
    async getAllFiles() {
        const response = await authRequest.get("api/file/getall");
        return response.data;
    }

    downloadFile(file: TFile) {
        const link = document.createElement("a");
        link.setAttribute("download", file.name);
        link.href = "http://localhost:5000/db/" + file.path;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    downloadFiles(files: TFile[]) {
        let timeout = 100;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // SetTimeout and increase timeout by 100 ms to produce downloading multiple files
            setTimeout(() => this.downloadFile(file), timeout);
            timeout += 100;
        }
    }

    async deleteFile(file: TFile) {
        const response = await authRequest.delete("api/file/delete/" + file.id);
        return response.data;
    }

    async deleteFiles(files: TFile[]) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            await this.deleteFile(file);
        }
    }
}

export default new FileService();