export type Role = {
    id?             : string;
    name?           : string;
    description?    : string;
    userId?         : string;
    createdAt?      : string;
    updatedAt?      : string;
    isActive?       : boolean;
    permissions?    : Permission[];
}


export type Permission = {
    id?             : string;
    name?           : string;
    description?    : string;
    userId?         : string;
    createdAt?      : string;
    updatedAt?      : string;
    isActive?       : boolean;
}


export type Group = {
    id?             : string;
    name?           : string;
    description?    : string;
    userId?         : string;
    createdAt?      : string;
    updatedAt?      : string;
    isActive?       : boolean;
    roles?          : Role[];
    permissions?    : Permission[];
    users?          : GroupUser[];
}


export type GroupUser = {
    id?             : string;
    userId?         : string;
    groupId?        : string;
    user?           : {
        id?         : string;
        name?       : string;
        email?      : string;
        avatar?     : string;
    };
}


export type RolesQuery = {
    roles: Role[];
}


export type PermissionsQuery = {
    permissions: Permission[];
}


export type GroupsQuery = {
    groups: Group[];
}
