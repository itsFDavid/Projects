import { Role } from "../entities/users.entity";


export interface JwtPayload{
    id: string;
    email: string;
    role: Role;
}