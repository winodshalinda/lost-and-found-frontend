import {createContext} from "react";
import {Role} from "../../types/SignUpIF";

interface AuthContextType {
    isAuthenticated: boolean;
    userRole: Role | null;
    login: (token:string) => void;
    logout: () => void;
}

export const AuthContext=createContext<AuthContextType|undefined>(undefined);