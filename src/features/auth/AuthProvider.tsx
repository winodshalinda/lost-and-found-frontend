import {ReactNode, useCallback, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {AuthContext} from "./AuthContext";
import {Role} from "../../types/SignUpIF";
import {setUnauthorizedHandler} from "../../api/api";
import {Loading} from "../../components/Loading";

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [userRole, setUserRole] = useState<Role | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('uoxToken');
        const currentPath = window.location.pathname;
        const publicRoutes = ['/sign-in', '/sign-up', '/forbidden']; // Define public routes

        if (token) {
            setIsAuthenticated(!!token);

            const decodedToken = decodeToken(token);
            if (decodedToken && decodedToken.roles) {
                const extractedRole = decodedToken.roles.replace("ROLE_", "");
                setUserRoleByDecode(extractedRole);
                const extractedUserId = decodedToken.sub;
                setUserId(extractedUserId);
            }
        } else if (!publicRoutes.includes(currentPath)) {
            // Only redirect to sign-in if not on a public route
            navigate("/sign-in");
        }
        setIsLoading(false);
    }, [navigate]);

    const login = (token: string) => {
        localStorage.setItem('uoxToken', token);
        setIsAuthenticated(true);

        const decodedToken = decodeToken(token);
        if (decodedToken && decodedToken.roles) {
            const extractedRole = decodedToken.roles.replace("ROLE_", "");
            setUserRoleByDecode(extractedRole);
            const extractedUserId = decodedToken.sub;
            setUserId(extractedUserId);
        }

    }

    const logout = useCallback(() => {
        if (location.pathname !== "/forbidden") {
            localStorage.removeItem('uoxToken');
            setIsAuthenticated(false);
            setUserRole(null);
            setUserId(null);
            navigate("/sign-in");
        }
    }, [location.pathname, navigate])

    const setUserRoleByDecode = (role: string) => {
        switch (role) {
            case "ADMIN":
                setUserRole(Role.ADMIN);
                break;
            case "USER":
                setUserRole(Role.USER);
                break;
            case "STAFF":
                setUserRole(Role.STAFF);
                break;
        }
    }

    // Set up the unauthorized handler to use the logout function
    useEffect(() => {
        setUnauthorizedHandler(logout);
    }, [logout]);

    if (isLoading) {
        return <Loading loading={isLoading}/>;
    }

    return (
        <AuthContext.Provider value={{isAuthenticated, userId, userRole, login, logout}}>
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
            atob(base64).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join('')
        );

        return JSON.parse(payload);
    } catch (e) {
        console.error(e)
        return null;
    }
}
