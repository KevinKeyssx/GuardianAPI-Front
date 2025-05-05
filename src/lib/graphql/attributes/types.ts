export interface Attribute {
    id?         : string;
    key?        : string;
    value?      : string;
    type?       : string;
    required?   : boolean;
    min?        : string;
    max?        : string;
    minLenght?  : number;
    maxLenght?  : number;
    minDate?    : string;
    maxDate?    : string;
    pattern?    : string;
    active?     : boolean;
    createdAt?  : string;
    updatedAt?  : string;
}

export interface AttributesQuery {
    attributes: Attribute[];
}
