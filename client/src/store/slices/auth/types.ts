import { NextPageContext } from "next";
import { TUser } from "../../../types/TUser";

/* AuthSlice */
export interface AuthState {
    user: TUser | null,
    isLoggedIn: boolean,
    isLoading: boolean,
    error: string | null
};

export enum AuthActionsEnum {
    SET_USER = "SET_USER",
    SET_IS_LOGGED_IN = "SET_IS_LOGGED_IN",
    SET_IS_LOADING = "SET_IS_LOADING",
    SET_ERROR = "SET_ERROR",
}

export type SetUserAction = TUser | null;
export type SetIsLoggedInAction = boolean;
export type SetIsLoadingAction = boolean;
export type SetErrorAction = string | null;

/*
  Client Side Thunk Actions
  ==========================
*/
export interface SignInActionFields {
    email: string,
    password: string
}

export interface SignUpActionFields {
    firstname: string,
    lastname: string,
    email: string,
    password: string
}

export interface ChangePasswordActionFields {
    newPassword: string;
}

export interface UploadAvatarActionFields {
    file: File
}

/*
  Server Side Thunk Actions
  ==========================
*/
export interface AuthActionFields {
    ctx: NextPageContext
}
