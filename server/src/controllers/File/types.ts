import { Request } from "express";
import { UploadedFile } from "express-fileupload";
import { EGetFilesTypes } from "../../types/EGetFilesTypes";
import { JWTUser } from "../../types/JWTUser";

/* Get Requests */
export interface GetAllRequest extends Request {
    user: JWTUser,
    query: {
        path?: string | string[]
    },
    params: {
        type?: EGetFilesTypes
    }
}

export interface GetOneRequest extends Request {
    params: {
        link: string
    }
}

export interface SearchRequest extends Request {
    user: JWTUser,
    query: {
        query?: string
    }
}

export interface DownloadRequest extends Request {
    params: {
        id: string
    }
}

/* Create Requests */
export interface CreateFolderRequest extends Request {
    user: JWTUser,
    body: {
        name: string,
    },
    query: {
        path?: string | string[],
    }
}

export interface UploadFileRequest extends Request {
    user: JWTUser,
    body: {
        name?: string;
    },
    files?: {
        file?: UploadedFile
    } | null,
    query: {
        path?: string | string[],
    }
}

/* Update Requests */
export interface ShareRequest extends Request {
    user: JWTUser,
    params: {
        id: string
    }
}

export interface RemoveShareRequest extends Request {
    user: JWTUser,
    params: {
        id: string
    }
}

export interface RenameRequest extends Request {
    user: JWTUser,
    body: {
        name: string
    },
    params: {
        id: string
    }
}

export interface MoveRequest extends Request {
    user: JWTUser,
    body: {
        fileId: string | number,
        parentId: string | number
    }
}

/* Delete Requests */
export interface DeleteRequest extends Request {
    user: JWTUser,
    params: {
        id: string
    }
}