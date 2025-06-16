<script lang="ts">
    import { onMount } from 'svelte';

    import {
        Pagination,
        Table,
        TableData,
        TableRow,
        type ColumnProp
    }                       from "@/components/shared/table";
    import Panel            from "@/components/shared/panel/Panel.svelte";
    import UserForm         from "@/components/dashboard/users/UserForm.svelte";
    import type { User, UsersQuery }    from "@/lib/graphql/users/types";
    import { USERS_QUERY }  from "@/lib/graphql/users/queries";
    import { client }       from "@/lib/urql";
    import { queryStore }   from '@urql/svelte';
    import TableEmpty from '@/components/shared/table/TableEmpty.svelte';
    // import Filter from "@/components/inputs/Filter.svelte";

    const queryParams = {
        page    : 0,
        each    : 10,
        field   : 'createdAt',
        orderBy : 'desc',
        // attributeKeys: [],
    };

    // Crear la consulta con urql usando queryStore
    const usersResult = queryStore<UsersQuery>({
        client,
        query           : USERS_QUERY,
        variables       : queryParams,
        requestPolicy   : 'cache-and-network'
        // Usar cache-and-network para cargar desde cache y actualizar en segundo plano
    });

    // Función para refrescar los datos manualmente
    function refetchUsers() {
        usersResult.reexecute({ requestPolicy: 'network-only' });
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
        { column: 'Avatar',     showColumn: true },
        { column: 'Email',      showColumn: true },
        { column: 'Name',       showColumn: true },
        { column: 'Nickname',   showColumn: true },
        { column: 'Birthday',   showColumn: true },
        { column: 'Phone',      showColumn: true },
        { column: 'Active',     showColumn: true },
        { column: 'Verified',   showColumn: true },
        { column: 'Role',       showColumn: true },
        { column: 'Last Login', showColumn: true },
        { column: 'Actions',    showColumn: true },
    ];

    let clicked = $state(0);
</script>

<div class="animate-fade-in">
    <h1 class="text-2xl font-orbitron text-white mb-6">Users</h1>

    <div class="flex justify-between items-center mb-4 gap-2 sm:gap-4">
        <!-- <Filter /> -->

        <Panel
            title           = "Add User"
            buttonText      = "Add User"
            isEdit          = { false }
            buttonClass     = "fixed sm:static sm:flex bottom-16 sm:bottom-auto right-4 sm:right-auto bg-neon-blue text-dark-blue rounded-full sm:rounded-lg px-2.5 sm:px-4 sm:py-2 hover:bg-opacity-80 transition-colors duration-300 sm:items-center "
            bind:clicked    = { clicked }
        >
            <UserForm
                bind:clicked={ clicked }
                user={{} as User}
            />
        </Panel>
    </div>

    {#if $usersResult.fetching}
        <div class="flex justify-center items-center py-8">
            <p class="text-white">Loading users...</p>
        </div>
    {:else if $usersResult.error}
        <div class="bg-red-900/30 text-red-300 p-4 rounded-lg mb-4">
            <p>Error fetching users</p>

            <button
                class="mt-2 px-3 py-1 bg-red-700/50 hover:bg-red-700/70 rounded-md text-sm"
                onclick={refetchUsers}
            >
                Retry
            </button>
        </div>
    {:else if $usersResult.data}
        <Table {columns}>
            {#each $usersResult.data.users as user}
                <TableRow>
                    <TableData value={ user.avatar } />
                    <TableData value={ user.email } />
                    <TableData value={ user.name } />
                    <TableData value={ user.nickname } />
                    <TableData value={ user.birthdate as string } />
                    <TableData value={ user.phone } />
                    <TableData value={ user.isActive } />
                    <TableData value={ user.isVerified } />
                    <TableData>
                        {#if user?.roles && user.roles.length > 0}
                            <span class={`px-2 py-1 text-xs rounded-full ${user.roles[0].name === 'Admin' ? 'bg-red-900/30 text-red-300' : user.roles[0].name === 'Developer' ? 'bg-blue-900/30 text-blue-300' : 'bg-green-900/30 text-green-300'}`}>
                                {user.roles[0].name}
                            </span>
                        {:else}
                            <span class="text-gray-400">-</span>
                        {/if}
                    </TableData>
                    <TableData value={user.lastLogin} />
                    <TableData size="text-sm font-medium" float={ true }>
                        <Panel
                            bind:clicked={ clicked }
                            title       = "Edit User"
                            buttonText  = ""
                            buttonClass = ""
                            isEdit      = { true }
                        >
                            <UserForm
                                bind:clicked={ clicked }
                                { user }
                            />
                        </Panel>
                    </TableData>
                </TableRow>
            {:else}
                <TableEmpty
                    columns = { columns.length }
                    data    = "No users found"
                />
            {/each}
        </Table>

        <Pagination
            totalItems      = { 10 }
            itemsPerPage    = { queryParams.each }
            currentPage     = { queryParams.page + 1 }
        />
    {:else}
        <div class="bg-dark-blue/50 p-8 rounded-lg text-center">
            <p class="text-white">No users found</p>
        </div>
    {/if}
</div>
