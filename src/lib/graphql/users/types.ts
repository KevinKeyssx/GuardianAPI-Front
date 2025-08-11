export interface BaseUserAttribute {
    key     : string;
}

export enum AttributeType {
    String      = 'STRING',
    Number      = 'NUMBER',
    Boolean     = 'BOOLEAN',
    Decimal     = 'DECIMAL',
    List        = 'LIST',
    Datetime    = 'DATETIME',
    Json        = 'JSON',
    UUID        = 'UUID',
}

export interface UserAttribute {
    id          : string;
    key         : string;
    value       : any | null;
    valueId     : string;
    type        : AttributeType;
    required    : boolean;
    max         : string;
    min         : string;
    pattern     : string;
    minLength   : string;
    maxLength   : string;
    minDate     : string;
    maxDate     : string;

    isEditing?  : boolean;
}

export type Role = {
    name: string;
}

export interface UsersQuery {
    users: User[];
}

export interface UsersAttributesQuery {
    userAttributes: BaseUserAttribute[];
}

export interface User {
    id          : string;
    avatar?     : string | null;
    email       : string;
    name        : string;
    nickname?   : string | null;
    birthdate?  : string | null;
    phone?      : string | null;
    isActive    : boolean;
    isVerified  : boolean;
    createdAt   : string;
    updatedAt   : string;
    roles?      : { name: string }[];
    attributes? : UserAttribute[];
    apiUserId?  : string | null;
}

export interface CreateUserInput {
    id?          : string;
    email       : string;
    name        : string;
    nickname?   : string | null;
    birthdate?  : string | null;
    phone?      : string | null;
    isActive?   : boolean;
    isVerified? : boolean;
    apiUserId?  : string | null;
}

export interface UpdateUserInput {
    id          : string;
    email?      : string | null;
    name?       : string | null;
    nickname?   : string | null;
    birthdate?  : string | null;
    phone?      : string | null;
    isActive?   : boolean;
    isVerified? : boolean;
}

export interface UsersQuery {
    users: User[];
}
