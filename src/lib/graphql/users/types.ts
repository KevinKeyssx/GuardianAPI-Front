import type { DateValue } from "@internationalized/date";

export interface User {
    id?             : string;
    avatar?         : string;
    email?          : string;
    name?           : string;
    nickname?       : string;
    birthdate?      : string | DateValue;
    phone?          : string;
    isActive?       : boolean;
    isVerified?     : boolean;
    createdAt?      : string;
    updatedAt?      : string;
    lastLogin?      : string;
    roles?          : Role[];
    attributes?     : { key: string; value: string }[];
    total?          : number;
}

export type Role = {
    name: string;
}

export interface UsersQuery {
    users: User[];
    // total: number;
}
