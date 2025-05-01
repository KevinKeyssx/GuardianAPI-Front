<script lang="ts">
    import TableBody            from './TableBody.svelte';
    import TableHead            from './TableHead.svelte';
    import type { ColumnProp }  from './column.model';

    export let columns: ColumnProp[];
</script>

<div class="bg-dark-blue/50 rounded-lg border border-neon-blue/20 overflow-auto w-full">
    <table class="min-w-full divide-y divide-neon-blue/20">
        <TableHead {columns} />

        <TableBody>
            <slot />
        </TableBody>
    </table>
</div>
