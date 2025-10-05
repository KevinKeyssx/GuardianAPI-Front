<script lang="ts">
	import toast from 'svelte-french-toast';
	import { queryStore } from '@urql/svelte';
	import { client } from '@/lib/urql';
	import { ROLES_QUERY, PERMISSIONS_QUERY } from '@/lib/graphql/roles/queries';
	import type { RolesQuery, PermissionsQuery, Role, Permission, Group } from '@/lib/graphql/roles/types';
	import { errorToast, successToast } from '@/config/toast.config';

	// Assignment type selector
	type AssignmentType = 'role' | 'permission' | 'group';
	let assignmentType = $state<AssignmentType>( 'role' );

	// Selected elements to assign (multiple selection)
	let selectedRoleIds = $state<Set<string>>( new Set() );
	let selectedPermissionIds = $state<Set<string>>( new Set() );
	let selectedGroupIds = $state<Set<string>>( new Set() );

	// Search terms
	let elementSearchTerm = $state( '' );
	let userSearchTerm = $state( '' );

	// Selected users
	let selectedUserIds = $state<Set<string>>( new Set() );

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

	// Get available elements based on assignment type
	let availableElements = $derived( () => {
		if ( assignmentType === 'role' ) {
			return $rolesResult.data?.roles || [];
		} else if ( assignmentType === 'permission' ) {
			return $permissionsResult.data?.permissions || [];
		} else {
			return mockGroups;
		}
	});

	// Get current selected IDs based on type
	let currentSelectedIds = $derived( () => {
		if ( assignmentType === 'role' ) return selectedRoleIds;
		if ( assignmentType === 'permission' ) return selectedPermissionIds;
		return selectedGroupIds;
	});

	// Filter elements by search term
	let filteredElements = $derived(
		availableElements().filter( element => 
			element.name?.toLowerCase().includes( elementSearchTerm.toLowerCase() ) ||
			element.description?.toLowerCase().includes( elementSearchTerm.toLowerCase() )
		)
	);

	// Filter users by search term
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

	// Toggle element selection
	function toggleElementSelection( elementId: string ) {
		const currentSet = currentSelectedIds();
		if ( currentSet.has( elementId ) ) {
			currentSet.delete( elementId );
		} else {
			currentSet.add( elementId );
		}
		
		// Trigger reactivity
		if ( assignmentType === 'role' ) {
			selectedRoleIds = new Set( selectedRoleIds );
		} else if ( assignmentType === 'permission' ) {
			selectedPermissionIds = new Set( selectedPermissionIds );
		} else {
			selectedGroupIds = new Set( selectedGroupIds );
		}
	}

	// Select all filtered elements
	function selectAllElements() {
		filteredElements.forEach( element => {
			if ( element.id ) currentSelectedIds().add( element.id );
		});
		
		// Trigger reactivity
		if ( assignmentType === 'role' ) {
			selectedRoleIds = new Set( selectedRoleIds );
		} else if ( assignmentType === 'permission' ) {
			selectedPermissionIds = new Set( selectedPermissionIds );
		} else {
			selectedGroupIds = new Set( selectedGroupIds );
		}
	}

	// Deselect all elements of current type
	function deselectAllElements() {
		currentSelectedIds().clear();
		
		// Trigger reactivity
		if ( assignmentType === 'role' ) {
			selectedRoleIds = new Set( selectedRoleIds );
		} else if ( assignmentType === 'permission' ) {
			selectedPermissionIds = new Set( selectedPermissionIds );
		} else {
			selectedGroupIds = new Set( selectedGroupIds );
		}
	}

	// Toggle user selection
	function toggleUserSelection( userId: string ) {
		if ( selectedUserIds.has( userId ) ) {
			selectedUserIds.delete( userId );
		} else {
			selectedUserIds.add( userId );
		}
		selectedUserIds = new Set( selectedUserIds );
	}

	// Select all filtered users
	function selectAllUsers() {
		filteredUsers.forEach( user => selectedUserIds.add( user.id ) );
		selectedUserIds = new Set( selectedUserIds );
	}

	// Deselect all users
	function deselectAllUsers() {
		selectedUserIds.clear();
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
			
			elementSearchTerm = '';
			userSearchTerm = '';

		} catch ( error ) {
			toast.error( 'An error occurred while assigning', errorToast() );
		}
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="bg-dark-blue/30 border border-neon-blue/20 rounded-lg p-6">
		<h2 class="text-xl font-semibold text-white mb-2">Mass Assignment</h2>
		<p class="text-sm text-gray-400">
			Assign roles, permissions, or groups to multiple users at once
		</p>
	</div>

	<!-- Assignment Configuration -->
	<div class="bg-dark-blue/30 border border-neon-blue/20 rounded-lg p-6 space-y-6">
		<div class="flex items-center justify-between">
			<h3 class="text-lg font-semibold text-white">1. Select What to Assign</h3>
			<div class="flex items-center space-x-2">
				<button
					type="button"
					onclick={selectAllElements}
					class="text-xs px-3 py-1 bg-neon-blue/20 text-neon-blue rounded hover:bg-neon-blue/30 transition-colors"
				>
					Select All
				</button>
				<button
					type="button"
					onclick={deselectAllElements}
					class="text-xs px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
				>
					Deselect All
				</button>
			</div>
		</div>

		<!-- Type Selector -->
		<div class="space-y-3">
			<p class="text-sm font-medium text-gray-300">Assignment Type</p>
			<div class="grid grid-cols-3 gap-4">
				<button
					type="button"
					onclick={() => assignmentType = 'role'}
					class="p-4 border-2 rounded-lg transition-all {
						assignmentType === 'role'
							? 'border-neon-blue bg-neon-blue/10 text-white'
							: 'border-neon-blue/20 bg-dark-blue/50 text-gray-400 hover:border-neon-blue/40'
					}"
				>
					<div class="flex flex-col items-center space-y-2">
						<span class="text-2xl">👥</span>
						<span class="font-medium">Role</span>
						{#if selectedRoleIds.size > 0}
							<span class="text-xs bg-neon-blue text-dark-blue px-2 py-0.5 rounded-full">
								{selectedRoleIds.size}
							</span>
						{/if}
					</div>
				</button>

				<button
					type="button"
					onclick={() => assignmentType = 'permission'}
					class="p-4 border-2 rounded-lg transition-all {
						assignmentType === 'permission'
							? 'border-neon-blue bg-neon-blue/10 text-white'
							: 'border-neon-blue/20 bg-dark-blue/50 text-gray-400 hover:border-neon-blue/40'
					}"
				>
					<div class="flex flex-col items-center space-y-2">
						<span class="text-2xl">🔐</span>
						<span class="font-medium">Permission</span>
						{#if selectedPermissionIds.size > 0}
							<span class="text-xs bg-neon-blue text-dark-blue px-2 py-0.5 rounded-full">
								{selectedPermissionIds.size}
							</span>
						{/if}
					</div>
				</button>

				<button
					type="button"
					onclick={() => assignmentType = 'group'}
					class="p-4 border-2 rounded-lg transition-all {
						assignmentType === 'group'
							? 'border-neon-blue bg-neon-blue/10 text-white'
							: 'border-neon-blue/20 bg-dark-blue/50 text-gray-400 hover:border-neon-blue/40'
					}"
				>
					<div class="flex flex-col items-center space-y-2">
						<span class="text-2xl">📦</span>
						<span class="font-medium">Group</span>
						{#if selectedGroupIds.size > 0}
							<span class="text-xs bg-neon-blue text-dark-blue px-2 py-0.5 rounded-full">
								{selectedGroupIds.size}
							</span>
						{/if}
					</div>
				</button>
			</div>
		</div>

		<!-- Search Input for Elements -->
		<div class="relative">
			<input
				bind:value={elementSearchTerm}
				type="text"
				placeholder="Search {assignmentType}s..."
				class="w-full bg-dark-blue/30 border border-neon-blue/30 rounded-md py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue/60"
			>
			<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="11" cy="11" r="8"></circle>
					<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
				</svg>
			</div>
		</div>

		<!-- Selection Summary -->
		<div class="bg-space-blue/20 border border-neon-blue/20 rounded-lg p-4">
			<h4 class="text-sm font-medium text-neon-blue mb-2">Selection Summary</h4>
			<p class="text-sm text-gray-300">
				{currentSelectedIds().size} {assignmentType}{currentSelectedIds().size !== 1 ? 's' : ''} selected
			</p>
		</div>

		<!-- Elements List with Checkboxes -->
		<div class="space-y-3 max-h-96 overflow-y-auto">
			<h4 class="text-sm font-medium text-white sticky top-0 bg-dark-blue/90 py-2 z-10">
				Available {assignmentType === 'role' ? 'Roles' : assignmentType === 'permission' ? 'Permissions' : 'Groups'} ({filteredElements.length})
			</h4>
			
			{#if assignmentType === 'role' && $rolesResult.fetching}
				<p class="text-gray-400 text-sm">Loading roles...</p>
			{:else if assignmentType === 'permission' && $permissionsResult.fetching}
				<p class="text-gray-400 text-sm">Loading permissions...</p>
			{:else}
				{#each filteredElements as element}
					<div class="flex items-center justify-between p-3 bg-dark-blue/50 border border-neon-blue/20 rounded-lg hover:bg-dark-blue/70 transition-colors">
						<div class="flex items-center space-x-3 flex-1">
							<span class="text-2xl">
								{assignmentType === 'role' ? '👥' : assignmentType === 'permission' ? '🔐' : '📦'}
							</span>
							<div class="flex-1">
								<p class="font-medium text-white">{element.name}</p>
								{#if element.description}
									<p class="text-sm text-gray-400">{element.description}</p>
								{/if}
							</div>
						</div>

						<label class="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={element.id ? currentSelectedIds().has( element.id ) : false}
								onchange={() => element.id && toggleElementSelection( element.id )}
								class="sr-only peer"
							>
							<div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neon-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-blue"></div>
						</label>
					</div>
				{:else}
					<div class="text-center py-8">
						<p class="text-gray-400">
							{elementSearchTerm ? `No ${assignmentType}s found matching your search` : `No ${assignmentType}s available`}
						</p>
					</div>
				{/each}
			{/if}
		</div>
	</div>

	<!-- User Selection -->
	<div class="bg-dark-blue/30 border border-neon-blue/20 rounded-lg p-6 space-y-6">
		<div class="flex items-center justify-between">
			<h3 class="text-lg font-semibold text-white">2. Select Users</h3>
			<div class="flex items-center space-x-2">
				<button
					type="button"
					onclick={selectAllUsers}
					class="text-xs px-3 py-1 bg-neon-blue/20 text-neon-blue rounded hover:bg-neon-blue/30 transition-colors"
				>
					Select All
				</button>
				<button
					type="button"
					onclick={deselectAllUsers}
					class="text-xs px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
				>
					Deselect All
				</button>
			</div>
		</div>

		<!-- Search Input -->
		<div class="relative">
			<input
				bind:value={userSearchTerm}
				type="text"
				placeholder="Search users by name or email..."
				class="w-full bg-dark-blue/30 border border-neon-blue/30 rounded-md py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue/60"
			>
			<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="11" cy="11" r="8"></circle>
					<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
				</svg>
			</div>
		</div>

		<!-- Selected Users Summary -->
		<div class="bg-space-blue/20 border border-neon-blue/20 rounded-lg p-4">
			<h4 class="text-sm font-medium text-neon-blue mb-2">Selection Summary</h4>
			<p class="text-sm text-gray-300">
				{selectedUserIds.size} user{selectedUserIds.size !== 1 ? 's' : ''} selected
			</p>
		</div>

		<!-- Users List -->
		<div class="space-y-3 max-h-96 overflow-y-auto">
			<h4 class="text-sm font-medium text-white sticky top-0 bg-dark-blue/90 py-2 z-10">
				Available Users ({filteredUsers.length})
			</h4>
			
			{#each filteredUsers as user}
				<div class="flex items-center justify-between p-3 bg-dark-blue/50 border border-neon-blue/20 rounded-lg hover:bg-dark-blue/70 transition-colors">
					<div class="flex items-center space-x-3">
						{#if user.avatar}
							<img src={user.avatar} alt={user.name} class="w-10 h-10 rounded-full">
						{:else}
							<div class="w-10 h-10 bg-neon-blue/20 rounded-full flex items-center justify-center">
								<span class="text-neon-blue font-medium text-sm">
									{user.name.charAt( 0 ).toUpperCase()}
								</span>
							</div>
						{/if}
						<div>
							<p class="font-medium text-white">{user.name}</p>
							<p class="text-sm text-gray-400">{user.email}</p>
						</div>
					</div>

					<label class="relative inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							checked={selectedUserIds.has( user.id )}
							onchange={() => toggleUserSelection( user.id )}
							class="sr-only peer"
						>
						<div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neon-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-blue"></div>
					</label>
				</div>
			{:else}
				<div class="text-center py-8">
					<p class="text-gray-400">
						{userSearchTerm ? 'No users found matching your search' : 'No users available'}
					</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- Assignment Preview & Submit -->
	<div class="bg-dark-blue/30 border border-neon-blue/20 rounded-lg p-6 space-y-6">
		<h3 class="text-lg font-semibold text-white">3. Review & Assign</h3>

		{#if totalSelectedElements > 0 && selectedUserIds.size > 0}
			<div class="bg-neon-blue/10 border border-neon-blue/30 rounded-lg p-4 space-y-4">
				<div class="flex items-center space-x-2">
					<span class="text-neon-blue text-xl">✓</span>
					<p class="text-sm text-white">
						Ready to assign <strong>{totalSelectedElements}</strong> item(s) to <strong>{selectedUserIds.size}</strong> user(s)
					</p>
				</div>

				<!-- Selected Elements Preview -->
				<div class="space-y-2">
					<p class="text-xs font-medium text-gray-400 uppercase">Selected Items:</p>
					<div class="flex flex-wrap gap-2">
						{#each allSelectedElements().slice( 0, 8 ) as item}
							<span class="inline-flex items-center px-2 py-1 bg-space-blue/50 border border-neon-blue/20 rounded text-xs text-gray-300">
								{item.type === 'role' ? '👥' : item.type === 'permission' ? '🔐' : '📦'}
								{item.element.name}
							</span>
						{/each}
						{#if totalSelectedElements > 8}
							<span class="inline-flex items-center px-2 py-1 bg-space-blue/50 border border-neon-blue/20 rounded text-xs text-gray-400">
								+{totalSelectedElements - 8} more
							</span>
						{/if}
					</div>
				</div>

				<!-- Selected Users Preview -->
				<div class="space-y-2">
					<p class="text-xs font-medium text-gray-400 uppercase">Selected Users:</p>
					<div class="flex flex-wrap gap-2">
						{#each Array.from( selectedUserIds ).slice( 0, 8 ) as userId}
							{@const user = availableUsers.find( u => u.id === userId )}
							{#if user}
								<span class="inline-flex items-center px-2 py-1 bg-space-blue/50 border border-neon-blue/20 rounded text-xs text-gray-300">
									{user.name}
								</span>
							{/if}
						{/each}
						{#if selectedUserIds.size > 8}
							<span class="inline-flex items-center px-2 py-1 bg-space-blue/50 border border-neon-blue/20 rounded text-xs text-gray-400">
								+{selectedUserIds.size - 8} more
							</span>
						{/if}
					</div>
				</div>
			</div>

			<button
				type="button"
				onclick={handleSubmit}
				class="w-full px-6 py-3 bg-neon-blue text-dark-blue font-medium rounded-md hover:bg-neon-blue/80 transition-colors"
			>
				Assign {totalSelectedElements} Item(s) to {selectedUserIds.size} User(s)
			</button>
		{:else}
			<div class="text-center py-8 border-2 border-dashed border-neon-blue/20 rounded-lg">
				<p class="text-gray-400 text-sm">
					{totalSelectedElements === 0 
						? 'Select roles, permissions, or groups and users to continue' 
						: 'Select at least one user to continue'}
				</p>
			</div>
		{/if}
	</div>
</div>
