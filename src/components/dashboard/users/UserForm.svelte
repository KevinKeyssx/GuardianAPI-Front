<script lang="ts">
    import { CalendarDateTime, type DateValue } from "@internationalized/date";
    import toast                                from 'svelte-french-toast';

    import DatePicker   from "@/components/inputs/DatePicker.svelte";
    import Input        from "@/components/inputs/Input.svelte";
    import Switch       from "@/components/inputs/Switch.svelte";
    import Modal        from "@/components/shared/Modal.svelte";
    import PanelFooter  from "@/components/shared/panel/PanelFooter.svelte";
    import PanelMain    from "@/components/shared/panel/PanelMain.svelte";
    import Upload       from "@/components/inputs/Upload.svelte";
    import DateForm     from "@/components/shared/show/date-form.svelte";

    import type {
        CreateUserInput,
        UpdateUserInput,
        User
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


    // Get maximum date for birthdate (today)
    function getMaxDate(): DateValue {
        const date = new Date();
        return new CalendarDateTime( date.getFullYear(), date.getMonth() + 1, date.getDate() );
    }


    // Create new user
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
            toast.success( 'Usuario creado correctamente', successToast() );

            user = {} as User;
            avatarFile = null;

            clicked++;
            onSuccess?.();
        }
    }


    // Update existing user
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
            toast.success( 'Usuario actualizado correctamente', successToast() );

            clicked++;
            onSuccess?.();
        }
    }


    // Handle form submission
    async function handleFormSubmit( event: Event ): Promise<void> {
        event.preventDefault();
        console.log("🚀 ~ file: UserForm.svelte:117 ~ user:", user)

        if ( !user.email ) {
            toast.error( 'El email es requerido', errorToast() );
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
        <Upload bind:file={ avatarFile } />

        <Input
            bind:value={ user.email }
            placeholder = "Enter email"
            id          = "email"
            name        = "email"
            type        = 'email'
            label       = "Email"
            required    = { true }
        />

        <Input
            bind:value={ user.name }
            placeholder = "Enter name"
            id          = "name"
            name        = "name"
            type        = 'text'
            label       = "Name"
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
