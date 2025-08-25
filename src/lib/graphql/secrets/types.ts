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


export interface CreateSecretInput {
    id? : string;
    name            : string;
    willExpireAt?   : string | null;
}


export interface UpdateSecretInput {
    id? : string;

    name?           : string;
    willExpireAt?   : string | null;
}
