<script lang="ts">
	import toast from 'svelte-french-toast';
	import { queryStore } from '@urql/svelte';
	import { client } from '@/lib/urql';
	import { ROLES_QUERY, PERMISSIONS_QUERY } from '@/lib/graphql/roles/queries';
	import type { RolesQuery, PermissionsQuery, Role, Permission, Group } from '@/lib/graphql/roles/types';
	import { errorToast, successToast } from '@/config/toast.config';

	// Selected elements to assign (multiple selection)
	let selectedRoleIds = $state<Set<string>>( new Set() );
	let selectedPermissionIds = $state<Set<string>>( new Set() );
	let selectedGroupIds = $state<Set<string>>( new Set() );
	let selectedUserIds = $state<Set<string>>( new Set() );

	// Search terms for each column
	let roleSearchTerm = $state( '' );
	let permissionSearchTerm = $state( '' );
	let groupSearchTerm = $state( '' );
	let userSearchTerm = $state( '' );

	// Mock users data - replace with actual user query
	const availableUsers = [
		{ id: '1', name: 'John Doe', email: 'john@example.com', avatar: null },
		{ id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: null },
		{ id: '3', name: 'Bob Johnson', email: 'bob@example.com', avatar: null },
		{ id: '4', name: 'Alice Brown', email: 'alice@example.com', avatar: null },
		{ id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', avatar: null },
		{ id: '6', name: 'Diana Martinez', email: 'diana@example.com', avatar: null },
	];

	// Query roles
	const rolesResult = queryStore<RolesQuery>({
		client,
		query           : ROLES_QUERY,
		variables       : { page: 0, each: 100 },
		requestPolicy   : 'cache-and-network'
	});

	// Query permissions
	const permissionsResult = queryStore<PermissionsQuery>({
		client,
		query           : PERMISSIONS_QUERY,
		variables       : { page: 0, each: 100 },
		requestPolicy   : 'cache-and-network'
	});

	// Mock groups - replace with actual query
	const mockGroups: Group[] = [
		{ id: '1', name: 'Admin Group', description: 'Administrator access', isActive: true },
		{ id: '2', name: 'User Group', description: 'Standard user access', isActive: true },
		{ id: '3', name: 'Guest Group', description: 'Limited access', isActive: true },
	];

	// Filtered lists
	let filteredRoles = $derived(
		( $rolesResult.data?.roles || [] ).filter( role => 
			role.name?.toLowerCase().includes( roleSearchTerm.toLowerCase() ) ||
			role.description?.toLowerCase().includes( roleSearchTerm.toLowerCase() )
		)
	);

	let filteredPermissions = $derived(
		( $permissionsResult.data?.permissions || [] ).filter( permission => 
			permission.name?.toLowerCase().includes( permissionSearchTerm.toLowerCase() ) ||
			permission.description?.toLowerCase().includes( permissionSearchTerm.toLowerCase() )
		)
	);

	let filteredGroups = $derived(
		mockGroups.filter( group => 
			group.name?.toLowerCase().includes( groupSearchTerm.toLowerCase() ) ||
			group.description?.toLowerCase().includes( groupSearchTerm.toLowerCase() )
		)
	);

	let filteredUsers = $derived(
		availableUsers.filter( user => 
			user.name.toLowerCase().includes( userSearchTerm.toLowerCase() ) ||
			user.email.toLowerCase().includes( userSearchTerm.toLowerCase() )
		)
	);

	// Get all selected elements for preview
	let allSelectedElements = $derived( () => {
		const selected: Array<{ type: string; element: Role | Permission | Group }> = [];
		
		selectedRoleIds.forEach( id => {
			const role = $rolesResult.data?.roles.find( r => r.id === id );
			if ( role ) selected.push({ type: 'role', element: role });
		});
		
		selectedPermissionIds.forEach( id => {
			const permission = $permissionsResult.data?.permissions.find( p => p.id === id );
			if ( permission ) selected.push({ type: 'permission', element: permission });
		});
		
		selectedGroupIds.forEach( id => {
			const group = mockGroups.find( g => g.id === id );
			if ( group ) selected.push({ type: 'group', element: group });
		});
		
		return selected;
	});

	// Total count of selected elements
	let totalSelectedElements = $derived(
		selectedRoleIds.size + selectedPermissionIds.size + selectedGroupIds.size
	);

	// Toggle functions for each type
	function toggleRole( roleId: string ) {
		if ( selectedRoleIds.has( roleId ) ) {
			selectedRoleIds.delete( roleId );
		} else {
			selectedRoleIds.add( roleId );
		}
		selectedRoleIds = new Set( selectedRoleIds );
	}

	function togglePermission( permissionId: string ) {
		if ( selectedPermissionIds.has( permissionId ) ) {
			selectedPermissionIds.delete( permissionId );
		} else {
			selectedPermissionIds.add( permissionId );
		}
		selectedPermissionIds = new Set( selectedPermissionIds );
	}

	function toggleGroup( groupId: string ) {
		if ( selectedGroupIds.has( groupId ) ) {
			selectedGroupIds.delete( groupId );
		} else {
			selectedGroupIds.add( groupId );
		}
		selectedGroupIds = new Set( selectedGroupIds );
	}

	function toggleUser( userId: string ) {
		if ( selectedUserIds.has( userId ) ) {
			selectedUserIds.delete( userId );
		} else {
			selectedUserIds.add( userId );
		}
		selectedUserIds = new Set( selectedUserIds );
	}

	// Toggle all functions
	function toggleAllRoles() {
		if ( selectedRoleIds.size === filteredRoles.length && filteredRoles.length > 0 ) {
			// Deselect all
			filteredRoles.forEach( role => role.id && selectedRoleIds.delete( role.id ) );
		} else {
			// Select all
			filteredRoles.forEach( role => role.id && selectedRoleIds.add( role.id ) );
		}
		selectedRoleIds = new Set( selectedRoleIds );
	}

	function toggleAllPermissions() {
		if ( selectedPermissionIds.size === filteredPermissions.length && filteredPermissions.length > 0 ) {
			// Deselect all
			filteredPermissions.forEach( perm => perm.id && selectedPermissionIds.delete( perm.id ) );
		} else {
			// Select all
			filteredPermissions.forEach( perm => perm.id && selectedPermissionIds.add( perm.id ) );
		}
		selectedPermissionIds = new Set( selectedPermissionIds );
	}

	function toggleAllGroups() {
		if ( selectedGroupIds.size === filteredGroups.length && filteredGroups.length > 0 ) {
			// Deselect all
			filteredGroups.forEach( group => group.id && selectedGroupIds.delete( group.id ) );
		} else {
			// Select all
			filteredGroups.forEach( group => group.id && selectedGroupIds.add( group.id ) );
		}
		selectedGroupIds = new Set( selectedGroupIds );
	}

	function toggleAllUsers() {
		if ( selectedUserIds.size === filteredUsers.length && filteredUsers.length > 0 ) {
			// Deselect all
			filteredUsers.forEach( user => selectedUserIds.delete( user.id ) );
		} else {
			// Select all
			filteredUsers.forEach( user => selectedUserIds.add( user.id ) );
		}
		selectedUserIds = new Set( selectedUserIds );
	}

	// Handle assignment submission
	async function handleSubmit() {
		if ( totalSelectedElements === 0 ) {
			toast.error( 'Please select at least one role, permission, or group to assign', errorToast() );
			return;
		}

		if ( selectedUserIds.size === 0 ) {
			toast.error( 'Please select at least one user', errorToast() );
			return;
		}

		try {
			// TODO: Implement actual mutation when GraphQL is ready
			console.log( 'Mass assignment data:', {
				roles           : Array.from( selectedRoleIds ),
				permissions     : Array.from( selectedPermissionIds ),
				groups          : Array.from( selectedGroupIds ),
				userIds         : Array.from( selectedUserIds ),
				users           : availableUsers.filter( u => selectedUserIds.has( u.id ) )
			});

			toast.success(
				`Successfully assigned ${totalSelectedElements} item(s) to ${selectedUserIds.size} user(s)`,
				successToast()
			);

			// Reset form
			selectedRoleIds.clear();
			selectedPermissionIds.clear();
			selectedGroupIds.clear();
			selectedUserIds.clear();
			
			selectedRoleIds = new Set( selectedRoleIds );
			selectedPermissionIds = new Set( selectedPermissionIds );
			selectedGroupIds = new Set( selectedGroupIds );
			selectedUserIds = new Set( selectedUserIds );
			
			roleSearchTerm = '';
			permissionSearchTerm = '';
			groupSearchTerm = '';
			userSearchTerm = '';

		} catch ( error ) {
			toast.error( 'An error occurred while assigning', errorToast() );
		}
	}
</script>

<!-- 4 Column Grid Layout -->
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
		<!-- Column 1: Roles -->
		<div class="bg-dark-blue/30 border border-neon-blue/20 rounded-lg p-4 space-y-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-2">
					<span class="text-2xl">👥</span>
					<h3 class="text-lg font-semibold text-white">Roles</h3>
					{#if selectedRoleIds.size > 0}
						<span class="text-xs bg-neon-blue text-dark-blue px-2 py-0.5 rounded-full font-medium">
							{selectedRoleIds.size}
						</span>
					{/if}
				</div>
				<button
					type="button"
					onclick={toggleAllRoles}
					class="text-xs px-2 py-1 bg-neon-blue/20 text-neon-blue rounded hover:bg-neon-blue/30 transition-colors"
					title={selectedRoleIds.size === filteredRoles.length && filteredRoles.length > 0 ? 'Deselect All' : 'Select All'}
				>
					{selectedRoleIds.size === filteredRoles.length && filteredRoles.length > 0 ? '✓ All' : 'Select'}
				</button>
			</div>

			<!-- Search -->
			<div class="relative">
				<input
					bind:value={roleSearchTerm}
					type="text"
					placeholder="Search roles..."
					class="w-full bg-dark-blue/30 border border-neon-blue/30 rounded-md py-2 pl-8 pr-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue/60"
				>
				<div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="11" cy="11" r="8"></circle>
						<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
					</svg>
				</div>
			</div>

			<!-- List -->
			<div class="space-y-2 max-h-[500px] overflow-y-auto">
				{#if $rolesResult.fetching}
					<p class="text-gray-400 text-sm text-center py-4">Loading...</p>
				{:else}
					{#each filteredRoles as role}
						<div class="flex items-center justify-between p-2 bg-dark-blue/50 border border-neon-blue/20 rounded hover:bg-dark-blue/70 transition-colors">
							<div class="flex-1 min-w-0 pr-2">
								<p class="font-medium text-white text-sm truncate">{role.name}</p>
								{#if role.description}
									<p class="text-xs text-gray-400 truncate">{role.description}</p>
								{/if}
							</div>
							<label class="relative inline-flex items-center cursor-pointer flex-shrink-0">
								<input
									type="checkbox"
									checked={role.id ? selectedRoleIds.has( role.id ) : false}
									onchange={() => role.id && toggleRole( role.id )}
									class="sr-only peer"
								>
								<div class="w-9 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-neon-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neon-blue"></div>
							</label>
						</div>
					{:else}
						<p class="text-gray-400 text-sm text-center py-4">
							{roleSearchTerm ? 'No roles found' : 'No roles available'}
						</p>
					{/each}
				{/if}
			</div>
		</div>

		<!-- Column 2: Permissions -->
		<div class="bg-dark-blue/30 border border-neon-blue/20 rounded-lg p-4 space-y-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-2">
					<span class="text-2xl">🔐</span>
					<h3 class="text-lg font-semibold text-white">Permissions</h3>
					{#if selectedPermissionIds.size > 0}
						<span class="text-xs bg-neon-blue text-dark-blue px-2 py-0.5 rounded-full font-medium">
							{selectedPermissionIds.size}
						</span>
					{/if}
				</div>
				<button
					type="button"
					onclick={toggleAllPermissions}
					class="text-xs px-2 py-1 bg-neon-blue/20 text-neon-blue rounded hover:bg-neon-blue/30 transition-colors"
					title={selectedPermissionIds.size === filteredPermissions.length && filteredPermissions.length > 0 ? 'Deselect All' : 'Select All'}
				>
					{selectedPermissionIds.size === filteredPermissions.length && filteredPermissions.length > 0 ? '✓ All' : 'Select'}
				</button>
			</div>

			<!-- Search -->
			<div class="relative">
				<input
					bind:value={permissionSearchTerm}
					type="text"
					placeholder="Search permissions..."
					class="w-full bg-dark-blue/30 border border-neon-blue/30 rounded-md py-2 pl-8 pr-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue/60"
				>
				<div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="11" cy="11" r="8"></circle>
						<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
					</svg>
				</div>
			</div>

			<!-- List -->
			<div class="space-y-2 max-h-[500px] overflow-y-auto">
				{#if $permissionsResult.fetching}
					<p class="text-gray-400 text-sm text-center py-4">Loading...</p>
				{:else}
					{#each filteredPermissions as permission}
						<div class="flex items-center justify-between p-2 bg-dark-blue/50 border border-neon-blue/20 rounded hover:bg-dark-blue/70 transition-colors">
							<div class="flex-1 min-w-0 pr-2">
								<p class="font-medium text-white text-sm truncate">{permission.name}</p>
								{#if permission.description}
									<p class="text-xs text-gray-400 truncate">{permission.description}</p>
								{/if}
							</div>
							<label class="relative inline-flex items-center cursor-pointer flex-shrink-0">
								<input
									type="checkbox"
									checked={permission.id ? selectedPermissionIds.has( permission.id ) : false}
									onchange={() => permission.id && togglePermission( permission.id )}
									class="sr-only peer"
								>
								<div class="w-9 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-neon-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neon-blue"></div>
							</label>
						</div>
					{:else}
						<p class="text-gray-400 text-sm text-center py-4">
							{permissionSearchTerm ? 'No permissions found' : 'No permissions available'}
						</p>
					{/each}
				{/if}
			</div>
		</div>

		<!-- Column 3: Groups -->
		<div class="bg-dark-blue/30 border border-neon-blue/20 rounded-lg p-4 space-y-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-2">
					<span class="text-2xl">📦</span>
					<h3 class="text-lg font-semibold text-white">Groups</h3>
					{#if selectedGroupIds.size > 0}
						<span class="text-xs bg-neon-blue text-dark-blue px-2 py-0.5 rounded-full font-medium">
							{selectedGroupIds.size}
						</span>
					{/if}
				</div>
				<button
					type="button"
					onclick={toggleAllGroups}
					class="text-xs px-2 py-1 bg-neon-blue/20 text-neon-blue rounded hover:bg-neon-blue/30 transition-colors"
					title={selectedGroupIds.size === filteredGroups.length && filteredGroups.length > 0 ? 'Deselect All' : 'Select All'}
				>
					{selectedGroupIds.size === filteredGroups.length && filteredGroups.length > 0 ? '✓ All' : 'Select'}
				</button>
			</div>

			<!-- Search -->
			<div class="relative">
				<input
					bind:value={groupSearchTerm}
					type="text"
					placeholder="Search groups..."
					class="w-full bg-dark-blue/30 border border-neon-blue/30 rounded-md py-2 pl-8 pr-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue/60"
				>
				<div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="11" cy="11" r="8"></circle>
						<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
					</svg>
				</div>
			</div>

			<!-- List -->
			<div class="space-y-2 max-h-[500px] overflow-y-auto">
				{#each filteredGroups as group}
					<div class="flex items-center justify-between p-2 bg-dark-blue/50 border border-neon-blue/20 rounded hover:bg-dark-blue/70 transition-colors">
						<div class="flex-1 min-w-0 pr-2">
							<p class="font-medium text-white text-sm truncate">{group.name}</p>
							{#if group.description}
								<p class="text-xs text-gray-400 truncate">{group.description}</p>
							{/if}
						</div>
						<label class="relative inline-flex items-center cursor-pointer flex-shrink-0">
							<input
								type="checkbox"
								checked={group.id ? selectedGroupIds.has( group.id ) : false}
								onchange={() => group.id && toggleGroup( group.id )}
								class="sr-only peer"
							>
							<div class="w-9 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-neon-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neon-blue"></div>
						</label>
					</div>
				{:else}
					<p class="text-gray-400 text-sm text-center py-4">
						{groupSearchTerm ? 'No groups found' : 'No groups available'}
					</p>
				{/each}
			</div>
		</div>

		<!-- Column 4: Users -->
		<div class="bg-dark-blue/30 border border-neon-blue/20 rounded-lg p-4 space-y-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-2">
					<span class="text-2xl">👤</span>
					<h3 class="text-lg font-semibold text-white">Users</h3>
					{#if selectedUserIds.size > 0}
						<span class="text-xs bg-neon-blue text-dark-blue px-2 py-0.5 rounded-full font-medium">
							{selectedUserIds.size}
						</span>
					{/if}
				</div>
				<button
					type="button"
					onclick={toggleAllUsers}
					class="text-xs px-2 py-1 bg-neon-blue/20 text-neon-blue rounded hover:bg-neon-blue/30 transition-colors"
					title={selectedUserIds.size === filteredUsers.length && filteredUsers.length > 0 ? 'Deselect All' : 'Select All'}
				>
					{selectedUserIds.size === filteredUsers.length && filteredUsers.length > 0 ? '✓ All' : 'Select'}
				</button>
			</div>

			<!-- Search -->
			<div class="relative">
				<input
					bind:value={userSearchTerm}
					type="text"
					placeholder="Search users..."
					class="w-full bg-dark-blue/30 border border-neon-blue/30 rounded-md py-2 pl-8 pr-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue/60"
				>
				<div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="11" cy="11" r="8"></circle>
						<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
					</svg>
				</div>
			</div>

			<!-- List -->
			<div class="space-y-2 max-h-[500px] overflow-y-auto">
				{#each filteredUsers as user}
					<div class="flex items-center justify-between p-2 bg-dark-blue/50 border border-neon-blue/20 rounded hover:bg-dark-blue/70 transition-colors">
						<div class="flex items-center space-x-2 flex-1 min-w-0">
							{#if user.avatar}
								<img src={user.avatar} alt={user.name} class="w-8 h-8 rounded-full flex-shrink-0">
							{:else}
								<div class="w-8 h-8 bg-neon-blue/20 rounded-full flex items-center justify-center flex-shrink-0">
									<span class="text-neon-blue font-medium text-xs">
										{user.name.charAt( 0 ).toUpperCase()}
									</span>
								</div>
							{/if}
							<div class="flex-1 min-w-0">
								<p class="font-medium text-white text-sm truncate">{user.name}</p>
								<p class="text-xs text-gray-400 truncate">{user.email}</p>
							</div>
						</div>
						<label class="relative inline-flex items-center cursor-pointer flex-shrink-0">
							<input
								type="checkbox"
								checked={selectedUserIds.has( user.id )}
								onchange={() => toggleUser( user.id )}
								class="sr-only peer"
							>
							<div class="w-9 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-neon-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neon-blue"></div>
						</label>
					</div>
				{:else}
					<p class="text-gray-400 text-sm text-center py-4">
						{userSearchTerm ? 'No users found' : 'No users available'}
					</p>
				{/each}
			</div>
		</div>
</div>

<!-- Assignment Preview & Submit -->
{#if totalSelectedElements > 0 && selectedUserIds.size > 0}
		<div class="bg-dark-blue/30 border border-neon-blue/20 rounded-lg p-6 space-y-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-2">
					<span class="text-neon-blue text-xl">✓</span>
					<p class="text-sm text-white">
						Ready to assign <strong>{totalSelectedElements}</strong> item(s) to <strong>{selectedUserIds.size}</strong> user(s)
					</p>
				</div>
				<button
					type="button"
					onclick={handleSubmit}
					class="px-6 py-2 bg-neon-blue text-dark-blue font-medium rounded-md hover:bg-neon-blue/80 transition-colors"
				>
					Assign Now
				</button>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<!-- Selected Items -->
				<div class="space-y-2">
					<p class="text-xs font-medium text-gray-400 uppercase">Selected Items ({totalSelectedElements}):</p>
					<div class="flex flex-wrap gap-2">
						{#each allSelectedElements().slice( 0, 10 ) as item}
							<span class="inline-flex items-center px-2 py-1 bg-space-blue/50 border border-neon-blue/20 rounded text-xs text-gray-300">
								{item.type === 'role' ? '👥' : item.type === 'permission' ? '🔐' : '📦'}
								{item.element.name}
							</span>
						{/each}
						{#if totalSelectedElements > 10}
							<span class="inline-flex items-center px-2 py-1 bg-space-blue/50 border border-neon-blue/20 rounded text-xs text-gray-400">
								+{totalSelectedElements - 10} more
							</span>
						{/if}
					</div>
				</div>

				<!-- Selected Users -->
				<div class="space-y-2">
					<p class="text-xs font-medium text-gray-400 uppercase">Selected Users ({selectedUserIds.size}):</p>
					<div class="flex flex-wrap gap-2">
						{#each Array.from( selectedUserIds ).slice( 0, 10 ) as userId}
							{@const user = availableUsers.find( u => u.id === userId )}
							{#if user}
								<span class="inline-flex items-center px-2 py-1 bg-space-blue/50 border border-neon-blue/20 rounded text-xs text-gray-300">
									{user.name}
								</span>
							{/if}
						{/each}
						{#if selectedUserIds.size > 10}
							<span class="inline-flex items-center px-2 py-1 bg-space-blue/50 border border-neon-blue/20 rounded text-xs text-gray-400">
								+{selectedUserIds.size - 10} more
							</span>
						{/if}
					</div>
				</div>
			</div>
		</div>
{/if}
