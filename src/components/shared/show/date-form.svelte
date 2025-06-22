<script lang="ts">
    type Props = {
        show: boolean;
        createdAt?: string | null;
        updatedAt?: string | null;
    }

    let { show, createdAt, updatedAt }: Props = $props();
</script>

{#if show }
    <div class="mt-12 space-y-2">
        <p class="flex items-center px-4 py-2 border border-neon-blue/50 bg-neon-blue/10 text-neon-blue rounded-md justify-between">
            <span class="text-sm font-orbitron font-bold">
                Created:
            </span>

            <span>{ createdAt }</span>
        </p>

        <p class="flex items-center px-4 py-2 border border-neon-blue/50 bg-neon-blue/10 text-neon-blue rounded-md justify-between">
            <span class="text-sm font-orbitron font-bold">
                Updated:
            </span>
            <span>{ updatedAt }</span>
        </p>
    </div>
{/if}
