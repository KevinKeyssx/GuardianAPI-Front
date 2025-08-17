export interface Secret {
    id?             : string;
    name?           : string;
    expiresAt?      : string | null;
    willExpireAt?   : string | null;
    isActive?       : boolean;
    createdAt?      : string;
    updatedAt?      : string;
}


export interface SecretsQuery {
    secret: Secret[];
}
