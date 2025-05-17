export interface SignUpIF {
    id:string;
    name:string;
    email:string;
    role?:Role;
    createdAt?:Date;
    password:string;
}

export enum Role {
    ADMIN="ADMIN",
    USER="USER",
    STAFF="STAFF"
}