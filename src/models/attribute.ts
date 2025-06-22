export interface Attribute {
    id              : string;
    key             : string;
    defaultValue    : string;
    type            : string;
    required        : boolean;
    min             : string;
    max             : string;
    minLength       : number;
    maxLength       : number;
    minDate         : string;
    maxDate         : string;
    pattern         : string;
    isActive        : boolean;
    createdAt       : string;
    updatedAt       : string;
}
