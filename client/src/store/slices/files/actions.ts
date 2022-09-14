import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { request } from "../../../api/requests";
import { TFile } from "../../../types/TFile";
import { CreateFolderActionFields, DeleteFileActionFields, FetchAllActionFields, MoveFileActionFields, RemoveShareFileActionFields, RenameFileActionFields, ShareFileActionFields, UploadFileActionFields } from "./types";
import decodePath from "../../../utils/decodePath";

/*
  Client Side Thunk Actions
  =============
*/
export const createFolder = createAsyncThunk<TFile, CreateFolderActionFields>("files/createFolder", async ({ path, name }) => {
    try {
        const response = await request.post<TFile>("api/files/createFolder?path=" + decodePath(path), { name });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            return Promise.reject(`Error: ${err.response?.data.message}`);
        }

        return Promise.reject(`Error: ${(err as Error)?.message}`);
    }
});

export const uploadFile = createAsyncThunk<TFile, UploadFileActionFields>("files/uploadFile", async ({ file, path }) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await request.post<TFile>("api/files/uploadFile?path=" + decodePath(path), formData);
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            return Promise.reject(`Error: ${err.response?.data.message}`);
        }

        return Promise.reject(`Error: ${(err as Error)?.message}`);
    }
});

export const shareFile = createAsyncThunk<TFile, ShareFileActionFields>("files/shareFile", async ({ file }) => {
    try {
        const response = await request.put<TFile>("api/files/share/" + file.id);
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            return Promise.reject(`Error: ${err.response?.data.message}`);
        }

        return Promise.reject(`Error: ${(err as Error)?.message}`);
    }
});

export const removeShareFile = createAsyncThunk<TFile, RemoveShareFileActionFields>("files/removeShareFile", async ({ file }) => {
    try {
        const response = await request.put<TFile>("api/files/removeShare/" + file.id);
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            return Promise.reject(`Error: ${err.response?.data.message}`);
        }

        return Promise.reject(`Error: ${(err as Error)?.message}`);
    }
});

export const moveFile = createAsyncThunk<TFile, MoveFileActionFields>("files/moveFile", async ({ fileId, parentId }) => {
    try {
        const response = await request.put<TFile>("api/files/move", { fileId, parentId });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            return Promise.reject(`Error: ${err.response?.data.message}`);
        }

        return Promise.reject(`Error: ${(err as Error)?.message}`);
    }
});

export const renameFile = createAsyncThunk<TFile, RenameFileActionFields>("files/renameFile", async ({ file, name }) => {
    try {
        const response = await request.put<TFile>("api/files/rename/" + file.id, { name });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            return Promise.reject(`Error: ${err.response?.data.message}`);
        }

        return Promise.reject(`Error: ${(err as Error)?.message}`);
    }
});

export const deleteFile = createAsyncThunk<TFile, DeleteFileActionFields>("files/deleteFile", async ({ file }) => {
    try {
        const response = await request.delete<TFile>("api/files/delete/" + file.id);
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            return Promise.reject(`Error: ${err.response?.data.message}`);
        }

        return Promise.reject(`Error: ${(err as Error)?.message}`);
    }
});

/*
  Server-Side Thunk Actions
  =========================
*/
export const fetchFiles = createAsyncThunk<TFile[], FetchAllActionFields>("files/getall", async ({ ctx }) => {
    try {
        let parsedPath: string;
        if (Array.isArray(ctx.query.slug)) {
            parsedPath = decodePath("\\" + ctx.query.slug.join("\\"));
        } else {
            parsedPath = decodePath(ctx.query.slug || "\\");
        }
        const response = await request.get<TFile[]>("api/files/getall?path=" + parsedPath, {
            headers: {
                Cookie: ctx.req?.headers.cookie || ""
            }
        });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            return Promise.reject(`Error: ${err.response?.data.message}`);
        }

        return Promise.reject(`Error: ${(err as Error)?.message}`);
    }
});

export const fetchSharedFiles = createAsyncThunk<TFile[], FetchAllActionFields>("files/getAllShared", async ({ ctx }) => {
    try {
        const response = await request.get<TFile[]>("api/files/getall/shared", {
            headers: {
                Cookie: ctx.req?.headers.cookie || ""
            }
        });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            return Promise.reject(`Error: ${err.response?.data.message}`);
        }

        return Promise.reject(`Error: ${(err as Error)?.message}`);
    }
});

export const fetchFile = createAsyncThunk<TFile, FetchAllActionFields>("files/getone", async ({ ctx }) => {
    try {
        const response = await request.get<TFile>("api/files/getone/" + ctx.query.id, {
            headers: {
                Cookie: ctx.req?.headers.cookie || ""
            }
        });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            return Promise.reject(`Error: ${err.response?.data.message}`);
        }

        return Promise.reject(`Error: ${(err as Error)?.message}`);
    }
});