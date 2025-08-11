<script lang="ts">
    import toast            from 'svelte-french-toast';
    import { queryStore }   from '@urql/svelte';

    import {
        Pagination,
        Table,
        TableData,
        TableRow,
        type ColumnProp
    }                   from "@/components/shared/table";
    import Panel        from "@/components/shared/panel/Panel.svelte";
    import UserForm     from "@/components/dashboard/users/UserForm.svelte";
    import TableEmpty   from '@/components/shared/table/TableEmpty.svelte';
    import Action       from '@/components/shared/Action.svelte';
    import Filter       from "@/components/inputs/Filter.svelte";

    import {
        errorToast,
        successToast
    }                       from '@/config/toast.config';
    import type {
        User,
        UsersAttributesQuery,
        UsersQuery
    }                       from "@/lib/graphql/users/types";
    import {
        DELETE_USER_MUTATION
    }                       from '@/lib/graphql/users/mutations';

    import {
        USER_ATTRIBUTES_QUERY,
        USERS_QUERY
    }                       from "@/lib/graphql/users/queries";
    import { client }       from "@/lib/urql";

    let currentPage     = $state( 1 );
    let itemsPerPage    = $state( 10 );
    let deletedUserIds  = $state<string[]>( [] );
    let searchTerm      = $state( "" );

    const userAttributesResult = queryStore<UsersAttributesQuery>({
        client,
        query           : USER_ATTRIBUTES_QUERY,
        variables       : {},
        requestPolicy   : 'cache-and-network'
    });


    const usersResult = queryStore<UsersQuery>({
        client,
        query           : USERS_QUERY,
        requestPolicy   : 'cache-and-network',
        variables       : {
            orderBy: 'asc',
        },
    });


    const allUsers = $derived(( $usersResult.data?.users || [] ).filter( user => {
        if ( deletedUserIds.includes( user.id )) return false;

        if ( !searchTerm.trim() ) return true;

        const searchLower = searchTerm.toLowerCase();

        return (
            user.email?.toLowerCase().includes( searchLower ) ||
            user.name?.toLowerCase().includes( searchLower ) ||
            user.nickname?.toLowerCase().includes( searchLower ) ||
            user.phone?.toLowerCase().includes( searchLower )
        );
    }));


    const paginatedUsers = $derived((() => {
        const startIndex    = ( currentPage - 1 ) * itemsPerPage;
        const endIndex      = startIndex + itemsPerPage;
        return allUsers.slice( startIndex, endIndex );
    })());


    const totalUsers = $derived( allUsers.length );


    function refetchUsers(): void {
        usersResult.reexecute({ requestPolicy: 'network-only' });
        deletedUserIds = [];
    }


    const userAttributes = $derived( $userAttributesResult.data?.userAttributes );


    const columns = $derived((() => {
        const baseColumns: ColumnProp[] = [
            { column: 'Avatar',     showColumn: true },
            { column: 'Email',      showColumn: true },
            { column: 'Name',       showColumn: true },
            { column: 'Nickname',   showColumn: true },
            { column: 'Birthday',   showColumn: true },
            { column: 'Phone',      showColumn: true },
            { column: 'Active',     showColumn: true },
            { column: 'Verified',   showColumn: true },
            { column: 'Role',       showColumn: true },
            // { column: 'Last Login', showColumn: true },
            { column: 'Actions',    showColumn: true },
        ];

        if (( userAttributes?.length ?? 0 ) > 0 ) {
            baseColumns.pop();

            userAttributes!.forEach( attribute => {
                baseColumns.push({ column: attribute.key, showColumn: true });
            });

            baseColumns.push({ column: 'Actions', showColumn: true });
        }

        return baseColumns;
    })());


    let clicked = $state( 0 );


    async function handleDeleteUser( id: string ): Promise<void> {
        const { data, error } = await client.mutation(
            DELETE_USER_MUTATION,
            { removeUserId: id }
        ).toPromise();

        if ( error ) {
            console.error( 'Error deleting user:', error );
            toast.error( 'Error deleting user', errorToast() );
            return;
        }

        if ( data ) {
            console.log( 'User deleted successfully:', id, data );
            toast.success( 'User deleted successfully', successToast() );
            deletedUserIds = [...deletedUserIds, id];
        }
    }


    function handlePageChange( page: number ): void {
        currentPage = page;
    }


    function handlePerPageChange( perPage: number ): void {
        itemsPerPage = perPage;
        currentPage = 1;
    }

    function handleSearchChange( value: string ): void {
        searchTerm = value;
        currentPage = 1;
    }
</script>

<div class="animate-fade-in">
    <h1 class="text-2xl font-orbitron text-white mb-6">Users</h1>

    <div class="flex justify-between items-center mb-4 gap-2 sm:gap-4">
        <Filter 
            placeholder="Search users"
            name="userSearch"
            bind:value={searchTerm}
            onChange={handleSearchChange}
        />

        <Panel
            title           = "Add User"
            buttonText      = "Add User"
            isEdit          = { false }
            buttonClass     = "fixed sm:static sm:flex bottom-16 sm:bottom-auto right-4 sm:right-auto bg-neon-blue text-dark-blue rounded-full sm:rounded-lg px-2.5 sm:px-4 sm:py-2 hover:bg-opacity-80 transition-colors duration-300 sm:items-center "
            bind:clicked    = { clicked }
        >
            <UserForm
                bind:clicked    = { clicked }
                user            = { {} as User }
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
                class   = "mt-2 px-3 py-1 bg-red-700/50 hover:bg-red-700/70 rounded-md text-sm"
                onclick = { refetchUsers }
            >
                Retry
            </button>
        </div>
    {:else if $usersResult.data}
        <div class="grid space-y-4">
            <Table columns={columns}>
                {#each paginatedUsers as user}
                    <TableRow>
                        <TableData value={ user.avatar } isImg={ true } />

                        <TableData value={ user.email } />

                        <TableData value={ user.name } />

                        <TableData value={ user.nickname } />

                        <TableData value={ user.birthdate } isDate={ true } />

                        <TableData value={ user.phone } />

                        <TableData value={ user.isActive } />

                        <TableData value={ user.isVerified } />

                        <!-- Role column -->
                        <TableData>
                            {#if user?.roles && user.roles.length > 0}
                                <span class={`px-2 py-1 text-xs rounded-full ${user.roles[0].name === 'Admin' ? 'bg-red-900/30 text-red-300' : user.roles[0].name === 'Developer' ? 'bg-blue-900/30 text-blue-300' : 'bg-green-900/30 text-green-300'}`}>
                                    {user.roles[0].name}
                                </span>
                            {:else}
                                <span class="text-gray-400">-</span>
                            {/if}
                        </TableData>

                        <!-- Dynamic attribute columns -->
                        {#if userAttributes} 
                            {#each userAttributes as attribute}
                                <TableData value={ user.attributes?.find( attr => attr.key === attribute.key )?.value ?? null } />
                            {/each}
                        {/if}

                        <!-- Actions column (siempre al final) -->
                        <TableData size="text-sm font-medium" float={ true }>
                            <Action
                                { clicked }
                                titleEdit    = "Edit User"
                                onDelete     = { () => handleDeleteUser( user.id )}
                                type         = { 'the user' }
                                data         = { user.email }
                            >
                                {#snippet form()}
                                    <UserForm
                                        bind:clicked={ clicked }
                                        { user }
                                    />
                                {/snippet}
                            </Action>
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
                count           = { totalUsers }
                currentPage     = { currentPage }
                perPage         = { itemsPerPage }
                onPageChange    = { handlePageChange }
                onPerPageChange = { handlePerPageChange }
            />
        </div>
    {:else}
        <div class="bg-dark-blue/50 p-8 rounded-lg text-center">
            <p class="text-white">No users found</p>
        </div>
    {/if}
</div>
