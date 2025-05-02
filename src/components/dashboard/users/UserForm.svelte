<script lang="ts">
    import { CalendarDateTime, type DateValue } from "@internationalized/date";

    import DatePicker       from "@/components/inputs/DatePicker.svelte";
    import Input            from "@/components/inputs/Input.svelte";
    import Switch           from "@/components/inputs/Switch.svelte";
    import Modal            from "@/components/shared/Modal.svelte";
    import PanelFooter      from "@/components/shared/panel/PanelFooter.svelte";
    import PanelMain        from "@/components/shared/panel/PanelMain.svelte";
    import type { User }    from "@/lib/graphql/users/types";
    import Upload           from "@/components/inputs/Upload.svelte";


    type Props = {
        user: User;
        clicked: number;
    }


    let {
        user: incomingUser,
        clicked = $bindable(),
    }: Props = $props();


    let user = $state<User>( incomingUser );


    function getMaxDate(): DateValue {
        const date = new Date();
        return new CalendarDateTime( date.getFullYear(), date.getMonth() + 1, date.getDate() );
    }
</script>

<PanelMain>
    <form class="space-y-4">
        <Upload bind:avatar={ user.avatar } />

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
    </form>

    <div class="mt-12 space-y-2">
        <p class="flex items-center px-4 py-2 border border-neon-blue/50 bg-neon-blue/10 text-neon-blue rounded-md justify-between">
            <span class="text-sm font-orbitron font-bold">
                Created:
            </span>
            <span>5h june, 2025 - 00:55</span>
        </p>
        <p class="flex items-center px-4 py-2 border border-neon-blue/50 bg-neon-blue/10 text-neon-blue rounded-md justify-between">
            <span class="text-sm font-orbitron font-bold">
                Updated:
            </span>
            <span>5h june, 2025 - 00:55</span>
        </p>
    </div>
</PanelMain>

<PanelFooter>
    <Modal id={'add-attribute'} type="attribute" title="Add Attribute" />

    <div class="flex items-center space-x-3">
        <button
            class="close-panel px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors duration-300 active:scale-[0.98] active:bg-gray-700"
            onclick={() => {
                clicked++;
            }}
        >
            Close
        </button>

        <button
            class="save-panel px-4 py-2 bg-neon-blue text-dark-blue rounded-md hover:bg-opacity-80 transition-colors duration-300"
            onclick={() => {
                // clicked++;
                console.log('🚀 ~ file: UserForm.svelte:128 ~ clicked:', {...user})
            }}
        >
            Save
        </button>
    </div>
</PanelFooter>
