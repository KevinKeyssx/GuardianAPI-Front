<script lang="ts">
    import { onMount } from 'svelte';

    // import Paginations                  from "@/components/shared/table/Pagination.svelte";
    // import Panel                from "@/components/shared/panel/Panel.svelte";
    import {
        Table,
        TableData,
        TableRow,
        type ColumnProp
    }                           from "@/components/shared/table";
    // import RoleForm             from "./RoleForm.svelte";
    import type { RolesQuery }  from "@/lib/graphql/roles/types";
    import { ROLES_QUERY }      from "@/lib/graphql/roles/queries";
    import { client }           from "@/lib/urql";
    import { queryStore }       from '@urql/svelte';


    const queryParams = {
        page    : 0,
        each    : 10,
        field   : 'name',
        orderBy : 'desc',
    };


    const roleResult = queryStore<RolesQuery>({
        client,
        query           : ROLES_QUERY,
        variables       : queryParams,
        requestPolicy   : 'cache-and-network'
        // Usar cache-and-network para cargar desde cache y actualizar en segundo plano
    });


    function refetchUsers() {
        roleResult.reexecute({ requestPolicy: 'network-only' });
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

    onMount(() => {
        startRefreshInterval();
        return () => stopRefreshInterval();
    });

    const columns: ColumnProp[] = [
        { column: 'Name',           showColumn: true },
        { column: 'Description',    showColumn: true },
        { column: 'Created At' ,    showColumn: true },
        { column: 'Actions',        showColumn: true }
    ];

    let clicked = $state( 0 );
</script>

<div class="animate-fade-in">
    <h1 class="text-2xl font-orbitron text-white mb-6">Roles & Permissions</h1>

    <div class="flex justify-between items-center mb-4">
        <div class="relative w-64">
            <input type="text" placeholder="Search roles..." class="search-input w-full bg-dark-blue/30 border border-neon-blue/30 rounded-md py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue/60" data-section="roles">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
        </div>

        <!-- <Panel
            id              = "add-role"
            title           = "Add Role"
            saveButtonText  = "Add"
            buttonText      = "Add Role"
        >
            <RoleForm id="add-role" />
        </Panel> -->
    </div>

    {#if $roleResult.fetching}
        <p>Loading...</p>
    {:else if $roleResult.error}
        <p>Error: {$roleResult.error.message}</p>
    {:else if $roleResult.data}
        <Table columns={columns}>
            {#each $roleResult.data.roles as role}
                <TableRow>
                    <TableData value={role.name} />
                    <TableData value={role.description} />
                    <TableData value={ role.createdAt } />
                    <TableData size="text-sm font-medium" float={true}>
                        Panel
                        <!-- <Panel
                            buttonText      = ""
                            buttonClass     = ""
                            isEdit          = { true }
                            bind:clicked={ clicked }
                        >
                            <RoleForm role={role} />
                        </Panel> -->
                    </TableData>
                </TableRow>
            {/each}
        </Table>
    {/if}

    <!-- Pagination -->
    <!-- <Paginations totalItems={mockRoles.length} itemsPerPage={5} currentPage={1} /> -->
</div>
