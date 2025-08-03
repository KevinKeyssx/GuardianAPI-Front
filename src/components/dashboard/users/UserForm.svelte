<script lang="ts">
    import { CalendarDateTime, type DateValue } from "@internationalized/date";
    import toast                                from 'svelte-french-toast';
    import { z }                                from 'zod';

    import DatePicker   from "@/components/inputs/DatePicker.svelte";
    import Input        from "@/components/inputs/Input.svelte";
    import Switch       from "@/components/inputs/Switch.svelte";
    import Textarea     from "@/components/inputs/Textarea.svelte";
    import Modal        from "@/components/shared/Modal.svelte";
    import PanelFooter  from "@/components/shared/panel/PanelFooter.svelte";
    import PanelMain    from "@/components/shared/panel/PanelMain.svelte";
    import Upload       from "@/components/inputs/Upload.svelte";
    import DateForm     from "@/components/shared/show/date-form.svelte";

    import {
        AttributeType,
        type CreateUserInput,
        type UpdateUserInput,
        type User,
        type UserAttribute
    }                       from "@/lib/graphql/users/types";
    import {
        CREATE_USER_MUTATION,
        UPDATE_USER_MUTATION
    }                       from '@/lib/graphql/users/mutations';
    import {
        errorToast,
        successToast
    }                       from '@/config/toast.config';
    import { client }       from "@/lib/urql";
    import CheckIcon        from "@/icons/CheckIcon.svelte";
    import EditIcon         from "@/icons/EditIcon.svelte";
    import CancelIcon       from "@/icons/CancelIcon.svelte";


    type Props = {
        user        : User;
        clicked     : number;
        onSuccess?  : () => void;
    }


    let {
        user: incomingUser,
        clicked = $bindable(),
        onSuccess,
    }: Props = $props();


    let user = $state<User>( incomingUser );
    let avatarFile: File | null = $state( null );
    let errors = $state<Record<string, string>>( {} );


    // Function to enable editing for a specific attribute
    function enableAttributeEditing( attribute: UserAttribute ) {
        attribute.isEditing = true;
    }


    // Function to cancel editing for a specific attribute
    function cancelAttributeEditing( attribute: UserAttribute ) {
        attribute.isEditing = false;
        // Here you could restore the original value if needed
    }


    // Function to save changes for a specific attribute
    function saveAttributeChanges( attribute: UserAttribute ) {
        attribute.isEditing = false;
        updateAttribute( attribute );
    }


    // Function to update attribute (placeholder for now)
    function updateAttribute( attribute: UserAttribute ) {
        console.log( 'Updating attribute:', attribute );
    }


    // Zod validation schema
    const userSchema = z.object({
        email: z.string()
            .min( 5, 'The email must be at least 5 characters' )
            .email( 'The email must be a valid email' ),
        name: z.string()
            .min( 2, 'The name must be at least 2 characters' ),
        nickname    : z.string().optional(),
        phone       : z.string().optional(),
    });


    function getMaxDate(): DateValue {
        const date = new Date();
        return new CalendarDateTime( date.getFullYear(), date.getMonth() + 1, date.getDate() );
    }


    // Validate form data
    function validateForm(): boolean {
        errors = {};
        let isValid = true;

        // Validate basic user fields
        const result = userSchema.safeParse( {
            email       : user.email    || '',
            name        : user.name     || '',
            nickname    : user.nickname || undefined,
            phone       : user.phone    || undefined,
        } );

        if ( !result.success ) {
            result.error.errors.forEach( ( error ) => {
                errors[error.path[0] as string] = error.message;
            } );
            isValid = false;
        }

        // Validate attributes dynamically
        if ( user.attributes && user.attributes.length > 0 ) {
            user.attributes.forEach( ( attribute ) => {
                try {
                    const attributeSchema = createAttributeValidation( attribute );
                    let valueToValidate = attribute.value;

                    // Convert string values to appropriate types for validation
                    if ( attribute.type === AttributeType.Number || attribute.type === AttributeType.Decimal ) {
                        valueToValidate = valueToValidate ? Number( valueToValidate ) : null;
                    } else if ( attribute.type === AttributeType.Boolean ) {
                        valueToValidate = valueToValidate === 'true' || valueToValidate === '1';
                    }

                    attributeSchema.parse( valueToValidate );
                } catch ( error ) {
                    if ( error instanceof z.ZodError ) {
                        error.errors.forEach( ( err ) => {
                            errors[`attribute_${attribute.key}`] = err.message;
                        } );
                        isValid = false;
                    }
                }
            } );
        }

        return isValid;
    }


    // Clear error for specific field
    function clearError( field: string ): void {
        if ( errors[field] ) {
            errors = { ...errors };
            delete errors[field];
        }
    }


    // Create dynamic validation schema for attributes
    function createAttributeValidation( attribute: UserAttribute ): z.ZodSchema<any> {
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


    async function onCreateUser(
        input: CreateUserInput, file: File | null
    ): Promise<void> {
        const { data, error } = await client.mutation(
            CREATE_USER_MUTATION, {
                createUserInput: input,
                file
            }
        ).toPromise();

        if ( error ) {
            console.error( 'Error creating user:', error );
            toast.error( 'Error creating user', errorToast() );
            return;
        }

        if ( data ) {
            console.log( 'User created successfully:', data.createUser );
            toast.success( 'User created successfully', successToast() );

            user = {} as User;
            avatarFile = null;

            clicked++;
            onSuccess?.();
        }
    }


    async function onUpdateUser(
        input: UpdateUserInput, file: File | null
    ): Promise<void> {
        const { data, error } = await client.mutation(
            UPDATE_USER_MUTATION, {
                updateUserInput: input,
                file
            }
        ).toPromise();

        if ( error ) {
            console.error( 'Error updating user:', error );
            toast.error( 'Error updating user', errorToast() );
            return;
        }

        if ( data ) {
            console.log( 'User updated successfully:', data.updateUser );
            toast.success( 'User updated successfully', successToast() );

            clicked++;
            onSuccess?.();
        }
    }


    async function handleFormSubmit( event: Event ): Promise<void> {
        event.preventDefault();
        console.log("🚀 ~ file: UserForm.svelte:117 ~ user:", user)

        // Validate form before submission
        if ( !validateForm() ) {
            toast.error( 'Please correct the errors in the form', errorToast() );
            return;
        }

        const input: CreateUserInput | UpdateUserInput = {
            email       : user.email,
            name        : user.name,
            nickname    : user.nickname,
            birthdate   : user.birthdate ? user.birthdate.toString() : null,
            phone       : user.phone,
            isActive    : user.isActive ?? true,
            isVerified  : user.isVerified ?? false,
        };

        if ( user.id ) {
            ( input as UpdateUserInput ).id = user.id;
            await onUpdateUser( input as UpdateUserInput, avatarFile );
        } else {
            await onCreateUser( input as CreateUserInput, avatarFile );
        }
    }
</script>

<PanelMain>
    <form class="space-y-4" onsubmit={ handleFormSubmit }>
        <Upload bind:file={ avatarFile } avatar={user.avatar} />

        <Input
            bind:value={ user.email }
            placeholder = "Enter email"
            id          = "email"
            name        = "email"
            type        = 'text'
            label       = "Email"
            error       = { errors.email }
            onInput     = { () => clearError( 'email' ) }
        />

        <Input
            bind:value={ user.name }
            placeholder = "Enter name"
            id          = "name"
            name        = "name"
            type        = 'text'
            label       = "Name"
            error       = { errors.name }
            onInput     = { () => clearError( 'name' ) }
        />

        <Input
            bind:value={ user.nickname }
            placeholder = "Enter Nickname"
            id          = "nickname"
            name        = "nickname"
            type        = 'text'
            label       = "Nickname"
        />

        <DatePicker
            bind:value={ user.birthdate }
            label   = "Birthdate"
            id      = "birthdate"
            maxDate = { getMaxDate() }
        />

        <Input
            bind:value={ user.phone }
            placeholder = "Enter Phone"
            id          = "phone"
            name        = "phone"
            type        = 'text'
            label       = "Phone"
        />

        <span class="text-neon-blue flex items-center">Attributes</span>

        <div class="max-h-96 overflow-auto space-y-4 pr-1">
            {#each user?.attributes || [] as attribute }
                {#if attribute.type === AttributeType.String}
                    <div class="flex items-end gap-2">
                        <div class="flex-1">
                            <Input
                                bind:value={ attribute.value }
                                placeholder = "Enter value"
                                id          = { attribute.key }
                                name        = { attribute.key }
                                type        = 'text'
                                label       = { attribute.key }
                                disabled    = { !attribute.isEditing }
                                error       = { errors[`attribute_${attribute.key}` ]}
                                onInput     = { () => clearError( `attribute_${attribute.key}` )}
                            />
                        </div>
                        
                        {#if !attribute.isEditing}
                            <button
                                type    = "button"
                                class   = "p-2 text-neon-blue hover:bg-neon-blue/20 rounded-md transition-colors"
                                onclick = { () => enableAttributeEditing( attribute )}
                                title   = "Edit attribute"
                            >
                                <EditIcon />
                            </button>
                        {:else}
                            <div class="flex gap-1">
                                <button
                                    type    = "button"
                                    class   = "p-2 text-green-400 hover:bg-green-400/20 rounded-md transition-colors"
                                    onclick = { () => saveAttributeChanges( attribute )}
                                    title   = "Save changes"
                                >
                                    <CheckIcon />
                                </button>
                                <button
                                    type    = "button"
                                    class   = "p-2 text-red-400 hover:bg-red-400/20 rounded-md transition-colors"
                                    onclick = { () => cancelAttributeEditing( attribute )}
                                    title   = "Cancel changes"
                                >
                                    <CancelIcon />
                                </button>
                            </div>
                        {/if}
                    </div>
                {:else if attribute.type === AttributeType.Number}
                    <div class="flex items-end gap-2">
                        <div class="flex-1">
                            <Input
                                bind:value={ attribute.value }
                                placeholder = "Enter value"
                                id          = { attribute.key }
                                name        = { attribute.key }
                                type        = 'number'
                                label       = { attribute.key }
                                disabled    = { !attribute.isEditing }
                                error       = { errors[`attribute_${attribute.key}` ]}
                                onInput     = { () => clearError( `attribute_${attribute.key}` )}
                            />
                        </div>
                        
                        {#if !attribute.isEditing}
                            <button
                                type    = "button"
                                class   = "p-2 text-neon-blue hover:bg-neon-blue/20 rounded-md transition-colors"
                                onclick = { () => enableAttributeEditing( attribute )}
                                title   = "Edit attribute"
                            >
                                <EditIcon />
                            </button>
                        {:else}
                            <div class="flex gap-1">
                                <button
                                    type    = "button"
                                    class   = "p-2 text-green-400 hover:bg-green-400/20 rounded-md transition-colors"
                                    onclick = { () => saveAttributeChanges( attribute )}
                                    title   = "Save changes"
                                >
                                    <CheckIcon />
                                </button>
                                <button
                                    type    = "button"
                                    class   = "p-2 text-red-400 hover:bg-red-400/20 rounded-md transition-colors"
                                    onclick = { () => cancelAttributeEditing( attribute )}
                                    title   = "Cancel changes"
                                >
                                    <CancelIcon />
                                </button>
                            </div>
                        {/if}
                    </div>
                {:else if attribute.type === AttributeType.Boolean}
                    <div class="flex items-end gap-2">
                        <div class="flex-1">
                            <Switch
                                bind:checked={ attribute.value }
                                id           = { attribute.key }
                                name         = { attribute.key }
                                label        = { attribute.key }
                                disabled     = { !attribute.isEditing }
                                error        = { errors[`attribute_${attribute.key}` ]}
                                onChange     = { () => clearError( `attribute_${attribute.key}` )}
                            />
                        </div>
                        
                        {#if !attribute.isEditing}
                            <button
                                type    = "button"
                                class   = "p-2 text-neon-blue hover:bg-neon-blue/20 rounded-md transition-colors"
                                onclick = { () => enableAttributeEditing( attribute )}
                                title   = "Edit attribute"
                            >
                                <EditIcon />
                            </button>
                        {:else}
                            <div class="flex gap-1">
                                <button
                                    type    = "button"
                                    class   = "p-2 text-green-400 hover:bg-green-400/20 rounded-md transition-colors"
                                    onclick = { () => saveAttributeChanges( attribute )}
                                    title   = "Save changes"
                                >
                                    <CheckIcon />
                                </button>
                                <button
                                    type    = "button"
                                    class   = "p-2 text-red-400 hover:bg-red-400/20 rounded-md transition-colors"
                                    onclick = { () => cancelAttributeEditing( attribute )}
                                    title   = "Cancel changes"
                                >
                                    <CancelIcon />
                                </button>
                            </div>
                        {/if}
                    </div>
                {:else if attribute.type === AttributeType.Decimal}
                    <div class="flex items-end gap-2">
                        <div class="flex-1">
                            <Input
                                bind:value={ attribute.value }
                                placeholder = "Enter decimal value"
                                id          = { attribute.key }
                                name        = { attribute.key }
                                type        = 'number'
                                step        = '0.01'
                                label       = { attribute.key }
                                disabled    = { !attribute.isEditing }
                                error       = { errors[`attribute_${attribute.key}` ]}
                                onInput     = { () => clearError( `attribute_${attribute.key}` )}
                            />
                        </div>
                        
                        {#if !attribute.isEditing}
                            <button
                                type    = "button"
                                class   = "p-2 text-neon-blue hover:bg-neon-blue/20 rounded-md transition-colors"
                                onclick = { () => enableAttributeEditing( attribute )}
                                title   = "Edit attribute"
                            >
                                <EditIcon />
                            </button>
                        {:else}
                            <div class="flex gap-1">
                                <button
                                    type    = "button"
                                    class   = "p-2 text-green-400 hover:bg-green-400/20 rounded-md transition-colors"
                                    onclick = { () => saveAttributeChanges( attribute )}
                                    title   = "Save changes"
                                >
                                    <CheckIcon />
                                </button>
                                <button
                                    type    = "button"
                                    class   = "p-2 text-red-400 hover:bg-red-400/20 rounded-md transition-colors"
                                    onclick = { () => cancelAttributeEditing( attribute )}
                                    title   = "Cancel changes"
                                >
                                    <CancelIcon />
                                </button>
                            </div>
                        {/if}
                    </div>
                {:else if attribute.type === AttributeType.Datetime}
                    <div class="flex items-end gap-2">
                        <div class="flex-1">
                            <DatePicker
                                bind:value={ attribute.value }
                                id         = { attribute.key }
                                label      = { attribute.key }
                                disabled   = { !attribute.isEditing }
                                error      = { errors[`attribute_${attribute.key}` ]}
                                onInput   = { () => clearError( `attribute_${attribute.key}` )}
                            />
                        </div>
                        
                        {#if !attribute.isEditing}
                            <button
                                type    = "button"
                                class   = "p-2 text-neon-blue hover:bg-neon-blue/20 rounded-md transition-colors"
                                onclick = { () => enableAttributeEditing( attribute )}
                                title   = "Edit attribute"
                            >
                                <EditIcon />
                            </button>
                        {:else}
                            <div class="flex gap-1">
                                <button
                                    type    = "button"
                                    class   = "p-2 text-green-400 hover:bg-green-400/20 rounded-md transition-colors"
                                    onclick = { () => saveAttributeChanges( attribute )}
                                    title   = "Save changes"
                                >
                                    <CheckIcon />
                                </button>
                                <button
                                    type    = "button"
                                    class   = "p-2 text-red-400 hover:bg-red-400/20 rounded-md transition-colors"
                                    onclick = { () => cancelAttributeEditing( attribute )}
                                    title   = "Cancel changes"
                                >
                                    <CancelIcon />
                                </button>
                            </div>
                        {/if}
                    </div>
                {:else if attribute.type === AttributeType.Json}
                    <div class="flex items-end gap-2">
                        <div class="flex-1">
                            <Textarea
                                bind:value={ attribute.value }
                                placeholder = "Enter JSON data"
                                id          = { attribute.key }
                                name        = { attribute.key }
                                label       = { attribute.key }
                                rows        = { 6 }
                                disabled    = { !attribute.isEditing }
                                error       = { errors[`attribute_${attribute.key}`] }
                                onInput     = { () => clearError( `attribute_${attribute.key}` )}
                            />
                        </div>
                        
                        {#if !attribute.isEditing}
                            <button
                                type    = "button"
                                class   = "p-2 text-neon-blue hover:bg-neon-blue/20 rounded-md transition-colors"
                                onclick = { () => enableAttributeEditing( attribute )}
                                title   = "Edit attribute"
                            >
                                <EditIcon />
                            </button>
                        {:else}
                            <div class="flex gap-1">
                                <button
                                    type    = "button"
                                    class   = "p-2 text-green-400 hover:bg-green-400/20 rounded-md transition-colors"
                                    onclick = { () => saveAttributeChanges( attribute )}
                                    title   = "Save changes"
                                >
                                    <CheckIcon />
                                </button>
                                <button
                                    type    = "button"
                                    class   = "p-2 text-red-400 hover:bg-red-400/20 rounded-md transition-colors"
                                    onclick = { () => cancelAttributeEditing( attribute )}
                                    title   = "Cancel changes"
                                >
                                    <CancelIcon />
                                </button>
                            </div>
                        {/if}
                    </div>
                {:else if attribute.type === AttributeType.UUID}
                    <div class="flex items-end gap-2">
                        <div class="flex-1">
                            <Input
                                bind:value={ attribute.value }
                                placeholder = "Enter UUID"
                                id          = { attribute.key }
                                name        = { attribute.key }
                                type        = 'text'
                                label       = { attribute.key }
                                disabled    = { !attribute.isEditing }
                                error       = { errors[`attribute_${attribute.key}`] }
                                onInput     = { () => clearError( `attribute_${attribute.key}` )}
                            />
                        </div>
                        
                        {#if !attribute.isEditing}
                            <button
                                type    = "button"
                                class   = "p-2 text-neon-blue hover:bg-neon-blue/20 rounded-md transition-colors"
                                onclick = { () => enableAttributeEditing( attribute )}
                                title   = "Edit attribute"
                            >
                                <EditIcon />
                            </button>
                        {:else}
                            <div class="flex gap-1">
                                <button
                                    type    = "button"
                                    class   = "p-2 text-green-400 hover:bg-green-400/20 rounded-md transition-colors"
                                    onclick = { () => saveAttributeChanges( attribute )}
                                    title   = "Save changes"
                                >
                                    <CheckIcon />
                                </button>
                                <button
                                    type    = "button"
                                    class   = "p-2 text-red-400 hover:bg-red-400/20 rounded-md transition-colors"
                                    onclick = { () => cancelAttributeEditing( attribute )}
                                    title   = "Cancel changes"
                                >
                                    <CancelIcon />
                                </button>
                            </div>
                        {/if}
                    </div>
                {/if}
            {/each}
        </div>

        <Switch
            bind:checked={ user.isActive }
            label   = "Active"
            id      = 'active'
        />

        <Switch
            bind:checked={ user.isVerified }
            label   = "Verified"
            id      = 'verified'
        />

        <DateForm
            show        = { !!user.id }
            createdAt   = { user.createdAt }
            updatedAt   = { user.updatedAt }
        />

        <PanelFooter>
            <Modal
                id      = { "add-attribute" }
                type    = "attribute"
                title   = "Add Attribute"
            />

            <div class="flex items-center space-x-3">
                <button
                    type    = "button"
                    class   = "close-panel px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors duration-300 active:scale-[0.98] active:bg-gray-700"
                    onclick = { () => clicked++ }
                >
                    Close
                </button>

                <button
                    type    = "submit"
                    class   = "save-panel px-4 py-2 bg-neon-blue text-dark-blue rounded-md hover:bg-opacity-80 transition-colors duration-300"
                >
                    { user.id ? 'Update' : 'Create' }
                </button>
            </div>
        </PanelFooter>
    </form>
</PanelMain>
