import {ReactNode, useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "./AuthContext";
import {Role} from "../../types/SignUpIF";
import {setUnauthorizedHandler} from "../../api/api";

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [userRole, setUserRole] = useState<Role | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('uoxToken');
        const currentPath = window.location.pathname;
        const publicRoutes = ['/sign-in', '/sign-up']; // Define public routes

        if (token) {
            setIsAuthenticated(!!token);

            const decodedToken = decodeToken(token);
            if (decodedToken && decodedToken.roles) {
                const extractedRole = decodedToken.roles.replace("ROLE_", "");
                setUserRoleByDecode(extractedRole);
            }
        } else if (!publicRoutes.includes(currentPath)) {
            // Only redirect to sign-in if not on a public route
            navigate("/sign-in");
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

    const logout =useCallback( () => {
        localStorage.removeItem('uoxToken');
        setIsAuthenticated(false);
        setUserRole(null);
        navigate("/sign-in");
    },[navigate])

    const setUserRoleByDecode = (role: string) => {
        switch (role) {
            case "ADMIN": setUserRole(Role.ADMIN);break;
            case "USER": setUserRole(Role.USER);break;
            case "STAFF": setUserRole(Role.STAFF);break;
        }
    }

    // Set up the unauthorized handler to use the logout function
    useEffect(() => {
        setUnauthorizedHandler(logout);
    }, [logout]);

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
