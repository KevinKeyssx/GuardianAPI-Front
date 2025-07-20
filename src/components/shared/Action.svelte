<script lang="ts">
    import type { Snippet } from "svelte";

    import Panel        from "@/components/shared/panel/Panel.svelte";
    import AlertDialog  from "@/components/shared/dialog/AlertDialog.svelte";


    interface Props {
        clicked     : number;
        onDelete    : ( ) => void;
        titleEdit   : string;
        form        : Snippet;
        type        : string;
        data        : string;
    }


    const {
        clicked = $bindable(),
        onDelete,
        titleEdit,
        form,
        type,
        data
    }: Props = $props();
</script>

<div class="flex gap-2 items-center">
    <Panel
        clicked     = { clicked }
        title       = { titleEdit }
        buttonText  = ""
        buttonClass = ""
        isEdit      = { true }
    >
        {@render form()}
    </Panel>

    <AlertDialog { onDelete } { type } { data } />
</div>
