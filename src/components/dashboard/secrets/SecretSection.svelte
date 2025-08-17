<script lang="ts">
    import { onMount } from 'svelte';

    // import Panel            from "@/components/shared/Panel.svelte";
    import Table        from "@/components/shared/table/Table.svelte";
    import TableData    from "@/components/shared/table/TableData.svelte";
    import TableRow     from "@/components/shared/table/TableRow.svelte";
    import TableEmpty   from '@/components/shared/table/TableEmpty.svelte';
    import Dialog       from '@/components/shared/dialog/dialog.svelte';
    import Modal        from '@/components/shared/Modal.svelte';
    import AlertDialog  from '@/components/shared/dialog/AlertDialog.svelte';
    import SecretForm   from '@/components/dashboard/secrets/SecretForm.svelte';
    // import SecretForm       from "@/components/dashboard/secrets/SecretForm.astro";
    // import SearchIcon       from "@/icons/SearchIcon.astro";
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


    function refetchUsers() {
        secretsResult.reexecute({ requestPolicy: 'network-only' });
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


    const columns = [
        { column: 'Name',           showColumn: true },
        { column: 'Expires At',     showColumn: true },
        { column: 'Will Expire At', showColumn: true },
        { column: 'Active',         showColumn: true },
        { column: 'Created',        showColumn: false },
        { column: 'Updated',        showColumn: false },
        { column: 'Actions',        showColumn: true }
    ];
</script>

<div class="animate-fade-in">
    <h1 class="text-2xl font-orbitron text-white mb-6">API Secrets</h1>

    <div class="flex justify-between items-center mb-4">
        <div class="relative w-64">
            <input
                type            = "text"
                placeholder     = "Search API keys..."
                class           = "search-input w-full bg-dark-blue/30 border border-neon-blue/30 rounded-md py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue/60"
                data-section    = "secrets"
            />

            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <!-- <SearchIcon /> -->
                ...
            </div>
        </div>

    <!-- <Dialog /> -->

    <Modal
        id      = { 'add-secret' }
        type    = "secret"
        title   = "Add Secret"
    >
        {#snippet form()}
            <SecretForm
                secret      = { {} as Secret }
                clicked     = { 0 }
                onSuccess   = {()=>{}}
            />
        {/snippet}
    </Modal>

    <!-- <AlertDialog onDelete ={() =>{}}>
        {#snippet information()}
        <p>Confirm</p>
        {/snippet}
    </AlertDialog> -->


        <!-- <Panel client:only="svelte"
            title           = "New Secret"
            saveButtonText  = "Add"
            buttonText      = "Generate New Key"
        >
            <SecretForm id="add-secret" secret={undefined} />
        </Panel> -->
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
                    <TableData size="text-sm font-medium" float={true}>
                        Panel
                        <!-- <Panel client:only="svelte"
                            buttonText      = ""
                            buttonClass     = ""
                            isEdit          = { true }
                        >
                            <SecretForm id={`id-${index}`} secret={secret} />
                        </Panel> -->
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
