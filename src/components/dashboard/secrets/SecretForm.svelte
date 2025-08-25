<script lang="ts">
    import toast    from 'svelte-french-toast';

    import DatePicker   from "@/components/inputs/DatePicker.svelte";
    import Input        from "@/components/inputs/Input.svelte";
    import DateForm     from "@/components/shared/show/date-form.svelte";

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
            console.error( 'Error creating user:', error );
            toast.error( 'Error creating user', errorToast() );

            return;
        }

        if ( data ) {
            console.log("🚀 ~ file: SecretForm.svelte:60 ~ data:", data)
            console.log( 'User created successfully:', data.createUser );
            toast.success( 'User created successfully', successToast() );

            secret = {} as Secret;

            onSuccess?.();
        }
    }


    async function onUpdateSecret(
        input: UpdateSecretInput
    ): Promise<void> {
        const { data, error } = await client.mutation(
            UPDDATE_SECRET_MUTATION, {
                updateUserInput: input,
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

            onSuccess?.();
        }
    }


    function validateForm(): boolean {
        return false;
    }


    async function handleFormSubmit( event: Event ): Promise<void> {
        event.preventDefault();
        console.log("🚀 ~ file: UserForm.svelte:117 ~ user:", secret)

        // Validate form before submission
        // if ( !validateForm() ) {
        //     toast.error( 'Please correct the errors in the form', errorToast() );
        //     return;
        // }

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
