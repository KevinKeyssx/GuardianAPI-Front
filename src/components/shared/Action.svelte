<script lang="ts">
    import type { Snippet } from "svelte";

    import Panel        from "@/components/shared/panel/Panel.svelte";
    import AlertDialog  from "@/components/shared/dialog/AlertDialog.svelte";
    import Modal        from "@/components/shared/Modal.svelte";


    interface Props {
        clicked     : number;
        onDelete    : ( ) => void;
        titleEdit   : string;
        form        : Snippet;
        type        : string;
        data        : string;
        isModal?    : boolean;
    }


    const {
        clicked = $bindable(),
        onDelete,
        titleEdit,
        form,
        type,
        data,
        isModal  = false
    }: Props = $props();
</script>

<div class="flex gap-2 items-center">
    {#if isModal}
        <Modal
            id          = "edit-secret"
            title       = { titleEdit }
            buttonText  = ""
            isEdit      = { true }
        >
            {#snippet form()}
                {@render form!()}
            {/snippet}
        </Modal>
    {:else}
        <Panel
            clicked     = { clicked }
            title       = { titleEdit }
            buttonText  = ""
            buttonClass = ""
            isEdit      = { true }
        >
            {@render form()}
        </Panel>
    {/if}

    <AlertDialog { onDelete } { type } { data } />
</div>
