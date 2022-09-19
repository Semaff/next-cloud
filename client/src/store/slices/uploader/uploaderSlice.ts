import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AddFileAction, RemoveFileAction, SetIsVisibleAction, UpdateFileAction, UploaderState } from "./types";
import { RootState } from "../../store";

/* Helper Functions */

/* InitialState + Reducer */
const initialState: UploaderState = {
    isVisible: false,
    files: []
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUploaderIsVisible: (state, action: PayloadAction<SetIsVisibleAction>) => {
            state.isVisible = action.payload;
            state.files = [];
        },

        addUploadFile: (state, action: PayloadAction<AddFileAction>) => {
            state.files.push(action.payload);
        },

        removeUploadFile: (state, action: PayloadAction<RemoveFileAction>) => {
            state.files = state.files.filter(file => file.id !== action.payload);
        },

        updateUploadFile: (state, action: PayloadAction<UpdateFileAction>) => {
            state.files = state.files.filter(file => file.id !== action.payload.id);
            state.files.push(action.payload);
        }
    },
    extraReducers(builder) { }
});

export default authSlice.reducer;

/* Action Creators */
export const { addUploadFile, removeUploadFile, setUploaderIsVisible, updateUploadFile } = authSlice.actions;

/* Select Creators */
export const selectUploaderIsVisible = (state: RootState) => state.uploader.isVisible;
export const selectUploadFiles = (state: RootState) => state.uploader.files;