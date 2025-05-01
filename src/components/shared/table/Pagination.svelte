<script lang="ts">
    export type Props = {
        totalItems      : number;
        itemsPerPage?   : number;
        currentPage?    : number;
    }

    let {
        totalItems,
        itemsPerPage,
        currentPage
    }: Props = $props();
</script>

<div class="grid justify-end sm:flex sm:justify-between gap-4 items-center mt-4 ">
    <div class="attributes-pagination-info text-sm text-gray-400">
        Showing <span class="text-white">{itemsPerPage}</span> to <span class="text-white">{totalItems}</span> of <span class="text-white">{totalItems}</span> attributes
    </div>
    <div class="flex space-x-1">
        <button class="px-3 py-1 rounded-md bg-dark-blue/50 text-gray-400 border border-neon-blue/20 hover:bg-neon-blue/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            Previous
        </button>
        <button class="px-3 py-1 rounded-md bg-neon-blue/10 text-neon-blue border border-neon-blue/30">
            {currentPage}
        </button>
        <button class="px-3 py-1 rounded-md bg-dark-blue/50 text-gray-400 border border-neon-blue/20 hover:bg-neon-blue/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            Next
        </button>
    </div>
</div>