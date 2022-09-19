import { UploadFile } from "../../../types/UploadFile";

/* UploaderSlice */
export interface UploaderState {
    isVisible: boolean,
    files: UploadFile[]
};

export enum AuthActionsEnum {
    SET_IS_VISIBLE = "SET_IS_VISIBLE",
    SET_FILES = "SET_FILES",
}

export type SetIsVisibleAction = boolean;
export type AddFileAction = UploadFile;
export type RemoveFileAction = number | string;
export type UpdateFileAction = UploadFile;
