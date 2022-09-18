import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { createFolder, deleteFile, fetchFile, fetchFiles, fetchSharedFiles, moveFile, removeShareFile, renameFile, searchFiles, shareFile, uploadFile } from "./actions";
import { FilesState, SetErrorAction, SetFileAction, SetFilesAction, SetIsLoadingAction } from "./types";

/* InitialState + Reducer */
const initialState: FilesState = {
    file: null,
    files: [],
    isLoading: false,
    error: null
}

const filesSlice = createSlice({
    name: "files",
    initialState,
    reducers: {
        setFile: (state, action: PayloadAction<SetFileAction>) => {
            state.file = action.payload;
        },

        setFiles: (state, action: PayloadAction<SetFilesAction>) => {
            state.files = action.payload;
        },

        setFilesIsLoading: (state, action: PayloadAction<SetIsLoadingAction>) => {
            state.isLoading = action.payload;
        },

        setFilesError: (state, action: PayloadAction<SetErrorAction>) => {
            state.error = action.payload;
        }
    },
    extraReducers(builder) {
        builder
            /* Fetch File */
            .addCase(fetchFile.fulfilled, (state, action) => {
                state.file = action.payload;
            })
            .addCase(fetchFile.pending, (state, action) => { state.isLoading = true })
            .addCase(fetchFile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Unexpected error!";
            })

            /* Fetch Files */
            .addCase(fetchFiles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.files = action.payload;
            })
            .addCase(fetchFiles.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Unexpected error!";
            })

            /* Fetch Shared Files */
            .addCase(fetchSharedFiles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.files = action.payload;
            })
            .addCase(fetchSharedFiles.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Unexpected error!";
            })

            /* Search Files */
            .addCase(searchFiles.fulfilled, (state, action) => {
                state.files = action.payload;
            })
            .addCase(searchFiles.pending, (state, action) => { state.isLoading = true })
            .addCase(searchFiles.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Unexpected error!";
            })

            /* Upload File */
            .addCase(uploadFile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.files.push(action.payload);
            })
            .addCase(uploadFile.pending, (state, action) => { state.isLoading = true })
            .addCase(uploadFile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Unexpected error!";
            })

            /* Create Folder */
            .addCase(createFolder.fulfilled, (state, action) => {
                state.files.push(action.payload);
            })
            .addCase(createFolder.pending, (state, action) => { state.isLoading = true })
            .addCase(createFolder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Unexpected error!";
            })

            /* Share File */
            .addCase(shareFile.fulfilled, (state, action) => {
                state.files = state.files.filter(fileEl => fileEl.id !== action.payload.id);
                state.files.push(action.payload);
            })
            .addCase(shareFile.pending, (state, action) => { state.isLoading = true })
            .addCase(shareFile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Unexpected error!";
            })

            /* Remove Share File */
            .addCase(removeShareFile.fulfilled, (state, action) => {
                state.files = state.files.filter(fileEl => fileEl.id !== action.payload.id);
                state.files.push(action.payload);
            })
            .addCase(removeShareFile.pending, (state, action) => { state.isLoading = true })
            .addCase(removeShareFile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Unexpected error!";
            })

            /* Rename File */
            .addCase(moveFile.fulfilled, (state, action) => {
                state.files = state.files.filter(fileEl => fileEl.id !== action.payload.id);
            })
            .addCase(moveFile.pending, (state, action) => { state.isLoading = true })
            .addCase(moveFile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Unexpected error!";
            })

            /* Rename File */
            .addCase(renameFile.fulfilled, (state, action) => {
                state.files = state.files.filter(fileEl => fileEl.id !== action.payload.id);
                state.files.push(action.payload);
            })
            .addCase(renameFile.pending, (state, action) => { state.isLoading = true })
            .addCase(renameFile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Unexpected error!";
            })

            /* Delete File */
            .addCase(deleteFile.fulfilled, (state, action) => {
                state.files = state.files.filter(fileEl => fileEl.id !== action.payload.id);
            })
            .addCase(deleteFile.pending, (state, action) => { state.isLoading = true })
            .addCase(deleteFile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Unexpected error!";
            })
    }
});

export default filesSlice.reducer;

/* Action Creators */
export const { setFilesError, setFiles, setFilesIsLoading } = filesSlice.actions;

/* Select Creators */
export const selectFile = (state: RootState) => state.files.file;
export const selectFiles = (state: RootState) => state.files.files;
export const selectFilesError = (state: RootState) => state.files.error;
export const selectFilesIsLoading = (state: RootState) => state.files.isLoading;