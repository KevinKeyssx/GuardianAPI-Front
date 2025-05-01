export interface User {
    id: string;
    avatar?: string;
    email: string;
    name?: string;
    nickname?: string;
    birthdate?: string;
    phone?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    roles: { name: string }[];
    attributes: { key: string; value: string }[];
    total?: number;
}


export interface UsersResponse {
    users: User[];
    total: number;
}