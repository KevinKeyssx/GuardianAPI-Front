<script lang="ts">
    import { PuzzlePiece }  from "phosphor-svelte";
    import toast            from 'svelte-french-toast';
    import { z }            from 'zod';

    import DatePicker       from "@/components/inputs/DatePicker.svelte";
    import Input            from "@/components/inputs/Input.svelte";
    import Select           from "@/components/inputs/Select.svelte";
    import Switch           from "@/components/inputs/Switch.svelte";
    import PanelFooter      from "@/components/shared/panel/PanelFooter.svelte";
    import PanelMain        from "@/components/shared/panel/PanelMain.svelte";
    import DateForm         from "@/components/shared/show/date-form.svelte";
    import JsonGenerator    from "@/components/dashboard/attributes/JSONGenerator.svelte";

    import type {
        Attribute,
        CreateUserAttributeInput,
        UpdateUserAttributeInput,
        Type
    }                           from "@/lib/graphql/attributes/types";
    import {
        CREATE_ATTRIBUTE_MUTATION,
        UPDATE_ATTRIBUTE_MUTATION
    }                           from "@/lib/graphql/attributes/mutations";
    import {
        errorToast,
        successToast
    }                           from '@/config/toast.config';
    import { client }           from "@/lib/urql";
    import PatternIcon          from "@/icons/PatternIcon.svelte";


    type Props = {
        attribute   : Attribute;
        clicked     : number;
        onSuccess?  : () => void;
    }


    let {
        attribute: incomingAttribute,
        clicked = $bindable(),
        onSuccess,
    }: Props = $props();


    function nullToUndefined<T>( value: T | null ): T | undefined {
        return value === null ? undefined : value;
    }


    let attribute = $state<Attribute>({
        ...incomingAttribute,
        isActive        : incomingAttribute.isActive ?? true,
        required        : incomingAttribute.required ?? false,
        defaultValue    : nullToUndefined( incomingAttribute.defaultValue ),
        min             : nullToUndefined( incomingAttribute.min ),
        max             : nullToUndefined( incomingAttribute.max ),
        minLength       : nullToUndefined( incomingAttribute.minLength ),
        maxLength       : nullToUndefined( incomingAttribute.maxLength ),
        minDate         : nullToUndefined( incomingAttribute.minDate ),
        maxDate         : nullToUndefined( incomingAttribute.maxDate ),
        pattern         : nullToUndefined( incomingAttribute.pattern ),
        canChangeAll    : incomingAttribute.canChangeAll ?? false,
    });


    let errors  = $state<Record<string, string>>( {} );
    let isReset = $state<boolean>( false );


    const options = [
        { label: 'String',      value: 'STRING' },
        { label: 'Number',      value: 'NUMBER' },
        { label: 'Boolean',     value: 'BOOLEAN' },
        { label: 'Decimal',     value: 'DECIMAL' },
        { label: 'List',        value: 'LIST' },
        { label: 'Json',        value: 'JSON' },
        { label: 'Datetime',    value: 'DATETIME' },
    ];


    const patternOptions = [
        { label: 'Email (user@domain.com)', value: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
        { label: 'URL (https://example.com)', value: '^(https?:\\/\\/)?([\\w-]+\\.)+[\\w-]+(\\/[\\w-./?%&=]*)?$' },
        { label: 'UUID (123e4567-e89b-12d3-a456-426614174000)', value: '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' },
        { label: 'Credit Card (1234-5678-9012-3456)', value: '^\\d{4}-?\\d{4}-?\\d{4}-?\\d{4}$' },
        { label: 'IPv4 Address (192.168.1.1)', value: '^(\\d{1,3}\\.){3}\\d{1,3}$' },
        { label: 'Hex Color (#FFFFFF)', value: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$' },
        { label: 'Time (HH:MM 24h) (23:59)', value: '^([01]\\d|2[0-3]):[0-5]\\d$' },
        { label: 'Custom', value: '' },
    ];


    const attributeSchema = z.object({
        key: z.string()
            .min( 1, 'The key is required' )
            .min( 2, 'The key must be at least 2 characters' )
            .regex( /^[a-zA-Z_][a-zA-Z0-9_]*$/, 'The key must be a valid identifier (letters, numbers, underscore)' ),
        type: z.enum( ['STRING', 'NUMBER', 'BOOLEAN', 'DECIMAL', 'LIST', 'JSON', 'DATETIME', 'UUID'] as const, {
            errorMap: () => ({ message: 'Please select a valid type' })
        }),
        defaultValue    : z.any().optional().nullable(),
        required        : z.boolean().default( false ),
        min             : z.string().optional().nullable(),
        max             : z.string().optional().nullable(),
        minLength       : z.number().min( 0, 'Min length must be 0 or greater' ).optional().nullable(),
        maxLength       : z.number().min( 0, 'Max length must be 0 or greater' ).optional().nullable(),
        minDate         : z.string().optional().nullable(),
        maxDate         : z.string().optional().nullable(),
        pattern         : z.string().optional().nullable(),
        isActive        : z.boolean().default( true ),
        canChangeAll    : z.boolean().default( false )
    }).refine( ( data ) => {
        const { minLength, maxLength } = data;

        if ( !minLength && !maxLength ) {
            return true;
        }

        if ( data.type === 'STRING' && minLength !== undefined && maxLength !== undefined ) {
            return minLength! <= maxLength!;
        }

        return true;
    }, {
        message: 'Min length must be less than or equal to max length',
        path: ['minLength']
    }).refine( ( data ) => {
        // Validate min/max values for NUMBER and DECIMAL types
        if ( ( data.type === 'NUMBER' || data.type === 'DECIMAL' ) && data.min && data.max ) {
            return parseFloat( data.min ) <= parseFloat( data.max );
        }
        return true;
    }, {
        message: 'Min value must be less than or equal to max value',
        path: ['min']
    });


    function validateForm(): boolean {
        errors = {};
        let isValid = true;

        const result = attributeSchema.safeParse({
            key             : attribute.key || '',
            type            : attribute.type as Type,
            defaultValue    : attribute.defaultValue,
            required        : attribute.required    ?? false,
            min             : attribute.min         || undefined,
            max             : attribute.max         || undefined,
            minLength       : attribute.minLength   || undefined,
            maxLength       : attribute.maxLength   || undefined,
            minDate         : attribute.minDate     || undefined,
            maxDate         : attribute.maxDate     || undefined,
            pattern         : attribute.pattern     || undefined,
            isActive        : attribute.isActive    ?? true,
        });

        if ( !result.success ) {
            result.error.errors.forEach( ( error ) => {
                errors[error.path[0] as string] = error.message;
            });

            isValid = false;
        }

        return isValid;
    }


    function clearError( field: string ): void {
        if ( errors[field] ) {
            errors = { ...errors };
            delete errors[field];
        }
    }


    async function onCreateAttribute( input: CreateUserAttributeInput ): Promise<void> {
        const { data, error } = await client.mutation(
            CREATE_ATTRIBUTE_MUTATION,
            { createUserAttributeInput: input }
        ).toPromise();

        if ( error ) {
            console.error( 'Error creating attribute:', error );
            toast.error( 'Error creating attribute', errorToast() );
            return;
        }

        if ( data ) {
            console.log( 'Attribute created successfully:', data.createUserAttribute );
            toast.success( 'Attribute created successfully', successToast() );

            attribute = {} as Attribute;
            clicked++;
            onSuccess?.();
        }
    }


    async function onUpdateAttribute( input: UpdateUserAttributeInput ): Promise<void> {
        const { data, error } = await client.mutation(
            UPDATE_ATTRIBUTE_MUTATION,
            { updateUserAttributeInput: input }
        ).toPromise();

        if ( error ) {
            console.error( 'Error updating attribute:', error );
            toast.error( 'Error updating attribute', errorToast() );
            return;
        }

        if ( data ) {
            console.log( 'Attribute updated successfully:', data.updateUserAttribute );
            toast.success( 'Attribute updated successfully', successToast() );

            clicked++;
            onSuccess?.();
        }
    }


    async function handleFormSubmit( event: Event ): Promise<void> {
        event.preventDefault();

        if ( !validateForm() ) {
            toast.error( 'Please correct the errors in the form', errorToast() );
            return;
        }

        const input: CreateUserAttributeInput | UpdateUserAttributeInput = {
            key             : attribute.key!,
            type            : attribute.type!,
            defaultValue    : attribute.defaultValue === null ? undefined : attribute.defaultValue,
            required        : attribute.required    ?? false,
            min             : attribute.min         || undefined,
            max             : attribute.max         || undefined,
            minLength       : attribute.minLength   || undefined,
            maxLength       : attribute.maxLength   || undefined,
            minDate         : attribute.minDate     || undefined,
            maxDate         : attribute.maxDate     || undefined,
            pattern         : attribute.pattern     || undefined,
            isActive        : attribute.isActive    ?? true,
        };

        if ( attribute.id ) {
            ( input as UpdateUserAttributeInput ).id = attribute.id;
            ( input as UpdateUserAttributeInput ).canChangeAll = attribute.canChangeAll;

            if ( isReset ) {
                input.defaultValue = null;
                input.canChangeAll = true;
            }

            console.log("🚀 ~ file: AttributeForm.svelte:221 update ~ input:", input)

            await onUpdateAttribute( input as UpdateUserAttributeInput );
        } else {
            console.log("🚀 ~ file: AttributeForm.svelte:221 create ~ input:", input)
            await onCreateAttribute( input as CreateUserAttributeInput );
        }
    }
</script>

<form onsubmit={handleFormSubmit}>
    <PanelMain>
        <div class="flex flex-col gap-4">
            <div class="flex items-center gap-2">
                <PuzzlePiece size={20} />

                <h2 class="text-lg font-semibold">
                    { attribute.id ? 'Edit Attribute' : 'Create Attribute' }
                </h2>
            </div>

            <Input
                bind:value  = { attribute.key }
                label       = "Key Name"
                placeholder = "Enter key name"
                id          = "key"
                name        = "key"
                type        = 'text'
                error       = { errors.key }
                onInput     = {() => clearError( 'key' )}
            />

            <Select
                bind:value  = { attribute.type }
                onChange    = { () => { attribute.defaultValue = null; clearError( 'type' );}}
                label       = "Type"
                placeholder = "Select type"
                id          = "type"
                name        = "type"
                { options }
            >
                {#snippet icon()}
                    <PuzzlePiece class="size-5" />
                {/snippet}
            </Select>

            {#if attribute.type === 'NUMBER' || attribute.type === 'DECIMAL'}
                <Input
                    bind:value  = { attribute.defaultValue }
                    label       = "Default Value"
                    placeholder = "Enter default value"
                    id          = "default-value"
                    name        = "default-value"
                    type        = "number"
                    step        = { attribute.type === 'DECIMAL' ? '0.1' : '1' }
                    min         = { attribute.min }
                    max         = { attribute.max }
                    error       = { errors.defaultValue }
                    onInput     = { () => clearError( 'defaultValue' ) }
                />
            {:else if attribute.type === 'STRING'}
                <Input
                    bind:value  = { attribute.defaultValue }
                    label       = "Default Value"
                    placeholder = "Enter default value"
                    id          = "default-value"
                    name        = "default-value"
                    type        = "text"
                    error       = { errors.defaultValue }
                    onInput     = { () => clearError( 'defaultValue' ) }
                />
            {:else if attribute.type === 'DATETIME'}
                <DatePicker
                    bind:value    = { attribute.defaultValue }
                    id            = "default-value"
                    label         = "Default Value"
                    error         = { errors.defaultValue }
                    onInput      = { () => clearError( 'defaultValue' ) }
                />
            {:else if attribute.type === 'BOOLEAN'}
                <Switch
                    bind:checked    = { attribute.defaultValue }
                    label           = "Default Value"
                    id              = "default-value"
                />
            {:else if attribute.type === 'JSON'}
                <JsonGenerator bind:value={attribute.defaultValue} />
            {:else if attribute.type === 'LIST'}
                <Input
                    bind:value  = { attribute.defaultValue }
                    label       = "Default Value"
                    placeholder = "Enter default value"
                    id          = "default-value"
                    name        = "default-value"
                    type        = 'text'
                    error       = { errors.defaultValue }
                    onInput     = { () => clearError( 'defaultValue' ) }
                />
            {/if}

            {#if attribute.id }
                <Switch
                    bind:checked    = { attribute.canChangeAll }
                    label           = "Updates All Users"
                    id              = "can-change-all"
                />

                <Switch
                    bind:checked    = { isReset }
                    label           = "Reset Value"
                    id              = "reset-value"
                />
            {/if}

            <div class="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                {#if attribute.type === 'NUMBER' || attribute.type === 'DECIMAL'}
                    <Input
                        bind:value  = { attribute.min }
                        label       = "Min Value"
                        placeholder = "Enter min value"
                        id          = "min-value"
                        name        = "min-value"
                        type        = 'number'
                        step        = { attribute.type === 'DECIMAL' ? '0.1' : '1' }
                        error       = { errors.min }
                        onInput     = { () => clearError( 'min' ) }
                    />

                    <Input
                        bind:value  = { attribute.max }
                        label       = "Max Value"
                        placeholder = "Enter max value"
                        id          = "max-value"
                        name        = "max-value"
                        type        = 'number'
                        step        = { attribute.type === 'DECIMAL' ? '0.1' : '1' }
                        error       = { errors.max }
                        onInput     = { () => clearError( 'max' ) }
                    />
                {:else if attribute.type === 'STRING'}
                    <Input
                        bind:value  = { attribute.minLength }
                        label       = "Min Length Value"
                        placeholder = "Enter min Length"
                        id          = "min-value-length"
                        name        = "min-value-length"
                        type        = 'number'
                        error       = { errors.minLength }
                        onInput     = { () => clearError( 'minLength' ) }
                    />

                    <Input
                        bind:value  = { attribute.maxLength }
                        label       = "Max Length Value"
                        placeholder = "Enter max Length"
                        id          = "max-value-length"
                        name        = "max-value-length"
                        type        = 'number'
                        error       = { errors.maxLength }
                        onInput     = { () => clearError( 'maxLength' ) }
                    />

                    <div class="grid col-span-2 gap-4">
                        <Select
                            bind:value  = { attribute.pattern }
                            label       = "Pattern Type"
                            placeholder = "Select Pattern"
                            id          = "pattern-type"
                            name        = "pattern-type"
                            options     = { patternOptions }
                        >
                            {#snippet icon()}
                                <PatternIcon />
                            {/snippet}
                        </Select>

                        <Input
                            bind:value  = { attribute.pattern }
                            label       = "Pattern"
                            placeholder = "Enter Pattern (regex)"
                            id          = "pattern"
                            name        = "pattern"
                            type        = 'text'
                            error       = { errors.pattern }
                            onInput     = { () => clearError( 'pattern' ) }
                        />
                    </div>
                {:else if attribute.type === 'DATETIME'}
                    <DatePicker
                        bind:value    = { attribute.minDate }
                        id            = "min-date"
                        label         = "Min Date"
                        error         = { errors.minDate }
                        onInput      = { () => clearError( 'minDate' ) }
                    />

                    <DatePicker
                        bind:value    = { attribute.maxDate }
                        id            = "max-date"
                        label         = "Max Date"
                        error         = { errors.maxDate }
                        onInput      = { () => clearError( 'maxDate' ) }
                    />
                {/if}
            </div>

            <Switch
                bind:checked    = { attribute.required }
                label           = "Required"
                id              = "required"
            />

            <Switch
                bind:checked    = { attribute.isActive }
                label           = "Active"
                id              = "active"
            />
        </div>

        <DateForm
            show        = { !!attribute.id }
            createdAt   = { attribute.createdAt }
            updatedAt   = { attribute.updatedAt }
        />
    </PanelMain>

    <PanelFooter>
        <div class="flex items-center space-x-3">
            <button
                type="button"
                class="close-panel px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors duration-300 active:scale-[0.98] active:bg-gray-700"
                onclick={ () => clicked++ }
            >
                Close
            </button>

            <button
                type="submit"
                class="save-panel px-4 py-2 bg-neon-blue text-dark-blue rounded-md hover:bg-opacity-80 transition-colors duration-300"
            >
                {attribute.id ? 'Update Attribute' : 'Create Attribute'}
            </button>
        </div>
    </PanelFooter>
</form>
