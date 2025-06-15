<script lang="ts">
    import { onMount } from 'svelte';

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
    import AttributeType                        from './AttributeType.svelte';
    import { client }       from "@/lib/urql";
    import { queryStore }   from '@urql/svelte';


    const queryParams = {
        page            : 0,
        each            : 10,
        field           : 'createdAt',
        orderBy         : 'desc',
        attributeKeys   : [],
    };


    const attributeResult = queryStore<AttributesQuery>({
        client,
        query           : ATTRIBUTES_QUERY,
        variables       : queryParams,
        requestPolicy   : 'cache-and-network'
        // Usar cache-and-network para cargar desde cache y actualizar en segundo plano
    });


    function refetchUsers() {
        attributeResult.reexecute({ requestPolicy: 'network-only' });
    }

    // Configurar intervalo para refrescar datos cada cierto tiempo (ej: cada 30 segundos)
    let refreshInterval: ReturnType<typeof setInterval> | undefined;

    // Función para iniciar el intervalo de actualización
    function startRefreshInterval(intervalMs = 1000 * 60 * 30) { // 30 minutos por defecto
        // Limpiar intervalo existente si hay alguno
        if ( refreshInterval ) clearInterval( refreshInterval );

        // Crear nuevo intervalo
        refreshInterval = setInterval(() => {
            console.log('Actualizando datos de usuarios...');
            refetchUsers();
        }, intervalMs );
    }

    // Función para detener el intervalo
    function stopRefreshInterval() {
        if ( refreshInterval ) {
            clearInterval( refreshInterval );
            refreshInterval = undefined;
        }
    }

    // Iniciar intervalo al montar el componente
    onMount(() => {
        startRefreshInterval();
        return () => stopRefreshInterval(); // Limpiar al desmontar
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

    {#if $attributeResult.fetching}
        <p>Loading...</p>
    {:else if $attributeResult.error}
        <p>Error: {$attributeResult.error.message}</p>
    {:else if $attributeResult.data}
        <Table {columns}>
            {#each $attributeResult.data.userAttributes as attribute}
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
