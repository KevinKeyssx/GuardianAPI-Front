<script lang="ts">
    import TableRow from "./TableRow.svelte";

    export let columns: number;
    export let data: string = 'No data found';
</script>

<TableRow>
    <td colspan="{columns}" class="text-center h-16 text-white">
        {data}
    </td>
</TableRow>