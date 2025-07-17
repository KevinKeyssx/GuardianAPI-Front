<script lang="ts">
    import { onMount } from 'svelte';

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
    // import Filter from "@/components/inputs/Filter.svelte";

    import type { Client as UrqlClient } from '@urql/svelte';

    import type { CreateUserInput, UpdateUserInput, User, UsersQuery }    from "@/lib/graphql/users/types";
    import { USERS_QUERY }              from "@/lib/graphql/users/queries";
    import { client }                   from "@/lib/urql";
    import { mutationStore, queryStore }               from '@urql/svelte';
    import { CREATE_USER_MUTATION, DELETE_USER_MUTATION, UPDATE_USER_MUTATION } from '@/lib/graphql/users/mutations';

    const queryParams = {
        page    : 0,
        each    : 10,
        field   : 'createdAt',
        orderBy : 'desc',
        keys    : [],
    };

    const usersResult = queryStore<UsersQuery>({
        client,
        query           : USERS_QUERY,
        variables       : queryParams,
        requestPolicy   : 'cache-and-network'
        // Usar cache-and-network para cargar desde cache y actualizar en segundo plano
    });

    function refetchUsers() {
        usersResult.reexecute({ requestPolicy: 'network-only' });
    }

    let refreshInterval: ReturnType<typeof setInterval> | undefined;

    function startRefreshInterval(intervalMs = 1000 * 60 * 30) { // 30 minutos por defecto
        if ( refreshInterval ) clearInterval( refreshInterval );

        refreshInterval = setInterval(() => {
            console.log('Actualizando datos de usuarios...');
            refetchUsers();
        }, intervalMs );
    }


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


    let clicked = $state(0);

    async function onCreateUser( input: CreateUserInput, file: File | null ): Promise<void> {
        const createInput: CreateUserInput = input as CreateUserInput;
        console.log('Attempting to create user:', createInput, 'with file:', file);

        const { data, error } = await client.mutation(
            CREATE_USER_MUTATION, {
                createUserInput: createInput,
                file
            }
        ).toPromise();

        if ( error ) {
            console.error('Error creating user:', error);
            alert(`Error creating user: ${error.message}`);
            return;
        }

        if ( data ) {
            console.log('User created successfully:', data.createUser);
            clicked++;
        }
    }


    async function onUpdateUser(  input: UpdateUserInput, file: File | null ): Promise<void> {
        console.log('Attempting to update user:', input, 'with file:', file);

        const { data, error } = await client.mutation(
            UPDATE_USER_MUTATION, {
                updateUserInput: input,
                file
            }
        ).toPromise();

        if ( error ) {
            console.error('Error updating user:', error);
            alert(`Error updating user: ${error.message}`);
            return;
        }

        if ( data ) {
            console.log('User updated successfully:', data.updateUser);
            alert('User updated successfully!');
            // refetchUsers();
            clicked++;
        }
    }


    async function handleUserSubmit( input: CreateUserInput | UpdateUserInput, file: File | null ) {
        if ( input.id ) {
            await onUpdateUser( input as UpdateUserInput, file );
        } else {
            await onCreateUser( input as CreateUserInput, file );
        }
    }

    // Para la eliminación
    async function handleDeleteUser(id: string) {
        console.log("🚀 ~ file: UserSection.svelte:142 ~ id:", id)

        if ( confirm( 'Are you sure you want to delete this user?' )) {
            const { data, error } = await client.mutation(
                DELETE_USER_MUTATION,
                { removeUserId: id }
            ).toPromise();

            if ( error ) {
                console.error('Error deleting user:', error);
                // alert(`Error deleting user: ${error.message}`);
                return;
            }

            if ( data ) {
                console.log('User deleted successfully:', id);
                // alert('User deleted successfully!');
                // refetchUsers();
            }
        }
    }
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
                bind:clicked    = { clicked }
                user            = { {} as User }
                onSubmit        = { handleUserSubmit }
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
                    <TableData value={ user.avatar } isImg={ true } />

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

                    <!-- <TableData value={user.lastLogin} /> -->

                    <TableData size="text-sm font-medium" float={ true }>
                        <div class="flex gap-2 items-center">
                            <Panel
                                bind:clicked={ clicked }
                                title       = "Edit User"
                                buttonText  = ""
                                buttonClass = ""
                                isEdit      = { true }
                            >
                                <UserForm
                                    bind:clicked    = { clicked }
                                    onSubmit        = { handleUserSubmit }
                                    { user }
                                />
                            </Panel>

                            <button class="px-3 py-1 bg-red-700/50 hover:bg-red-700/70 rounded-md text-sm text-white"
                                onclick={() => handleDeleteUser(user.id)}
                            >
                                <!-- Delete -->
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="24" stroke-dashoffset="24" d="M12 20h5c0.5 0 1 -0.5 1 -1v-14M12 20h-5c-0.5 0 -1 -0.5 -1 -1v-14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0"/></path><path stroke-dasharray="20" stroke-dashoffset="20" d="M4 5h16"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.2s" values="20;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M10 4h4M10 9v7M14 9v7"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="8;0"/></path></g></svg>
                            </button>
                        </div>
                    </TableData>
                </TableRow>
            {:else}
                <TableEmpty
                    columns = { columns.length }
                    data    = "No users found"
                />
            {/each}
        </Table>

        <!-- <Pagination
            totalItems      = { 10 }
            itemsPerPage    = { queryParams.each }
            currentPage     = { queryParams.page + 1 }
        /> -->
    {:else}
        <div class="bg-dark-blue/50 p-8 rounded-lg text-center">
            <p class="text-white">No users found</p>
        </div>
    {/if}
</div>
