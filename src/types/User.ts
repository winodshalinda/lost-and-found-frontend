import {Role} from "./SignUpIF";

export interface UserIF {
    id: string;
    name: string;
    email: string;
    role: Role;
    createAt: string;
}