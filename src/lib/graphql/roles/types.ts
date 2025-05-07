export type Role = {
    id?             : string;
    name?           : string;
    description?    : string;
    userId?         : string;
    createdAt?      : string;
    updatedAt?      : string;
}


export type RolesQuery = {
    roles: Role[];
}