export interface Secret {
    id?             : string;
    name?           : string;
    expiresAt?      : string;
    willExpireAt?   : string;
    isActive?       : boolean;
    createdAt?      : string;
    updatedAt?      : string;
}


export interface SecretsQuery {
    secret: Secret[];
}
