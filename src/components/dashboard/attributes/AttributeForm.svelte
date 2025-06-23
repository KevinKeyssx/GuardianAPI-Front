<script lang="ts">
    import { PuzzlePiece } from "phosphor-svelte";

    import DatePicker   from "@/components/inputs/DatePicker.svelte";
    import Input        from "@/components/inputs/Input.svelte";
    import Select       from "@/components/inputs/Select.svelte";
    import Switch       from "@/components/inputs/Switch.svelte";
    import Textarea     from "@/components/inputs/Textarea.svelte";
    import Modal        from "@/components/shared/Modal.svelte";
    import PanelFooter  from "@/components/shared/panel/PanelFooter.svelte";
    import PanelMain    from "@/components/shared/panel/PanelMain.svelte";
    import DateForm     from "@/components/shared/show/date-form.svelte";

    import type { Attribute } from "@/lib/graphql/attributes/types";


    type Props = {
        attribute: Attribute;
        clicked: number;
    }


    let {
        attribute: incomingAttribute,
        clicked = $bindable(),
    }: Props = $props();


    let attribute = $state<Attribute>( incomingAttribute );


    const options = [
        { label: 'String',      value: 'STRING' },
        { label: 'Number',      value: 'NUMBER' },
        { label: 'Boolean',     value: 'BOOLEAN' },
        { label: 'Decimal',     value: 'DECIMAL' },
        { label: 'List',        value: 'LIST' },
        { label: 'Json',        value: 'JSON' },
        { label: 'Datetime',    value: 'DATETIME' },
        { label: 'UUID',        value: 'UUID' },
    ];
</script>

<PanelMain>
    <form class="space-y-4">
        <Input
            bind:value  = { attribute.key }
            label       = "Key Name"
            placeholder = "Enter key name"
            id          = "key"
            name        = "key"
            type        = 'text'
        />

        <Select
            bind:value  = { attribute.type }
            onChange    = { () => attribute.defaultValue = null }  
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
                type        = 'number'
            />
        {:else if attribute.type === 'STRING' || attribute.type === 'UUID'}
            <Input
                bind:value  = { attribute.defaultValue }
                label       = "Default Value"
                placeholder = "Enter default value"
                id          = "default-value"
                name        = "default-value"
                type        = 'text'
            />
        {:else if attribute.type === 'DATETIME'}
            <DatePicker
                bind:value    = { attribute.defaultValue }
                id            = "default-value"
                label         = "Default Value"
            />
        {:else if attribute.type === 'BOOLEAN'}
            <Switch
                bind:checked    = { attribute.defaultValue }
                label           = "Default Value"
                id              = "default-value"
            />
        {:else if attribute.type === 'JSON'}
            <Textarea
                bind:value  = { attribute.defaultValue }
                label       = "Default Value"
                placeholder = "Enter default value"
                id          = "default-value"
                name        = "default-value"
            />
        {:else if attribute.type === 'LIST'}
            <Input
                bind:value  = { attribute.defaultValue }
                label       = "Default Value"
                placeholder = "Enter default value"
                id          = "default-value"
                name        = "default-value"
                type        = 'text'
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
                />

                <Input
                    bind:value  = { attribute.max }
                    label       = "Max Value"
                    placeholder = "Enter max value"
                    id          = "max-value"
                    name        = "max-value"
                    type        = 'number'
                />
            {:else if attribute.type === 'STRING'}
                <Input
                    bind:value  = { attribute.minLength }
                    label       = "Min Length Value"
                    placeholder = "Enter min Length"
                    id          = "min-value-length"
                    name        = "min-value-length"
                    type        = 'number'
                />

                <Input
                    bind:value  = { attribute.maxLength }
                    label       = "Max Length Value"
                    placeholder = "Enter max Length"
                    id          = "max-value-length"
                    name        = "max-value-length"
                    type        = 'number'
                />

                <div class="grid col-span-2">
                    <Input
                        bind:value  = { attribute.pattern }
                        label       = "Pattern"
                        placeholder = "Enter Pattern"
                        id          = "pattern"
                        name        = "pattern"
                        type        = 'text'
                    />
                </div>
            {:else if attribute.type === 'DATETIME'}
                <DatePicker
                    bind:value    = { attribute.minDate }
                    id            = "min-date"
                    label         = "Min Date"
                />

                <DatePicker
                    bind:value    = { attribute.maxDate }
                    id            = "max-date"
                    label         = "Max Date"
                />
            {/if}
        </div>

        <Switch
            bind:checked    = { attribute.required }
            label           = "Required"
            id              = "required"
        />
    </form>

    <DateForm
        show        = { !!attribute.id }
        createdAt   = { attribute.createdAt }
        updatedAt   = { attribute.updatedAt }
    />
</PanelMain>

<PanelFooter>
    <Modal
        id      = { 'add-attribute' }
        type    = "attribute"
        title   = "Add Attribute"
    />

    <div class="flex items-center space-x-3">
        <button
            class="close-panel px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors duration-300 active:scale-[0.98] active:bg-gray-700"
            onclick={ () => clicked++ }
        >
            Close
        </button>

        <button
            class="save-panel px-4 py-2 bg-neon-blue text-dark-blue rounded-md hover:bg-opacity-80 transition-colors duration-300"
            onclick={() => {
                // clicked++;
                console.log('🚀 ~ file: AttributeForm.svelte:112 ~ isPanelOpen:', {...attribute})
            }}
        >
            Save
        </button>
    </div>
</PanelFooter>