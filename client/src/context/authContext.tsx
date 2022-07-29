import jwtDecode from "jwt-decode";
import { AxiosError } from "axios";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { authRequest, guestRequest } from "../api/requests";
import { TUser } from "../types/TUser";

interface IAuthContext {
    isLoggedIn: boolean,
    user: TUser | null,
    isLoading: boolean,
    authError: string | null,
    signin: (email: string, password: string) => void,
    signup: (email: string, password: string) => void,
    changePassword: (password: string) => void,
    logout: () => void
}

export const UserContext = createContext<IAuthContext>({
    isLoggedIn: false,
    user: null,
    isLoading: false,
    authError: null,
    logout() { },
    signin(email, password) { },
    signup(email, password) { },
    changePassword(password) { }
});

interface AppWrapperProps {
    children: ReactNode
}

export const AppWrapper = ({ children }: AppWrapperProps) => {
    const [user, setUser] = useState<TUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    useEffect(() => {
        async function checkAuth() {
            if (localStorage.getItem("token")) {
                const response = await authRequest.get('api/user/check');
                const token = response.data.token;
                setUser(jwtDecode(token));
                localStorage.setItem("token", token);
            }
            setIsLoading(false);
        }

        checkAuth();
    }, []);

    /*
      Check for Error, if it's present, then setTimeout to delete it
    */
    useEffect(() => {
        if (authError) {
            setTimeout(() => {
                setAuthError(null);
            }, 2000);
            console.log(authError);
        }
    }, [authError])

    /*
      Async Auth functions
    */
    async function signin(username: string, password: string) {
        try {
            const response = await guestRequest.post("api/user/signin", { username, password });
            const token = response.data.token;
            if (token) {
                localStorage.setItem("token", token);
                setUser(jwtDecode(token));
            }
        } catch (err: AxiosError | any) {
            setAuthError("Error: " + err?.response?.data?.message);
        }
    }

    async function signup(username: string, password: string) {
        try {
            const response = await guestRequest.post("api/user/signup", { username, password });
            const token = response.data.token;
            if (token) {
                localStorage.setItem("token", token);
                setUser(jwtDecode(token));
            }
        } catch (err: AxiosError | any) {
            setAuthError("Error: " + err?.response?.data?.message);
        }
    }

    async function changePassword(password: string) {
        try {
            const response = await authRequest.put("api/user/update/" + user?.id, { password });
            const token = response.data.token;
            if (token) {
                localStorage.setItem("token", token);
                setUser(jwtDecode(token));
            }
        } catch (err: AxiosError | any) {
            setAuthError("Error: " + err?.response?.data?.message);
        }
    }

    async function logout() {
        localStorage.removeItem("token");
        setUser(null);
    }

    return (
        <UserContext.Provider value={{
            isLoggedIn: !!user,
            user,
            isLoading,
            authError,
            signin,
            signup,
            changePassword,
            logout
        }}>
            {children}
        </UserContext.Provider>
    )
}

export const useAuth = () => useContext(UserContext);