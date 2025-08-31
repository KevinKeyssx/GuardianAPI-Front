<script lang="ts">
    import toast from 'svelte-french-toast';

    import Table        from "@/components/shared/table/Table.svelte";
    import TableData    from "@/components/shared/table/TableData.svelte";
    import TableRow     from "@/components/shared/table/TableRow.svelte";
    import TableEmpty   from '@/components/shared/table/TableEmpty.svelte';
    import Modal        from '@/components/shared/Modal.svelte';
    import SecretForm   from '@/components/dashboard/secrets/SecretForm.svelte';
    import Filter       from '@/components/inputs/Filter.svelte';
    import Action       from "@/components/shared/Action.svelte";

    import { client }                   from "@/lib/urql";
    import type { Secret }              from "@/lib/graphql/secrets/types";
    import { queryStore }               from '@urql/svelte';
    import { SECRETS_QUERY }            from "@/lib/graphql/secrets/queries";
    import type { SecretsQuery }        from "@/lib/graphql/secrets/types";
    import { DELETE_SECRET_MUTATION }   from "@/lib/graphql/secrets/mutations";

    import {
        errorToast,
        successToast
    } from '@/config/toast.config';


    const secretsResult = queryStore<SecretsQuery>({
        client,
        query           : SECRETS_QUERY,
        requestPolicy   : 'cache-and-network'
    });


    let deletedSecretIds    = $state<string[]>( [] );
    let searchTerm          = $state( "" );


    const filteredSecrets = $derived(( $secretsResult.data?.secret || [] ).filter( secret => {
        if ( deletedSecretIds.includes( secret.id! ) ) return false;

        if ( !searchTerm.trim() ) return true;

        const searchLower = searchTerm.toLowerCase();

        return secret.name?.toLowerCase().includes( searchLower );
    }));


    const columns = [
        { column: 'Name',           showColumn: true },
        { column: 'Expires At',     showColumn: true },
        { column: 'Will Expire At', showColumn: true },
        { column: 'Active',         showColumn: true },
        { column: 'Created',        showColumn: false },
        { column: 'Updated',        showColumn: false },
        { column: 'Actions',        showColumn: true }
    ];


    function handleSearchChange( value: string ): void {
        searchTerm  = value;
    }


    async function handleDeleteSecret( id: string ): Promise<void> {
        const { data, error } = await client.mutation(
            DELETE_SECRET_MUTATION,
            { removeSecretId: id }
        ).toPromise();

        if ( error ) {
            console.error( 'Error deleting secret:', error );
            toast.error( 'Error deleting secret', errorToast() );
            return;
        }

        if ( data ) {
            console.log( 'Secret deleted successfully:', id, data );
            toast.success( 'Secret deleted successfully', successToast() );
            deletedSecretIds = [...deletedSecretIds, id];
        }
    }
</script>

<div class="animate-fade-in">
    <h1 class="text-2xl font-orbitron text-white mb-6">API Secrets</h1>

    <div class="flex justify-between items-center mb-4">
        <Filter 
            bind:value={ searchTerm }
            placeholder = "Search secrets"
            name        = "secretSearch"
            onChange    = { handleSearchChange }
        />

        <Modal
            id          = "add-secret"
            title       = "Add Secret"
            buttonText  = "Add Secret"
        >
            {#snippet form()}
                <SecretForm
                    secret      = { {} as Secret }
                    clicked     = { 0 }
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
            {#each filteredSecrets as secret}
                <TableRow>
                    <TableData value={ secret.name } />

                    <TableData value={ secret.expiresAt } />

                    <TableData value={ secret.willExpireAt } />

                    <TableData value={ secret.isActive } />

                    <TableData value={ secret.createdAt } />

                    <TableData value={ secret.updatedAt } />

                    <TableData size="text-sm font-medium" float={ true }>
                            <Action
                                clicked     = {0}
                                titleEdit   = "Edit Secret"
                                isModal     = { true }
                                onDelete    = { () => handleDeleteSecret( secret.id! )}
                                type        = { 'the secret' }
                                data        = { secret.name || 'secret' }
                            >
                                {#snippet form()}
                                    <SecretForm
                                        secret      = { secret }
                                        clicked     = { 0 }
                                    />
                                {/snippet}
                            </Action>
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
