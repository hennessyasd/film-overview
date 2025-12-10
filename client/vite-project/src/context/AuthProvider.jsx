import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({});

export const AuthProvider = (props) => {
    const { children } = props;
    const [auth, setAuth] = useState({});

    useEffect(() => {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        const rolesString = localStorage.getItem("roles");
        const roles = rolesString ? JSON.parse(rolesString) : [];

        if (token) setAuth({ token, username, roles });
    }, []);

    const login = (token, username, roles) => {
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("roles", JSON.stringify(roles));
        setAuth({ token, username, roles });
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("roles");
        setAuth({});
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};