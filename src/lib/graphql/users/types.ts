import type { DateValue } from "@internationalized/date";


export interface UserAttribute {
    key     : string;
    value   : string;
    type    : string;
    required: boolean;
}

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
    attributes?     : UserAttribute[];
    total?          : number;
}

export type Role = {
    name: string;
}

export interface UsersQuery {
    users: User[];
    // total: number;
}
