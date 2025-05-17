import {ReactNode, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "./AuthContext";
import {Role} from "../../types/SignUpIF";

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [userRole, setUserRole] = useState<Role | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('uoxToken');
        if (token) {
            setIsAuthenticated(!!token);

            const decodedToken = decodeToken(token);
            if (decodedToken && decodedToken.roles) {
                const extractedRole = decodedToken.roles.replace("ROLE_", "");
                setUserRoleByDecode(extractedRole);
            }

        } else {
            navigate("/sign-in")
        }
    }, [navigate]);

    const login = (token: string) => {
        localStorage.setItem('uoxToken', token);
        setIsAuthenticated(true);

        const decodedToken = decodeToken(token);
        if (decodedToken && decodedToken.roles) {
            const extractedRole = decodedToken.roles.replace("ROLE_", "");
            setUserRoleByDecode(extractedRole);
        }

    }

    const logout = () => {
        localStorage.removeItem('uoxToken');
        setIsAuthenticated(false);
        setUserRole(null);
    }

    const setUserRoleByDecode = (role: string) => {
        switch (role) {
            case "ADMIN": setUserRole(Role.ADMIN);break;
            case "USER": setUserRole(Role.USER);break;
            case "STAFF": setUserRole(Role.STAFF);break;
        }
    }

    return (
        <AuthContext.Provider value={{isAuthenticated, userRole, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

const decodeToken = (token: string) => {
    try {
        const base64Url = token.split('.')[1]; // payload

        const base64 = base64Url
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const payload = decodeURIComponent(
            atob(base64).split('').map(c=>{
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join('')
        );

        return JSON.parse(payload);
    } catch (e) {
        console.error(e)
        return null;
    }
}