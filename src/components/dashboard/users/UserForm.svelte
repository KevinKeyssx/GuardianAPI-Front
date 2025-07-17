<script lang="ts">
    import { CalendarDateTime, type DateValue } from "@internationalized/date";

    import DatePicker   from "@/components/inputs/DatePicker.svelte";
    import Input        from "@/components/inputs/Input.svelte";
    import Switch       from "@/components/inputs/Switch.svelte";
    import Modal        from "@/components/shared/Modal.svelte";
    import PanelFooter  from "@/components/shared/panel/PanelFooter.svelte";
    import PanelMain    from "@/components/shared/panel/PanelMain.svelte";
    import Upload       from "@/components/inputs/Upload.svelte";
    import DateForm     from "@/components/shared/show/date-form.svelte";

    import type { CreateUserInput, UpdateUserInput, User } from "@/lib/graphql/users/types";


    type Props = {
        user    : User;
        clicked : number;
        onSubmit: ( input: any, file: File | null ) => Promise<void>;
    }


    let {
        user: incomingUser,
        clicked = $bindable(),
        onSubmit = $bindable(),
    }: Props = $props();


    let user = $state<User>( incomingUser );
    let avatarFile: File | null = $state(null);


    function getMaxDate(): DateValue {
        const date = new Date();
        return new CalendarDateTime( date.getFullYear(), date.getMonth() + 1, date.getDate() );
    }


    async function handleFormSubmit( event: Event ) {
        event.preventDefault();

        if ( !user.email ) {
            return;
        }

        const input: CreateUserInput | UpdateUserInput = {
            email       : user.email,
            name        : user.name,
            nickname    : user.nickname,
            birthdate   : user.birthdate ? user.birthdate.toString() : null,
            phone       : user.phone,
            isActive    : user.isActive,
            isVerified  : user.isVerified,
        };

        if ( user.id ) {
            ( input as UpdateUserInput ).id = user.id;
        }

        await onSubmit( input, avatarFile );
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
            type        = 'text'
            label       = "Email"
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
                    class   = "close-panel px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors duration-300 active:scale-[0.98] active:bg-gray-700"
                    onclick = { () => clicked++ }
                >
                    Close
                </button>

                <button
                    class   = "save-panel px-4 py-2 bg-neon-blue text-dark-blue rounded-md hover:bg-opacity-80 transition-colors duration-300"
                    onclick = { () => {
                        // clicked++;
                        console.log('🚀 ~ file: UserForm.svelte:128 ~ clicked:', {...user})
                    }}
                >
                    Save
                </button>
            </div>
        </PanelFooter>
    </form>
</PanelMain>
