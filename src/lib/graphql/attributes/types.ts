export type Type = 'NUMBER' | 'DECIMAL' | 'STRING' | 'DATETIME' | 'BOOLEAN' | 'JSON' | 'LIST' | 'UUID';


export interface BaseAttributeFields {
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
}

export interface BaseEntity {
	id?: string;
}

export interface BaseTimestamps {
	createdAt? : string;
	updatedAt? : string;
}

export interface Attribute extends BaseEntity, BaseAttributeFields, BaseTimestamps {}

export interface AttributesQuery {
	userAttributes  : Attribute[];
}

export interface CreateUserAttributeInput extends Omit<BaseAttributeFields, 'key' | 'type'> {
	key             : string;
	type            : Type;
}

export interface UpdateUserAttributeInput extends BaseEntity, BaseAttributeFields {
	id              : string;
}

export interface DeleteUserAttributeInput extends Required<Pick<BaseEntity, 'id'>> {}
