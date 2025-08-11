<script lang="ts">
    import toast            from 'svelte-french-toast';
    import {
        Table,
        TableData,
        TableRow,
        type ColumnProp
    }                       from "@/components/shared/table";
    import Panel            from "@/components/shared/panel/Panel.svelte";
    import TableEmpty       from '@/components/shared/table/TableEmpty.svelte';
    import AttributeForm    from "@/components/dashboard/attributes/AttributeForm.svelte";
    import AttributeType    from '@/components/dashboard/attributes/AttributeType.svelte';
    import Action           from '@/components/shared/Action.svelte';
    import Filter           from "@/components/inputs/Filter.svelte";

    import {
        errorToast,
        successToast
    }                                           from '@/config/toast.config';
    import type { Attribute, AttributesQuery }  from "@/lib/graphql/attributes/types";
    import { ATTRIBUTES_QUERY }                 from "@/lib/graphql/attributes/queries";
    import { DELETE_ATTRIBUTE_MUTATION }        from "@/lib/graphql/attributes/mutations";
    import { client }                           from "@/lib/urql";
    import { queryStore }                       from '@urql/svelte';


    const attributeResult = queryStore<AttributesQuery>({
        client,
        query           : ATTRIBUTES_QUERY,
        variables       : {},
        requestPolicy   : 'cache-and-network'
    });


    let deletedAttributeIds = $state<string[]>( [] );


    const filteredAttributes = $derived(( $attributeResult.data?.userAttributes || [] ).filter( attribute => {
        if ( deletedAttributeIds.includes( attribute.id! ) ) return false;

        if ( !searchTerm.trim() ) return true;

        const searchLower = searchTerm.toLowerCase();

        return attribute.key?.toLowerCase().includes( searchLower );
    }));


    const columns: ColumnProp[] = [
        { column: 'Key',        showColumn: true },
        { column: 'Def. Value', showColumn: true },
        { column: 'Type',       showColumn: true },
        { column: 'Required',   showColumn: true },
        { column: 'Min',        showColumn: true },
        { column: 'Max',        showColumn: true },
        { column: 'Min Length', showColumn: true },
        { column: 'Max Length', showColumn: true },
        { column: 'Min Date',   showColumn: true },
        { column: 'Max Date',   showColumn: true },
        { column: 'Pattern',    showColumn: true },
        { column: 'Active',     showColumn: true },
        { column: 'Actions',    showColumn: true },
    ];


    let clicked     = $state( 0 );
    let searchTerm  = $state( "" );


    function refetchAttributes(): void {
        attributeResult.reexecute({ requestPolicy: 'network-only' });
        deletedAttributeIds = [];
    }


    async function handleDeleteAttribute( id: string ): Promise<void> {
        const { data, error } = await client.mutation(
            DELETE_ATTRIBUTE_MUTATION,
            { removeUserAttributeId: id }
        ).toPromise();

        if ( error ) {
            console.error( 'Error deleting attribute:', error );
            toast.error( 'Error deleting attribute', errorToast() );
            return;
        }

        if ( data ) {
            console.log( 'Attribute deleted successfully:', id, data );
            toast.success( 'Attribute deleted successfully', successToast() );
            deletedAttributeIds = [...deletedAttributeIds, id];
        }
    }


    function handleSearchChange( value: string ): void {
        searchTerm = value;
    }
</script>

<div class="animate-fade-in">
    <h1 class="text-2xl font-orbitron text-white mb-6">User Attributes</h1>

    <div class="flex justify-between items-center mb-4">
        <Filter
            bind:value={searchTerm}
            placeholder = "Search attributes"
            name        = "attributeSearch"
            onChange    = { handleSearchChange }
        />

        <Panel
            title       = "Add Attribute"
            buttonText  = "Add Attribute"
            isEdit      = { false }
            buttonClass = "fixed sm:static sm:flex bottom-16 sm:bottom-auto right-4 sm:right-auto bg-neon-blue text-dark-blue rounded-full sm:rounded-lg px-2.5 sm:px-4 sm:py-2 hover:bg-opacity-80 transition-colors duration-300 sm:items-center "
            bind:clicked={ clicked }
        >
            <AttributeForm
                bind:clicked={ clicked }
                attribute={{} as Attribute}
            />
        </Panel>
    </div>

    {#if $attributeResult.fetching}
        <div class="flex justify-center items-center py-8">
            <p class="text-white">Loading attributes...</p>
        </div>
    {:else if $attributeResult.error}
        <div class="bg-red-900/30 text-red-300 p-4 rounded-lg mb-4">
            <p>Error fetching attributes</p>

            <button
                class   = "mt-2 px-3 py-1 bg-red-700/50 hover:bg-red-700/70 rounded-md text-sm"
                onclick = { refetchAttributes }
            >
                Retry
            </button>
        </div>
    {:else if $attributeResult.data}
        <Table {columns}>
            {#each filteredAttributes as attribute}
                <TableRow>
                    <TableData value={attribute.key} />

                    <TableData value={attribute.defaultValue} />

                    <TableData>
                        <AttributeType type={attribute.type || 'default'} />
                    </TableData>

                    <TableData value={ attribute.required } />

                    <TableData value={ attribute.min } />

                    <TableData value={ attribute.max } />

                    <TableData value={ attribute.minLength } />

                    <TableData value={ attribute.maxLength } />

                    <TableData value={ attribute.minDate } />

                    <TableData value={ attribute.maxDate } />

                    <TableData value={ attribute.pattern } />

                    <TableData value={ attribute.isActive } />

                    <TableData size="text-sm font-medium" float={true}>
                        <Action
                            { clicked }
                            titleEdit    = "Edit Attribute"
                            onDelete     = { () => handleDeleteAttribute( attribute.id! )}
                            type         = { 'the attribute' }
                            data         = { attribute.key  || 'name' }
                        >
                            {#snippet form()}
                                <AttributeForm
                                    bind:clicked={ clicked }
                                    { attribute }
                                />
                            {/snippet}
                        </Action>
                    </TableData>
                </TableRow>
            {:else}
                <TableEmpty
                    columns = { columns.length }
                    data    = "No attributes found"
                />
            {/each}
        </Table>
    {/if}
</div>
