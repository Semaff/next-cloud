import { GetServerSidePropsContext, NextPageContext } from "next";
import { TFile } from "../../../types/TFile";

/* FilesSlice */
export interface FilesState {
    file: null | TFile,
    files: TFile[],
    isLoading: boolean,
    error: string | null
};

export enum AuthActionsEnum {
    SET_FILE = "SET_FILE",
    SET_FILES = "SET_FILES",
    SET_IS_LOADING = "SET_IS_LOADING",
    SET_ERROR = "SET_ERROR"
}

export type SetFileAction = TFile;
export type SetFilesAction = TFile[];
export type SetIsLoadingAction = boolean;
export type SetErrorAction = string | null;

/*
  Client Side Thunk Actions
  ===================
*/
export interface CreateFolderActionFields {
    path: string;
    name: string;
}

export interface UploadFileActionFields {
    path: string;
    file: File;
}

export interface ShareFileActionFields {
    file: TFile;
}

export interface RemoveShareFileActionFields {
    file: TFile;
}

export interface MoveFileActionFields {
    fileId: number | string,
    parentId: number | string
}

export interface RenameFileActionFields {
    name: string;
    file: TFile;
}

export interface DeleteFileActionFields {
    file: TFile;
}

/*
  Server Side Thunk Actions
  ===================
*/
export interface FetchAllActionFields {
    ctx: NextPageContext | GetServerSidePropsContext
}

export interface FetchOneActionFields {
    ctx: NextPageContext | GetServerSidePropsContext
}