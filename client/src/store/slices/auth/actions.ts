import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { request } from "../../../api/requests";
import { AuthResponse } from "../../../types/AuthResponse";
import { TUser } from "../../../types/TUser";
import { AuthActionFields, ChangePasswordActionFields, SignInActionFields, SignUpActionFields, UploadAvatarActionFields } from "./types";

/*
  Client Side Thunk Actions
  ==========================  
*/
export const signin = createAsyncThunk<AuthResponse, SignInActionFields>("auth/signin", async ({ email, password }) => {
    try {
        const response = await request.post<AuthResponse>("api/user/signin", { email, password });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            return Promise.reject(`Error: ${err.response?.data.message}`);
        }

        return Promise.reject(`Error: ${(err as Error)?.message}`);
    }
});

export const signup = createAsyncThunk<AuthResponse, SignUpActionFields>("auth/signup", async ({ firstname, lastname, email, password }) => {
    try {
        const response = await request.post<AuthResponse>("api/user/signup", { firstname, lastname, email, password });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            return Promise.reject(`Error: ${err.response?.data.message}`);
        }

        return Promise.reject(`Error: ${(err as Error)?.message}`);
    }
});

export const changePassword = createAsyncThunk<AuthResponse, ChangePasswordActionFields>("auth/passwordChange", async ({ newPassword }) => {
    try {
        const response = await request.put<AuthResponse>("api/user/changePassword", { password: newPassword });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            return Promise.reject(`Error: ${err.response?.data.message}`);
        }

        return Promise.reject(`Error: ${(err as Error)?.message}`);
    }
});

export const uploadAvatar = createAsyncThunk<TUser, UploadAvatarActionFields>("auth/uploadAvatar", async ({ file }) => {
    try {
        const formData = new FormData();
        formData.append("avatar", file);
        const response = await request.put<TUser>("api/user/uploadAvatar", formData);
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            return Promise.reject(`Error: ${err.response?.data.message}`);
        }

        return Promise.reject(`Error: ${(err as Error)?.message}`);
    }
});

export const removeAvatar = createAsyncThunk<TUser>("auth/removeAvatar", async () => {
    try {
        const response = await request.put<TUser>("api/user/deleteAvatar");
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            return Promise.reject(`Error: ${err.response?.data.message}`);
        }

        return Promise.reject(`Error: ${(err as Error)?.message}`);
    }
});

export const logout = createAsyncThunk("auth/logout", async () => {
    try {
        await request.get<AuthResponse>("api/user/logout");
    } catch (err) {
        if (err instanceof AxiosError) {
            return Promise.reject(`Error: ${err.response?.data.message}`);
        }

        return Promise.reject(`Error: ${(err as Error)?.message}`);
    }
});

export const deleteAccount = createAsyncThunk("auth/delete", async () => {
    try {
        await request.delete("api/user/delete");
    } catch (err) {
        if (err instanceof AxiosError) {
            return Promise.reject(`Error: ${err.response?.data.message}`);
        }

        return Promise.reject(`Error: ${(err as Error)?.message}`);
    }
});

/*
  Server Side Thunk Actions
  ========================
*/
export const auth = createAsyncThunk<AuthResponse, AuthActionFields>("auth/check", async ({ ctx }) => {
    try {
        const response = await request.get("api/user/auth", {
            withCredentials: true,
            headers: {
                Cookie: ctx.req?.headers.cookie || document.cookie
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