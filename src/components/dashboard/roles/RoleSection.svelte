<script lang="ts">
    import { createQuery } from '@tanstack/svelte-query';

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
    import { graphqlClient }    from "@/lib/graphql/query-client";


    const queryParams = {
        page    : 0,
        each    : 10,
        field   : 'name',
        orderBy : 'desc',
    };


    const rolesQuery = createQuery({
        queryKey    : ['roles', queryParams],
        queryFn     : async (): Promise<RolesQuery> => {
            return await graphqlClient.request( ROLES_QUERY, queryParams )
        }
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

    {#if $rolesQuery.isLoading}
        <p>Loading...</p>
    {:else if $rolesQuery.isError}
        <p>Error: {$rolesQuery.error.message}</p>
    {:else if $rolesQuery.data}
        <Table columns={columns}>
            {#each $rolesQuery.data.roles as role}
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
