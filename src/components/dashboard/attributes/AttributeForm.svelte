<script lang="ts">
    import DatePicker   from "@/components/inputs/DatePicker.svelte";
    import Input        from "@/components/inputs/Input.svelte";
    import Select       from "@/components/inputs/Select.svelte";
    import Switch       from "@/components/inputs/Switch.svelte";
    import Modal        from "@/components/shared/Modal.svelte";
    import PanelFooter  from "@/components/shared/panel/PanelFooter.svelte";
    import PanelMain    from "@/components/shared/panel/PanelMain.svelte";


    // type Exps = {
        // key?: string;
        // required?: boolean;
        // isPanelOpen?: boolean;
    // }


    // let { key = '', required, isPanelOpen = $bindable<boolean>(false) } = $props() as Exps;

    export let key : string;
    export let clicked : number;
</script>

<PanelMain>

<form class="space-y-4">
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
</form>
</PanelMain>

<PanelFooter>
    <Modal id={'add-attribute'} type="attribute" title="Add Attribute" />

    <div class="flex items-center space-x-3">
        <button
            class="close-panel px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors duration-300 active:scale-[0.98] active:bg-gray-700"
            onclick={() => {
                clicked++;
                console.log('🚀 ~ file: AttributeForm.svelte:112 ~ isPanelOpen:', clicked)
            }}
        >
            Close
        </button>

        <button
            class="save-panel px-4 py-2 bg-neon-blue text-dark-blue rounded-md hover:bg-opacity-80 transition-colors duration-300"
            onclick={() => {
                clicked++;
                console.log('🚀 ~ file: AttributeForm.svelte:112 ~ isPanelOpen:', clicked)
            }}
        >
            Save
        </button>
    </div>
</PanelFooter>