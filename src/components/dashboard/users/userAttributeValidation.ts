import { z } from 'zod';

import { AttributeType, type UserAttribute } from "@/lib/graphql/users/types";


export function createAttributeValidation( attribute: UserAttribute ): z.ZodSchema<any> {
    let schema: z.ZodSchema<any>;

    switch ( attribute.type ) {
        case AttributeType.String:
            let stringSchema = z.string();

            if ( attribute.minLength && !isNaN( Number( attribute.minLength ))) {
                stringSchema = stringSchema.min( Number( attribute.minLength ), `${attribute.key} must have at least ${attribute.minLength} characters` );
            }

            if ( attribute.maxLength && !isNaN( Number( attribute.maxLength ))) {
                stringSchema = stringSchema.max( Number( attribute.maxLength ), `${attribute.key} must have maximum ${attribute.maxLength} characters` );
            }

            if ( attribute.pattern ) {
                try {
                    const regex = new RegExp( attribute.pattern );
                    stringSchema = stringSchema.regex( regex, `${attribute.key} does not meet the required format` );
                } catch ( e ) {
                    console.warn( `Invalid regex pattern for ${attribute.key}:`, attribute.pattern );
                }
            }

            schema = stringSchema;
        break;

        case AttributeType.Number:
        case AttributeType.Decimal:
            let numberSchema = z.number( { message: `${attribute.key} must be a valid number` } );

            if ( attribute.min && !isNaN( Number( attribute.min ))) {
                numberSchema = numberSchema.min( Number( attribute.min ), `${attribute.key} must be greater than or equal to ${attribute.min}` );
            }

            if ( attribute.max && !isNaN( Number( attribute.max ))) {
                numberSchema = numberSchema.max( Number( attribute.max ), `${attribute.key} must be less than or equal to ${attribute.max}` );
            }

            schema = numberSchema;
        break;

        case AttributeType.Boolean:
            schema = z.boolean();
        break;

        case AttributeType.Datetime:
            let dateSchema: z.ZodSchema<any> = z.union( [z.string(), z.date()] );

            if ( attribute.minDate ) {
                const minDate = new Date( attribute.minDate );
                if ( !isNaN( minDate.getTime() ) ) {
                    dateSchema = dateSchema.refine( 
                        ( val ) => {
                            const date = typeof val === 'string' ? new Date( val ) : val;
                            return date >= minDate;
                        }, 
                        { message: `${attribute.key} must be after ${attribute.minDate}` }
                    );
                }
            }

            if ( attribute.maxDate ) {
                const maxDate = new Date( attribute.maxDate );
                if ( !isNaN( maxDate.getTime() ) ) {
                    dateSchema = dateSchema.refine( 
                        ( val ) => {
                            const date = typeof val === 'string' ? new Date( val ) : val;
                            return date <= maxDate;
                        }, 
                        { message: `${attribute.key} must be before ${attribute.maxDate}` }
                    );
                }
            }

            schema = dateSchema;
        break;

        case AttributeType.Json:
            let jsonSchema: z.ZodSchema<any> = z.string();

            // Apply length validations first
            if ( attribute.minLength && !isNaN( Number( attribute.minLength ))) {
                jsonSchema = ( jsonSchema as z.ZodString ).min( Number( attribute.minLength ), `${attribute.key} must have at least ${attribute.minLength} characters` );
            }

            if ( attribute.maxLength && !isNaN( Number( attribute.maxLength ))) {
                jsonSchema = ( jsonSchema as z.ZodString ).max( Number( attribute.maxLength ), `${attribute.key} must have maximum ${attribute.maxLength} characters` );
            }

            // Apply JSON validation
            jsonSchema = jsonSchema.refine( 
                ( val ) => {
                    if ( !val ) return true; // Allow empty for optional fields
                    try {
                        JSON.parse( val );
                        return true;
                    } catch {
                        return false;
                    }
                }, 
                { message: `${attribute.key} must be a valid JSON` }
            );

            schema = jsonSchema;
        break;

        case AttributeType.UUID:
            schema = z.string().uuid( `${attribute.key} must be a valid UUID` );
        break;

        default:
            schema = z.any();
        break;
    }

    // Apply required validation if specified
    if ( attribute.required ) {
        if ( attribute.type === AttributeType.String || attribute.type === AttributeType.Json || attribute.type === AttributeType.UUID ) {
            if ( schema instanceof z.ZodString ) {
                schema = schema.min( 1, `${attribute.key} is required` );
            } else {
                schema = schema.refine(( val ) => val !== null && val !== undefined && val !== '', { message: `${attribute.key} is required` });
            }
        } else if ( attribute.type === AttributeType.Number || attribute.type === AttributeType.Decimal ) {
            schema = schema.refine(( val ) => val !== null && val !== undefined, { message: `${attribute.key} is required` });
        } else if ( attribute.type === AttributeType.Boolean ) {
            schema = schema.refine(( val ) => val !== null && val !== undefined, { message: `${attribute.key} is required` });
        } else if ( attribute.type === AttributeType.Datetime ) {
            schema = schema.refine(( val ) => val !== null && val !== undefined && val !== '', { message: `${attribute.key} is required` });
        }
    } else {
        // Make optional if not required
        schema = schema.optional().or( z.literal( '' ) ).or( z.literal( null ) );
    }

    return schema;
}
