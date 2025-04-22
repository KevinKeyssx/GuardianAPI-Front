<script lang="ts">
    import DatePicker from "@/components/inputs/DatePicker.svelte";

    // import Modal from "@/components/shared/Modal.astro";
    import Input from "@/components/inputs/Input.svelte";
    import Select from "@/components/inputs/Select.svelte";
    import Switch from "@/components/inputs/Switch.svelte";


    interface Props {
        key: string;
        type: string;
        required?: boolean;
    }

    // Destructura las props usando $props()
    let { key, type, required = false } = $props() as Props;


    let keyState = $state("");
</script>

<div class="space-y-4">

    <!-- {attribute && (
        <Modal id={id} type="attribute" />
    )} -->

    <Input
        label       = "Key Name"
        placeholder = "Enter key name"
        id          = "key"
        name        = "key"
        type        = 'text'
        bind:value  = {key}
    />

    <Select />

    <Input
        label       = "Default Value"
        placeholder = "Enter default value"
        id          = "dvalue"
        name        = "dvalue"
        type        = 'text'
        bind:value  = {key}
    />

    <!-- Min Max -->
    <div class="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
        <Input
            label       = "Min Value"
            placeholder = "Enter min value"
            id          = "min-value"
            name        = "min-value"
            type        = 'number'
            bind:value  = {key}
        />

        <Input
            label       = "Max Value"
            placeholder = "Enter max value"
            id          = "max-value"
            name        = "max-value"
            type        = 'number'
            bind:value  = {key}
        />
    </div>

    <!-- Min Max Length -->
    <div class="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
        <Input
            label       = "Min Length Value"
            placeholder = "Enter min Length"
            id          = "min-value-length"
            name        = "min-value-length"
            type        = 'number'
            bind:value  = {key}
        />

        <Input
            label       = "Max Length Value"
            placeholder = "Enter max Length"
            id          = "max-value-length"
            name        = "max-value-length"
            type        = 'number'
            bind:value  = {key}
        />
    </div>

    <!-- Min Max Date -->
    <DatePicker label="Min Date" />

    <DatePicker label="Max Date" />

    <Input
        label       = "Pattern"
        placeholder = "Enter Pattern"
        id          = "pattern"
        name        = "pattern"
        type        = 'text'
        bind:value  = {key}
    />

    <Switch label="Required" />
</div>