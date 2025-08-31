<script lang="ts">
    import toast from 'svelte-french-toast';
    import { z } from 'zod';

    import DatePicker   from "@/components/inputs/DatePicker.svelte";
    import Input        from "@/components/inputs/Input.svelte";

    import {
        GENERATE_SECRET_MUTATION,
        UPDDATE_SECRET_MUTATION
    }                   from "@/lib/graphql/secrets/mutations";
    import type {
        CreateSecretInput,
        Secret,
        UpdateSecretInput
    }                   from "@/lib/graphql/secrets/types";
    import { client }   from "@/lib/urql";

    import {
        errorToast,
        successToast
    }                       from '@/config/toast.config';


    interface Props {
        secret      : Secret;
        clicked     : number;
        onSuccess?  : () => void;
    }


    const {
        secret: secretData,
        clicked = $bindable(),
        onSuccess
    }: Props = $props();


    let secret = $state<Secret>( secretData );
    let errors = $state<Record<string, string>>( {} );


    const secretSchema = z.object({
        willExpireAt    : z.string().nullable().optional(),
        name            : z.string()
            .min( 1, 'Name is required' )
            .max( 100, 'Name must be less than 100 characters' ),
    });


    async function onCreateSecret(
        input: CreateSecretInput,
    ): Promise<void> {
        console.log("🚀 ~ file: SecretForm.svelte:44 ~ input:", input)
        const { data, error } = await client.mutation(
            GENERATE_SECRET_MUTATION, {
                createSecretInput: input
            }
        ).toPromise();

        if ( error ) {
            console.error( 'Error creating secret:', error );
            toast.error( 'Error creating secret', errorToast() );

            return;
        }

        if ( data ) {
            console.log("🚀 ~ file: SecretForm.svelte:60 ~ data:", data)
            console.log( 'Secret created successfully:', data.createSecret );
            toast.success( 'Secret created successfully', successToast() );

            secret = {} as Secret;

            ( window as any )[`closeModal_add-secret`]?.();

            onSuccess?.();
        }
    }


    async function onUpdateSecret(
        input: UpdateSecretInput
    ): Promise<void> {
        const { data, error } = await client.mutation(
            UPDDATE_SECRET_MUTATION, {
                updateSecretInput: input,
            }
        ).toPromise();

        if ( error ) {
            console.error( 'Error updating secret:', error );
            toast.error( 'Error updating secret', errorToast() );
            return;
        }

        if ( data ) {
            console.log( 'Secret updated successfully:', data.updateSecret );
            toast.success( 'Secret updated successfully', successToast() );

            ( window as any )[`closeModal_edit-secret`]?.();

            onSuccess?.();
        }
    }


    // Clear error for specific field
    function clearError( field: string ): void {
        if ( errors[field] ) {
            errors = { ...errors };
            delete errors[field];
        }
    }


    function validateForm(): boolean {
        errors = {};
        let isValid = true;

        const result = secretSchema.safeParse({
            name            : secret.name || '',
            willExpireAt    : secret.willExpireAt || null
        });

        if ( !result.success ) {
            result.error.errors.forEach( ( error ) => {
                const field = error.path[0] as string;
                errors[field] = error.message;
            });
            isValid = false;
        }

        return isValid;
    }


    async function handleFormSubmit( event: Event ): Promise<void> {
        event.preventDefault();
        console.log("🚀 ~ file: UserForm.svelte:117 ~ user:", secret)

        if ( !validateForm() ) {
            return;
        }

        const input: CreateSecretInput | UpdateSecretInput = {
            id              : secret.id,
            name            : secret.name,
            willExpireAt    : secret.willExpireAt,
        };

        console.log("🚀 ~ file: SecretForm.svelte:109 ~ input:", input)

        if ( secret.id ) {
            ( input as UpdateSecretInput ).id = secret.id;

            await onUpdateSecret( input as UpdateSecretInput );
        } else {
            await onCreateSecret( input as CreateSecretInput );
        }
    }
</script>

<form
    class       = "space-y-4"
    id          = "secret-form"
    onsubmit    = { handleFormSubmit }
>
    <Input
        bind:value  = { secret.name }
        label       = "Name"
        placeholder = "Enter name"
        id          = "name"
        name        = "name"
        type        = 'text'
        error       = { errors.name }
        onInput     = { () => clearError( 'name' ) }
    />

    <DatePicker
        bind:value={ secret.willExpireAt }
        id      = "will-expire-at"
        label   = "Will expire at"
        minDate = {new Date()}
    />

    <button type="submit">
        Save
    </button>
</form>
