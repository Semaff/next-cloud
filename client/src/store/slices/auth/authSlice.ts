import jwtDecode from "jwt-decode";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { authRequest, guestRequest } from "../../../api/requests";
import { TUser } from "../../../types/TUser";
import { AuthState, SetErrorAction, SetIsLoadingAction, SetIsLoggedInAction, SetUserAction, SignInActionFields, SignUpActionFields } from "./types";
import { RejectedActionFromAsyncThunk } from "@reduxjs/toolkit/dist/matchers";
import { RootState } from "../../store";

/* Helper Functions */
const handleAuth = (state: AuthState, action: PayloadAction<TUser>) => {
    state.isLoading = false;
    state.isLoggedIn = true;
    state.user = action.payload;
}

/* InitialState + Reducer */
const initialState: AuthState = {
    user: null,
    isLoggedIn: false,
    isLoading: false,
    error: null
}

const authSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<SetUserAction>) => {
            state.user = action.payload;
        },

        setIsLoggedIn: (state, action: PayloadAction<SetIsLoggedInAction>) => {
            state.isLoggedIn = action.payload;
        },

        setIsLoading: (state, action: PayloadAction<SetIsLoadingAction>) => {
            state.isLoading = action.payload;
        },

        setError: (state, action: PayloadAction<SetErrorAction>) => {
            state.error = action.payload;
        },

        logout: (state, action: PayloadAction) => {
            localStorage.removeItem("token");
            state.isLoggedIn = false;
            state.user = null;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(signin.fulfilled, handleAuth)
            .addCase(signin.pending, (state, action) => { state.isLoading = true })
            .addCase(signin.rejected, (state, action) => {
                state.error = action.error;
                state.isLoading = false;
            })

            .addCase(signup.fulfilled, handleAuth)
            .addCase(signup.pending, (state, action) => { state.isLoading = true })
            .addCase(signup.rejected, (state, action) => {
                state.error = action.error;
                state.isLoading = false;
            })

            .addCase(checkAuth.fulfilled, handleAuth)
            .addCase(checkAuth.pending, (state, action) => { state.isLoading = true })
            .addCase(checkAuth.rejected, (state, action) => {
                state.error = action.error;
                state.isLoading = false;
            })
    }
});

export default authSlice.reducer;

/* Action Creators */
export const { setUser, setIsLoggedIn, setIsLoading, setError, logout } = authSlice.actions;

/* Select Creators */
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectAuthIsLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

/* Thunk Actions */
export const signin = createAsyncThunk<TUser, SignInActionFields>("auth/signin", async ({ email, password }) => {
    try {
        const response = await guestRequest.post("api/user/signin", { email, password });
        const token = response.data.token;
        if (!token) {
            throw new Error("Server Error!")
        }

        const user: TUser = jwtDecode(token);
        localStorage.setItem("token", token);
        return user;
    } catch (err) {
        if (err instanceof AxiosError) {
            return Promise.reject(`Error: ${err.response?.data.message}`);
        }

        return Promise.reject(`Error: ${(err as Error)?.message}`);
    }
})

export const signup = createAsyncThunk<TUser, SignUpActionFields>("auth/signup", async ({ firstname, lastname, email, password }) => {
    try {
        const response = await guestRequest.post("api/user/signup", { firstname, lastname, email, password });
        const token = response.data.token;
        if (!token) {
            throw new Error("Server Error!")
        }

        const user: TUser = jwtDecode(token);
        localStorage.setItem("token", token);
        return user;
    } catch (err) {
        if (err instanceof AxiosError) {
            return Promise.reject(`Error: ${err.response?.data.message}`);
        }

        return Promise.reject(`Error: ${(err as Error)?.message}`);
    }
})

export const checkAuth = createAsyncThunk<TUser>("auth/check", async () => {
    try {
        const response = await authRequest.get("api/user/auth");
        const token = response.data.token;
        if (!token) {
            throw new Error("Server Error!")
        }

        const user: TUser = jwtDecode(token);
        localStorage.setItem("token", token);
        return user;
    } catch (err) {
        if (err instanceof AxiosError) {
            return Promise.reject(`Error: ${err.response?.data.message}`);
        }

        return Promise.reject(`Error: ${(err as Error)?.message}`);
    }
})
