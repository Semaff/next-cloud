import jwtDecode from "jwt-decode";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { authRequest, guestRequest } from "../api/requests";
import { IUser } from "../types/IUser";

interface IAuthContext {
    isLoggedIn: boolean,
    user: IUser | null,
    isLoading: boolean,
    signin: (email: string, password: string) => void,
    signup: (email: string, password: string) => void,
    logout: () => void
}

export const UserContext = createContext<IAuthContext>({
    isLoggedIn: false,
    user: null,
    isLoading: false,
    logout() { },
    signin(email, password) { },
    signup(email, password) { }
});

interface AppWrapperProps {
    children: ReactNode
}

export const AppWrapper = ({ children }: AppWrapperProps) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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

    async function signin(username: string, password: string) {
        const response = await guestRequest.post("api/user/signin", { username, password });
        const token = response.data.token;
        if (token) {
            localStorage.setItem("token", token);
            setUser(jwtDecode(token));
        }
    }

    async function signup(username: string, password: string) {
        const response = await guestRequest.post("api/user/signup", { username, password });
        const token = response.data.token;
        if (token) {
            localStorage.setItem("token", token);
            setUser(jwtDecode(token));
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
            signin,
            signup,
            logout
        }}>
            {children}
        </UserContext.Provider>
    )
}

export const useAuth = () => useContext(UserContext);