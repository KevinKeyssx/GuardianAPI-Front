<script lang="ts">
    import { createQuery } from '@tanstack/svelte-query';

    import {
        Table,
        TableData,
        TableRow,

        type ColumnProp

    }                       from "@/components/shared/table";
    import Panel            from "@/components/shared/panel/Panel.svelte";
    import AttributeForm    from "./AttributeForm.svelte";

    import type { Attribute, AttributesQuery }  from "@/lib/graphql/attributes/types";
    import { ATTRIBUTES_QUERY }                 from "@/lib/graphql/attributes/queries";
    import { graphqlClient }                    from "@/lib/graphql/query-client";
    import AttributeType from './AttributeType.svelte';


    const queryParams = {
        page            : 0,
        each            : 10,
        field           : 'createdAt',
        orderBy         : 'desc',
        attributeKeys   : [],
    };

    const attributesQuery = createQuery({
        queryKey: ['attributes', queryParams],
        queryFn: async (): Promise<AttributesQuery> => {
        return await graphqlClient.request(ATTRIBUTES_QUERY, queryParams);
        },
    });


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

    let clicked = $state( 0 );
</script>


<div class="animate-fade-in">
    <h1 class="text-2xl font-orbitron text-white mb-6">User Attributes</h1>

    <div class="flex justify-between items-center mb-4">
        <div class="relative w-64">
            <input
                type            = "text"
                placeholder     = "Search attributes..."
                class           = "search-input w-full bg-dark-blue/30 border border-neon-blue/30 rounded-md py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue/60"
                data-section    = "attributes"
            />

            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
        </div>

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
    </div>

    {#if $attributesQuery.isLoading}
        <p>Loading...</p>
    {:else if $attributesQuery.isError}
        <p>Error: {$attributesQuery.error.message}</p>
    {:else if $attributesQuery.data}
        <Table {columns}>
            {#each $attributesQuery.data.userAttributes as attr}
                <TableRow>
                    <TableData value={attr.key} />
                    <TableData value={attr.defaultValue} />
                    <TableData>
                        <AttributeType type={attr.type || 'default'} />
                    </TableData>
                    <TableData value={ attr.required } />
                    <TableData value={ attr.min } />
                    <TableData value={ attr.max } />
                    <TableData value={ attr.minLength } />
                    <TableData value={ attr.maxLength } />
                    <TableData value={ attr.minDate } />
                    <TableData value={ attr.maxDate } />
                    <TableData value={ attr.pattern } />
                    <TableData value={ attr.isActive } />
                    <TableData size="text-sm font-medium" float={true}>
                        Panel
                        <!-- <Panel
                            title           = "Edit Attribute"
                            buttonText      = ""
                            buttonClass     = ""
                            isEdit          = { true }
                            bind:clicked    = { clicked }
                        >
                            <AttributeForm
                                bind:clicked={ clicked }
                                attribute={attr}
                            />
                        </Panel> -->
                    </TableData>
                </TableRow>
            {/each}
        </Table>
    {/if}

    <!-- Pagination -->
    <!-- <Paginations totalItems={mockAttributes.length} itemsPerPage={5} currentPage={1} /> -->
</div>
