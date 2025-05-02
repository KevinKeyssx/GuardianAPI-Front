<script lang="ts">
    import Panel from "@/components/shared/panel/Panel.svelte";
    import AttributeForm from "./AttributeForm.svelte";

    let clicked = 0;
</script>

<Panel
    title       = "Add Attribute"
    buttonText  = "Add Attribute"
    isEdit      = { false }
    buttonClass = "fixed sm:static sm:flex bottom-16 sm:bottom-auto right-4 sm:right-auto bg-neon-blue text-dark-blue rounded-full sm:rounded-lg px-2.5 sm:px-4 sm:py-2 hover:bg-opacity-80 transition-colors duration-300 sm:items-center "
    bind:clicked={ clicked }
>
    <AttributeForm
        key={'llave'}
        bind:clicked={ clicked }
    />
</Panel>
