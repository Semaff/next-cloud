import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, SetErrorAction, SetIsLoadingAction, SetIsLoggedInAction, SetUserAction } from "./types";
import { RootState } from "../../store";
import { AuthResponse } from "../../../types/AuthResponse";
import { auth, changePassword, deleteAccount, logout, removeAvatar, signin, signup, uploadAvatar } from "./actions";

/* Helper Functions */
const handleAuth = (state: AuthState, action: PayloadAction<AuthResponse>) => {
    return {
        ...state,
        user: action.payload.user,
        isLoggedIn: true,
        isLoading: false
    }
}

/* InitialState + Reducer */
const initialState: AuthState = {
    user: null,
    isLoggedIn: false,
    isLoading: false,
    error: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<SetUserAction>) => {
            state.user = action.payload;
        },

        setIsLoggedIn: (state, action: PayloadAction<SetIsLoggedInAction>) => {
            state.isLoggedIn = action.payload;
        },

        setAuthIsLoading: (state, action: PayloadAction<SetIsLoadingAction>) => {
            state.isLoading = action.payload;
        },

        setAuthError: (state, action: PayloadAction<SetErrorAction>) => {
            state.error = action.payload;
        },

        logout: (state, action: PayloadAction) => {
            state.isLoggedIn = false;
            state.user = null;
        }
    },
    extraReducers(builder) {
        builder
            /* Auth */
            .addCase(auth.fulfilled, handleAuth)
            .addCase(auth.rejected, (state, action) => {
                state.error = action.error.message || "Unexpected error!";
                state.isLoading = false;
            })

            /* Sign In */
            .addCase(signin.fulfilled, handleAuth)
            .addCase(signin.pending, (state, action) => { state.isLoading = true })
            .addCase(signin.rejected, (state, action) => {
                state.error = action.error.message || "Unexpected error!";
                state.isLoading = false;
            })

            /* Sign Up */
            .addCase(signup.fulfilled, handleAuth)
            .addCase(signup.pending, (state, action) => { state.isLoading = true })
            .addCase(signup.rejected, (state, action) => {
                state.error = action.error.message || "Unexpected error!";
                state.isLoading = false;
            })

            /* Change password */
            .addCase(changePassword.fulfilled, handleAuth)
            .addCase(changePassword.pending, (state, action) => { state.isLoading = true })
            .addCase(changePassword.rejected, (state, action) => {
                state.error = action.error.message || "Unexpected error!";
                state.isLoading = false;
            })

            /* Upload avatar */
            .addCase(uploadAvatar.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(uploadAvatar.pending, (state, action) => { state.isLoading = true })
            .addCase(uploadAvatar.rejected, (state, action) => {
                state.error = action.error.message || "Unexpected error!";
                state.isLoading = false;
            })

            /* Remove Avatar */
            .addCase(removeAvatar.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(removeAvatar.pending, (state, action) => { state.isLoading = true })
            .addCase(removeAvatar.rejected, (state, action) => {
                state.error = action.error.message || "Unexpected error!";
                state.isLoading = false;
            })

            /* Logout */
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isLoggedIn = false;
                state.user = null;
            })
            .addCase(logout.pending, (state, action) => { state.isLoading = true })
            .addCase(logout.rejected, (state, action) => {
                state.error = action.error.message || "Unexpected error!";
                state.isLoading = false;
            })

            /* Delete account */
            .addCase(deleteAccount.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isLoggedIn = false;
                state.user = null;
            })
            .addCase(deleteAccount.pending, (state, action) => { state.isLoading = true })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.error = action.error.message || "Unexpected error!";
                state.isLoading = false;
            })
    }
});

export default authSlice.reducer;

/* Action Creators */
export const { setUser, setIsLoggedIn, setAuthError, setAuthIsLoading } = authSlice.actions;

/* Select Creators */
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectAuthIsLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;