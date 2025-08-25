<script lang="ts">
    // import { onMount } from 'svelte';

    import Table        from "@/components/shared/table/Table.svelte";
    import TableData    from "@/components/shared/table/TableData.svelte";
    import TableRow     from "@/components/shared/table/TableRow.svelte";
    import TableEmpty   from '@/components/shared/table/TableEmpty.svelte';
    import Modal        from '@/components/shared/Modal.svelte';
    import SecretForm   from '@/components/dashboard/secrets/SecretForm.svelte';
    import Filter       from '@/components/inputs/Filter.svelte';

    import { client }               from "@/lib/urql";
    import type { Secret }          from "@/lib/graphql/secrets/types";
    import { queryStore }           from '@urql/svelte';
    import { SECRETS_QUERY }        from "@/lib/graphql/secrets/queries";
    import type { SecretsQuery }    from "@/lib/graphql/secrets/types";


    const secretsResult = queryStore<SecretsQuery>({
        client,
        query           : SECRETS_QUERY,
        requestPolicy   : 'cache-and-network'
        // Usar cache-and-network para cargar desde cache y actualizar en segundo plano
    });


    // function refetchUsers() {
    //     secretsResult.reexecute({ requestPolicy: 'network-only' });
    // }

    // // Configurar intervalo para refrescar datos cada cierto tiempo (ej: cada 30 segundos)
    // let refreshInterval: ReturnType<typeof setInterval> | undefined;

    // Función para iniciar el intervalo de actualización
    // function startRefreshInterval( intervalMs = 1000 * 60 * 30 ) { // 30 minutos por defecto
    //     // Limpiar intervalo existente si hay alguno
    //     if ( refreshInterval ) clearInterval( refreshInterval );

    //     // Crear nuevo intervalo
    //     refreshInterval = setInterval(() => {
    //         console.log( 'Actualizando datos de usuarios...' );
    //         refetchUsers();
    //     }, intervalMs );
    // }

    // // Función para detener el intervalo
    // function stopRefreshInterval() {
    //     if ( refreshInterval ) {
    //         clearInterval( refreshInterval );
    //         refreshInterval = undefined;
    //     }
    // }


    // onMount(() => {
    //     startRefreshInterval();
    //     return () => stopRefreshInterval();
    // });


    const columns = [
        { column: 'Name',           showColumn: true },
        { column: 'Expires At',     showColumn: true },
        { column: 'Will Expire At', showColumn: true },
        { column: 'Active',         showColumn: true },
        { column: 'Created',        showColumn: false },
        { column: 'Updated',        showColumn: false },
        { column: 'Actions',        showColumn: true }
    ];


    let searchTerm      = $state( "" );
    let currentPage     = $state( 1 );


    function handleSearchChange( value: string ): void {
        searchTerm = value;
        currentPage = 1;
    }
</script>

<div class="animate-fade-in">
    <h1 class="text-2xl font-orbitron text-white mb-6">API Secrets</h1>

    <div class="flex justify-between items-center mb-4">
        <Filter 
            bind:value={ searchTerm }
            placeholder = "Search users"
            name        = "userSearch"
            onChange    = { handleSearchChange }
        />

        <Modal
            id      = { 'add-secret' }
            type    = "secret"
            title   = "Add Secret"
        >
            {#snippet form()}
                <SecretForm
                    secret      = { {} as Secret }
                    clicked     = { 0 }
                    onSuccess   = { () => {} }
                />
            {/snippet}
        </Modal>
    </div>

    {#if $secretsResult.fetching}
        <p>Loading...</p>
    {:else if $secretsResult.error}
        <p>Error: {$secretsResult.error.message}</p>
    {:else if $secretsResult.data}
        <Table {columns}>
            {#each $secretsResult.data.secret as secret}
                <TableRow>
                    <TableData value={ secret.name } />

                    <TableData value={ secret.expiresAt } />

                    <TableData value={ secret.willExpireAt } />

                    <TableData value={ secret.isActive } />

                    <TableData value={ secret.createdAt } />

                    <TableData value={ secret.updatedAt } />

                    <TableData size="text-sm font-medium" float={ true }>
                        <Modal
                            id      = { 'add-secret' }
                            type    = "secret"
                            title   = "Add Secret"
                        >
                            {#snippet form()}
                                <SecretForm
                                    secret      = { secret }
                                    clicked     = { 0 }
                                    onSuccess   = { () => {} }
                                />
                            {/snippet}
                        </Modal>
                    </TableData>
                </TableRow>
            {:else}
                <TableEmpty
                    columns = { columns.length }
                    data    = "No secrets found"
                />
            {/each}
        </Table>
    {/if}
</div>
