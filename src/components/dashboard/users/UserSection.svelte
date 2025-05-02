<script lang="ts">
    import { createQuery } from '@tanstack/svelte-query';

    import {
        Pagination,
        Table,
        TableData,
        TableRow
    }                           from "@/components/shared/table";
    import Panel                from "@/components/shared/panel/Panel.svelte";
    import UserForm             from "@/components/dashboard/users/UserForm.svelte";
    import type { ColumnProp }  from "@/components/shared/table/column.model";
    import type { User, UsersQuery } from "@/lib/graphql/users/types";
    import { USERS_QUERY } from "@/lib/graphql/users/queries";
    import { graphqlClient } from "@/lib/graphql/query-client";
    
    // import Filter       from "@/components/inputs/Filter.astro";

    const queryParams = {
        page: 0,
        each: 10,
        field: 'createdAt',
        orderBy: 'desc',
        attributeKeys: [],
    };

    const usersQuery = createQuery({
        queryKey: ['users', queryParams],
        queryFn: async (): Promise<UsersQuery> => {
        return await graphqlClient.request(USERS_QUERY, queryParams);
        },
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

    let clicked = $state( 0 );
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

{#if $usersQuery.isLoading}
    <p>Loading...</p>
{:else if $usersQuery.isError}
    <p>Error: {$usersQuery.error.message}</p>
{:else if $usersQuery.data}
    <p>Total: {$usersQuery.data.users[0].total}</p>
    <Table {columns}>
        {#each $usersQuery.data.users as user}
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
                    <!-- <span class={`px-2 py-1 text-xs rounded-full ${user?.roles![0].name === 'Admin' ? 'bg-red-900/30 text-red-300' : user?.roles![0].name === 'Developer' ? 'bg-blue-900/30 text-blue-300' : 'bg-green-900/30 text-green-300'}`}>
                        {user?.roles![0].name}
                        
                    </span> -->
                Role
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
            <p>No users found</p>
        {/each}
    </Table>
{/if}
    <!-- Pagination -->
    <!-- <Pagination totalItems={mockUsers.length} itemsPerPage={5} currentPage={1} /> -->
</div>