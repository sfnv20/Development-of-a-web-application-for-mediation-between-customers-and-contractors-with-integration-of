import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string, rememberMe: boolean) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem("authToken") || Cookies.get("authToken");
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const login = (token: string, email: string, rememberMe: boolean) => {
        if (rememberMe) {
            Cookies.set("authToken", token, { expires: 7 });
            Cookies.set("authEmail", email, { expires: 7 }); // Зберігаємо email у кукі
        } else {
            sessionStorage.setItem("authToken", token);
            sessionStorage.setItem("authEmail", email); // Зберігаємо email у sessionStorage
        }
        setIsAuthenticated(true);
    };

    const logout = () => {
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("authEmail");
        Cookies.remove("authToken");
        Cookies.remove("authEmail");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
