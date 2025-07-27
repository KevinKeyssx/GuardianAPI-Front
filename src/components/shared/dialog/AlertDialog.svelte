<script lang="ts">
    import { AlertDialog } from "bits-ui";

    import DeleteIcon from "@/icons/DeleteIcon.svelte";

    interface Props {
        onDelete    : () => void;
        type        : string;
        data        : string;
    }

    const { onDelete, type, data  }: Props = $props();
</script>

<AlertDialog.Root>
    <AlertDialog.Trigger class="text-red-500 p-2 hover:bg-neon-blue/20 rounded-md transition-all">
        <DeleteIcon />
    </AlertDialog.Trigger>

    <AlertDialog.Portal>
        <AlertDialog.Overlay
            class="fixed inset-0 z-50 bg-space-blue/10 backdrop-blur-sm data-[state=open]:animate-overlay-show"
        />

        <AlertDialog.Content
            class="animate-dialog-in rounded-md bg-dark-blue shadow-popover outline-hidden fixed left-[50%] top-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 border border-neon-blue/20 p-7 sm:max-w-lg md:w-full"
        >
            <div class="flex flex-col gap-4 pb-6">
                <AlertDialog.Title class="text-lg font-semibold text-neon-blue">
                    Confirm your action
                </AlertDialog.Title>

                <AlertDialog.Description class="text-sm text-white">
                    Are you sure you want to delete { type } <b class="text-neon-blue">{ data }</b>?

                    <p>This action cannot be undone. ❌</p>
                </AlertDialog.Description>
            </div>

            <div class="flex w-full items-center justify-center gap-2">
                <AlertDialog.Cancel
                    class="px-4 py-2 bg-neon-blue/20 hover:bg-neon-blue/30 text-white rounded-md transition-colors duration-300 flex items-center"
                >
                    Cancel
                </AlertDialog.Cancel>

                <AlertDialog.Action
                    class="px-4 py-2 bg-neon-blue text-dark-blue rounded-md hover:bg-opacity-80 transition-colors duration-300 flex items-center"
                >
                    Continue
                </AlertDialog.Action>
            </div>
        </AlertDialog.Content>
    </AlertDialog.Portal>
</AlertDialog.Root>

<style>
    :global(.animate-dialog-in) {
        animation: dialogIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes dialogIn {
        from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
</style>
