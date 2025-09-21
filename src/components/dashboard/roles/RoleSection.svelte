<script lang="ts">
    import { onMount } from 'svelte';

	import {
		Table,
		TableData,
		TableRow,
		type ColumnProp
	}						from "@/components/shared/table";
	import Modal				from "@/components/shared/Modal.svelte";
	import RoleForm				from "./RoleForm.svelte";
	import GroupSection			from "./GroupSection.svelte";
	import TableEmpty			from '@/components/shared/table/TableEmpty.svelte';
	import Action				from "@/components/shared/Action.svelte";

	import type { RolesQuery, PermissionsQuery }	from "@/lib/graphql/roles/types";
	import { PERMISSIONS_QUERY, ROLES_QUERY }	from "@/lib/graphql/roles/queries";
	import { client }			from "@/lib/urql";
	import { queryStore }		from '@urql/svelte';


    const queryParams = {
        page    : 0,
        each    : 10,
        // field   : 'name',
        // orderBy : 'desc',
    };


    const roleResult = queryStore<RolesQuery>({
        client,
        query           : ROLES_QUERY,
        variables       : queryParams,
        requestPolicy   : 'cache-and-network'
        // Usar cache-and-network para cargar desde cache y actualizar en segundo plano
    });


    const permissionResult = queryStore<PermissionsQuery>({
        client,
        query           : PERMISSIONS_QUERY,
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
        { column: 'Updated At' ,    showColumn: true },
        { column: 'Active' ,        showColumn: true },
        { column: 'Actions',        showColumn: true }
    ];

    const columnsPermissions: ColumnProp[] = [
        { column: 'Name',           showColumn: true },
        { column: 'Description',    showColumn: true },
        { column: 'Created At' ,    showColumn: true },
        { column: 'Updated At' ,    showColumn: true },
        { column: 'Active' ,        showColumn: true },
        { column: 'Actions',        showColumn: true }
    ];

    let clicked = $state( 0 );

    // Tab state
    type TabType = 'roles' | 'permissions' | 'overview';
    let activeTab = $state<TabType>('overview');

    // Tab configuration
    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'roles', label: 'Roles', icon: '👥' },
        { id: 'permissions', label: 'Permissions', icon: '🔐' }
    ] as const;
</script>

<div class="animate-fade-in content-stretch h-full">
    <div class="mb-6">
        <h1 class="text-2xl font-orbitron text-white mb-4">Roles & Permissions Management</h1>
        
        <!-- Tab Navigation -->
        <div class="border-b border-neon-blue/20">
            <nav class="flex space-x-8">
                {#each tabs as tab}
                    <button
                        onclick={() => activeTab = tab.id}
                        class="py-2 px-1 border-b-2 font-medium text-sm transition-colors {
                            activeTab === tab.id 
                                ? 'border-neon-blue text-neon-blue' 
                                : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
                        }"
                    >
                        <span class="mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                {/each}
            </nav>
        </div>
    </div>

    <!-- Tab Content -->
    <div class="flex-1">
        {#if activeTab === 'overview'}
            <!-- Overview Tab -->
            <div class="space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Stats Cards -->
                    <div class="bg-dark-blue/30 border border-neon-blue/20 rounded-lg p-6">
                        <div class="flex items-center">
                            <div class="p-3 bg-neon-blue/20 rounded-lg">
                                <span class="text-2xl">👥</span>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-400">Total Roles</p>
                                <p class="text-2xl font-bold text-white">
                                    {$roleResult.data?.roles.length || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-dark-blue/30 border border-neon-blue/20 rounded-lg p-6">
                        <div class="flex items-center">
                            <div class="p-3 bg-neon-blue/20 rounded-lg">
                                <span class="text-2xl">🔐</span>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-400">Total Permissions</p>
                                <p class="text-2xl font-bold text-white">
                                    {$permissionResult.data?.permissions.length || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-dark-blue/30 border border-neon-blue/20 rounded-lg p-6">
                        <div class="flex items-center">
                            <div class="p-3 bg-neon-blue/20 rounded-lg">
                                <span class="text-2xl">✅</span>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-400">Active Items</p>
                                <p class="text-2xl font-bold text-white">
                                    {(($roleResult.data?.roles.filter(r => r.isActive)?.length || 0) + 
                                      ($permissionResult.data?.permissions.filter(p => p.isActive)?.length || 0))}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="bg-dark-blue/30 border border-neon-blue/20 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                    <div class="flex flex-wrap gap-4">
                        <Modal
                            id          = "add-role-overview"
                            title       = "Add Role"
                            buttonText  = "Create New Role"
                        >
                            {#snippet form()}
                                <RoleForm
                                    data        = { {} as any }
                                    isRole      = { true }
                                    clicked     = { 0 }
                                />
                            {/snippet}
                        </Modal>

                        <Modal
                            id          = "add-permission-overview"
                            title       = "Add Permission"
                            buttonText  = "Create New Permission"
                        >
                            {#snippet form()}
                                <RoleForm
                                    data        = { {} as any }
                                    isRole      = { false }
                                    clicked     = { 0 }
                                />
                            {/snippet}
                        </Modal>

                        <a 
                            href="/dashboard/groups" 
                            class="inline-flex items-center px-4 py-2 border border-neon-blue/30 text-neon-blue rounded-md hover:bg-neon-blue/10 transition-colors"
                        >
                            Manage Groups
                        </a>
                    </div>
                </div>

                <!-- Recent Items -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Recent Roles -->
                    <div class="bg-dark-blue/30 border border-neon-blue/20 rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-white mb-4">Recent Roles</h3>
                        {#if $roleResult.data?.roles}
                            <div class="space-y-3">
                                {#each $roleResult.data.roles.slice(0, 5) as role}
                                    <div class="flex items-center justify-between p-3 bg-space-blue/20 rounded-lg">
                                        <div>
                                            <p class="font-medium text-white">{role.name}</p>
                                            <p class="text-sm text-gray-400">{role.description || 'No description'}</p>
                                        </div>
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {
                                            role.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }">
                                            {role.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <p class="text-gray-400">No roles found</p>
                        {/if}
                    </div>

                    <!-- Recent Permissions -->
                    <div class="bg-dark-blue/30 border border-neon-blue/20 rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-white mb-4">Recent Permissions</h3>
                        {#if $permissionResult.data?.permissions}
                            <div class="space-y-3">
                                {#each $permissionResult.data.permissions.slice(0, 5) as permission}
                                    <div class="flex items-center justify-between p-3 bg-space-blue/20 rounded-lg">
                                        <div>
                                            <p class="font-medium text-white">{permission.name}</p>
                                            <p class="text-sm text-gray-400">{permission.description || 'No description'}</p>
                                        </div>
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {
                                            permission.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }">
                                            {permission.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <p class="text-gray-400">No permissions found</p>
                        {/if}
                    </div>
                </div>
            </div>

        {:else if activeTab === 'roles'}
            <!-- Roles Tab -->
            <div>
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-semibold text-white">Roles Management</h2>
                    <div class="flex items-center space-x-4">
                        <div class="relative w-64">
                            <input 
                                type="text" 
                                placeholder="Search roles..." 
                                class="search-input w-full bg-dark-blue/30 border border-neon-blue/30 rounded-md py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue/60" 
                                data-section="roles"
                            >
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </div>
                        </div>

                        <Modal
                            id          = "add-role"
                            title       = "Add Role"
                            buttonText  = "Add Role"
                        >
                            {#snippet form()}
                                <RoleForm
                                    data        = { {} as any }
                                    isRole      = { true }
                                    clicked     = { 0 }
                                />
                            {/snippet}
                        </Modal>
                    </div>
                </div>

                {#if $roleResult.fetching}
                    <p class="text-white">Loading roles...</p>
                {:else if $roleResult.error}
                    <p class="text-red-400">Error: {$roleResult.error.message}</p>
                {:else if $roleResult.data}
                    <Table columns={columns}>
                        {#each $roleResult.data.roles as role}
                            <TableRow>
                                <TableData value={role.name} />
                                <TableData value={role.description} />
                                <TableData value={ role.createdAt } />
                                <TableData value={ role.updatedAt } />
                                <TableData value={ role.isActive } />
                                <TableData size="text-sm font-medium" float={ true }>
                                    <Action
                                        clicked     = { 0 }
                                        titleEdit   = "Edit Role"
                                        isModal     = { true }
                                        onDelete    = { () => console.log( 'Delete role:', role.id ) }
                                        type        = { 'role' }
                                        data        = { role.name || 'role' }
                                    >
                                        {#snippet form()}
                                            <RoleForm
                                                data        = { role }
                                                isRole      = { true }
                                                clicked     = { 0 }
                                            />
                                        {/snippet}
                                    </Action>
                                </TableData>
                            </TableRow>
                        {:else}
                            <TableEmpty
                                columns = { columns.length }
                                data    = "No roles found"
                            />
                        {/each}
                    </Table>
                {/if}
            </div>

        {:else if activeTab === 'permissions'}
            <!-- Permissions Tab -->
            <div>
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-semibold text-white">Permissions Management</h2>
                    <div class="flex items-center space-x-4">
                        <div class="relative w-64">
                            <input 
                                type="text" 
                                placeholder="Search permissions..." 
                                class="search-input w-full bg-dark-blue/30 border border-neon-blue/30 rounded-md py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue/60" 
                                data-section="permissions"
                            >
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </div>
                        </div>

                        <Modal
                            id          = "add-permission"
                            title       = "Add Permission"
                            buttonText  = "Add Permission"
                        >
                            {#snippet form()}
                                <RoleForm
                                    data        = { {} as any }
                                    isRole      = { false }
                                    clicked     = { 0 }
                                />
                            {/snippet}
                        </Modal>
                    </div>
                </div>

                {#if $permissionResult.fetching}
                    <p class="text-white">Loading permissions...</p>
                {:else if $permissionResult.error}
                    <p class="text-red-400">Error: {$permissionResult.error.message}</p>
                {:else if $permissionResult.data}
                    <Table columns={columnsPermissions}>
                        {#each $permissionResult.data.permissions as permission}
                            <TableRow>
                                <TableData value={permission.name} />
                                <TableData value={permission.description} />
                                <TableData value={ permission.createdAt } />
                                <TableData value={ permission.updatedAt } />
                                <TableData value={ permission.isActive } />
                                <TableData size="text-sm font-medium" float={ true }>
                                    <Action
                                        clicked     = { 0 }
                                        titleEdit   = "Edit Permission"
                                        isModal     = { true }
                                        onDelete    = { () => console.log( 'Delete permission:', permission.id ) }
                                        type        = { 'permission' }
                                        data        = { permission.name || 'permission' }
                                    >
                                        {#snippet form()}
                                            <RoleForm
                                                data        = { permission }
                                                isRole      = { false }
                                                clicked     = { 0 }
                                            />
                                        {/snippet}
                                    </Action>
                                </TableData>
                            </TableRow>
                        {:else}
                            <TableEmpty
                                columns = { columnsPermissions.length }
                                data    = "No permissions found"
                            />
                        {/each}
                    </Table>
                {/if}
            </div>
        {/if}
    </div>
</div>
