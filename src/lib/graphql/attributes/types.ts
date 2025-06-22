export type Type = 'NUMBER' | 'DECIMAL' | 'STRING' | 'DATETIME' | 'BOOLEAN' | 'JSON' | 'LIST' | 'UUID';

export interface Attribute {
    id?             : string;
    key?            : string;
    defaultValue?   : any;
    type?           : Type;
    required?       : boolean;
    min?            : string;
    max?            : string;
    minLength?      : number;
    maxLength?      : number;
    minDate?        : string;
    maxDate?        : string;
    pattern?        : string;
    isActive?       : boolean;
    createdAt?      : string;
    updatedAt?      : string;
}

export interface AttributesQuery {
    userAttributes: Attribute[];
}
