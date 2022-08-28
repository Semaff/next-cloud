import { SerializedError } from "@reduxjs/toolkit";
import { type } from "os";
import { TUser } from "../../../types/TUser";

export interface AuthState {
    user: TUser | null,
    isLoggedIn: boolean,
    isLoading: boolean,
    error: SerializedError | null
};

export enum AuthActionsEnum {
    SET_USER = "SET_USER",
    SET_IS_LOGGED_IN = "SET_IS_LOGGED_IN",
    SET_IS_LOADING = "SET_IS_LOADING",
    SET_ERROR = "SET_ERROR",
}

/* Actions */
export type SetUserAction = TUser | null;
export type SetIsLoggedInAction = boolean;
export type SetIsLoadingAction = boolean;
export type SetErrorAction = SerializedError | null;

/* Thunk Actions */
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