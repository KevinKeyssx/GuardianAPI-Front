export interface BaseUserAttribute {
    key     : string;
    // type    : string;
    // required: boolean;
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

// export interface User {
//     id?             : string;
//     avatar?         : string;
//     email?          : string;
//     name?           : string;
//     nickname?       : string;
//     birthdate?      : string | DateValue;
//     phone?          : string;
//     isActive?       : boolean;
//     isVerified?     : boolean;
//     createdAt?      : string;
//     updatedAt?      : string;
//     lastLogin?      : string;
//     roles?          : Role[];
//     attributes?     : UserAttribute[];
// }

export type Role = {
    name: string;
}

export interface UsersQuery {
    users: User[];
    // total: number;
}


export interface UsersAttributesQuery {
    userAttributes: BaseUserAttribute[];
}

export interface User {
    id          : string;
    avatar?     : string | null; // URL del avatar
    email       : string;
    name        : string;
    nickname?   : string | null;
    birthdate?  : string | null; // Lo recibes como string (ej. ISO date)
    phone?      : string | null;
    isActive    : boolean;
    isVerified  : boolean;
    createdAt   : string; // Fecha en formato string (ISO date)
    updatedAt   : string; // Fecha en formato string (ISO date)
    roles?      : { name: string }[]; // Array de objetos de rol
    attributes? : UserAttribute[]; // Array de UserAttribute
    // Si tu User en el backend tiene estos campos directamente, inclúyelos aquí:
    pwdAdmin?   : string | null;
    alertDay?   : number | null;
    apiUserId?  : string | null; // El ID del UserAPI si es un usuario subordinado
}

// Interfaz para UserAttribute (tal como viene en la consulta)
// export interface UserAttribute {
//     type: string; // O un enum específico si lo tienes (e.g., 'STRING' | 'NUMBER' | 'DECIMAL' | 'BOOLEAN')
//     key: string;
//     value: any | null; // El valor puede ser de cualquier tipo, dependiendo del 'type'
//     required: boolean;
// }


// --- Interfaces para los Inputs de Mutación ---

// Interfaz para crear un nuevo usuario
// Basada en los campos que espera tu 'CreateUserInput' en el backend
export interface CreateUserInput {
    id?          : string; // El ID es esencial para la actualización

    email       : string;
    name        : string;
    nickname?   : string | null;
    birthdate?  : string | null;
    phone?      : string | null;
    isActive?   : boolean;
    isVerified? : boolean;
    apiUserId?  : string | null;
}

// Interfaz para actualizar un usuario existente
// Basada en los campos que espera tu 'UpdateUserInput' en el backend
export interface UpdateUserInput {
    id          : string; // El ID es esencial para la actualización
    email?      : string | null; // Hacemos los campos opcionales para la actualización
    name?       : string | null;
    nickname?   : string | null;
    birthdate?  : string | null;
    phone?      : string | null;
    isActive?   : boolean;
    isVerified? : boolean;
    // apiUserId no suele ser actualizable directamente, pero si lo es, inclúyelo
    // pwdAdmin?: string | null; // Si se puede cambiar la contraseña del admin
    // alertDay?: number | null;
    // No incluyas 'avatar' aquí, ya que se maneja por 'file: Upload'.
}


export interface UsersQuery {
    users: User[];
}
