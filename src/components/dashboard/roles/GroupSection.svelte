<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Table,
		TableData,
		TableRow,
		type ColumnProp
	}						from "@/components/shared/table";
	import Modal				from "@/components/shared/Modal.svelte";
	import GroupForm			from "./GroupForm.svelte";
	import UserAssignmentModal	from "./UserAssignmentModal.svelte";
	import TableEmpty			from '@/components/shared/table/TableEmpty.svelte';
	import Action				from "@/components/shared/Action.svelte";

	import type { GroupsQuery, Group, Role, Permission } from "@/lib/graphql/roles/types";
	import { GROUPS_QUERY }		from "@/lib/graphql/roles/queries";
	import { client }			from "@/lib/urql";
	import { queryStore }		from '@urql/svelte';

	const queryParams = {
		page    : 0,
		each    : 10,
	};

	const groupResult = queryStore<GroupsQuery>({
		client,
		query           : GROUPS_QUERY,
		variables       : queryParams,
		requestPolicy   : 'cache-and-network'
	});

	function refetchGroups() {
		groupResult.reexecute({ requestPolicy: 'network-only' });
	}

	// Refresh interval management
	let refreshInterval: ReturnType<typeof setInterval> | undefined;

	function startRefreshInterval(intervalMs = 1000 * 60 * 30) {
		if ( refreshInterval ) clearInterval( refreshInterval );

		refreshInterval = setInterval(() => {
			console.log('Actualizando datos de grupos...');
			refetchGroups();
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
		{ column: 'Name',           showColumn: true },
		{ column: 'Description',    showColumn: true },
		{ column: 'Roles',          showColumn: true },
		{ column: 'Permissions',    showColumn: true },
		{ column: 'Users',          showColumn: true },
		{ column: 'Created At' ,    showColumn: true },
		{ column: 'Active' ,        showColumn: true },
		{ column: 'Actions',        showColumn: true }
	];

	// State for expanded groups
	let expandedGroups = $state<Set<string>>(new Set());

	function toggleGroup(groupId: string) {
		if ( expandedGroups.has(groupId) ) {
			expandedGroups.delete(groupId);
		} else {
			expandedGroups.add(groupId);
		}
		expandedGroups = new Set(expandedGroups);
	}

	function isGroupExpanded(groupId: string): boolean {
		return expandedGroups.has(groupId);
	}

	// Function to count items
	function countRoles(group: Group): number {
		return group.roles?.length || 0;
	}

	function countPermissions(group: Group): number {
		const directPermissions = group.permissions?.length || 0;
		const rolePermissions = group.roles?.reduce((total, role) => {
			return total + (role.permissions?.length || 0);
		}, 0) || 0;
		return directPermissions + rolePermissions;
	}

	function countUsers(group: Group): number {
		return group.users?.length || 0;
	}
</script>

<div class="animate-fade-in content-stretch h-full">
	<h1 class="text-2xl font-orbitron text-white mb-6">Groups</h1>

	<div class="flex justify-between items-center mb-4">
		<div class="relative w-64">
			<input 
				type="text" 
				placeholder="Search groups..." 
				class="search-input w-full bg-dark-blue/30 border border-neon-blue/30 rounded-md py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue/60" 
				data-section="groups"
			>
			<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="11" cy="11" r="8"></circle>
					<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
				</svg>
			</div>
		</div>

        <UserAssignmentModal
            group={undefined}
            modalId="assign-users-"
            onSuccess={refetchGroups}
        />

		<Modal
			id          = "add-group"
			title       = "Add Group"
			buttonText  = "Add Group"
		>
			{#snippet form()}
				<GroupForm
					group       = { {} as Group }
					clicked     = { 0 }
					onSuccess   = { refetchGroups }
				/>
			{/snippet}
		</Modal>
	</div>

	{#if $groupResult.fetching}
		<p class="text-white">Loading groups...</p>
	{:else if $groupResult.error}
		<p class="text-red-400">Error: {$groupResult.error.message}</p>
	{:else if $groupResult.data}
		<div class="space-y-4">
			<Table columns={columns}>
				{#each $groupResult.data.groups as group}
					<TableRow>
						<TableData value={group.name} />
						<TableData value={group.description} />
						<TableData value={countRoles(group).toString()} />
						<TableData value={countPermissions(group).toString()} />
						<TableData value={countUsers(group).toString()} />
						<TableData value={group.createdAt} />
						<TableData value={group.isActive} />
						<TableData size="text-sm font-medium" float={true}>
							<div class="flex items-center space-x-2">
								<button
									onclick={() => toggleGroup(group.id!)}
									class="px-3 py-1 bg-space-blue/20 text-neon-blue border border-neon-blue/30 rounded hover:bg-space-blue/40 transition-colors"
									title={isGroupExpanded(group.id!) ? 'Collapse' : 'Expand'}
								>
									{isGroupExpanded(group.id!) ? '−' : '+'}
								</button>
								<Action
									clicked     = { 0 }
									titleEdit   = "Edit Group"
									isModal     = { true }
									onDelete    = { () => console.log( 'Delete group:', group.id ) }
									type        = { 'group' }
									data        = { group.name || 'group' }
								>
									{#snippet form()}
										<GroupForm
											group       = { group }
											clicked     = { 0 }
											onSuccess   = { refetchGroups }
										/>
									{/snippet}
								</Action>
							</div>
						</TableData>
					</TableRow>

					<!-- Expanded content -->
					{#if isGroupExpanded(group.id!)}
						<tr class="bg-space-blue/10">
							<td colspan={columns.length} class="p-4">
								<div class="space-y-6">
									<!-- Roles Section -->
									{#if group.roles && group.roles.length > 0}
										<div>
											<h4 class="text-lg font-semibold text-neon-blue mb-3">Roles ({group.roles.length})</h4>
											<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
												{#each group.roles as role}
													<div class="bg-dark-blue/50 border border-neon-blue/20 rounded-lg p-4">
														<h5 class="font-medium text-white mb-2">{role.name}</h5>
														<p class="text-gray-400 text-sm mb-3">{role.description || 'No description'}</p>
														{#if role.permissions && role.permissions.length > 0}
															<div>
																<span class="text-xs text-neon-blue font-medium">Permissions ({role.permissions.length}):</span>
																<div class="flex flex-wrap gap-1 mt-1">
																	{#each role.permissions as permission}
																		<span class="inline-block bg-neon-blue/20 text-neon-blue text-xs px-2 py-1 rounded">
																			{permission.name}
																		</span>
																	{/each}
																</div>
															</div>
														{/if}
													</div>
												{/each}
											</div>
										</div>
									{/if}

									<!-- Direct Permissions Section -->
									{#if group.permissions && group.permissions.length > 0}
										<div>
											<h4 class="text-lg font-semibold text-neon-blue mb-3">Direct Permissions ({group.permissions.length})</h4>
											<div class="flex flex-wrap gap-2">
												{#each group.permissions as permission}
													<div class="bg-dark-blue/50 border border-neon-blue/20 rounded-lg p-3">
														<span class="font-medium text-white">{permission.name}</span>
														{#if permission.description}
															<p class="text-gray-400 text-sm mt-1">{permission.description}</p>
														{/if}
													</div>
												{/each}
											</div>
										</div>
									{/if}

									<!-- Users Section -->
									<div>
										<div class="flex items-center justify-between mb-3">
											<h4 class="text-lg font-semibold text-neon-blue">
												Assigned Users ({group.users?.length || 0})
											</h4>
											<UserAssignmentModal
												group={group}
												modalId="assign-users-{group.id}"
												onSuccess={refetchGroups}
											/>
										</div>
										
										{#if group.users && group.users.length > 0}
											<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
												{#each group.users as groupUser}
													{#if groupUser.user}
														<div class="bg-dark-blue/50 border border-neon-blue/20 rounded-lg p-4 flex items-center space-x-3">
															{#if groupUser.user.avatar}
																<img src={groupUser.user.avatar} alt={groupUser.user.name} class="w-10 h-10 rounded-full">
															{:else}
																<div class="w-10 h-10 bg-neon-blue/20 rounded-full flex items-center justify-center">
																	<span class="text-neon-blue font-medium">
																		{groupUser.user.name?.charAt(0).toUpperCase()}
																	</span>
																</div>
															{/if}
															<div>
																<p class="font-medium text-white">{groupUser.user.name}</p>
																<p class="text-gray-400 text-sm">{groupUser.user.email}</p>
															</div>
														</div>
													{/if}
												{/each}
											</div>
										{:else}
											<div class="text-center py-6 border-2 border-dashed border-neon-blue/20 rounded-lg">
												<p class="text-gray-400 mb-2">No users assigned to this group yet</p>
												<p class="text-sm text-gray-500">Click "Assign Users" to add users to this group</p>
											</div>
										{/if}
									</div>

									<!-- Empty state -->
									{#if (!group.roles || group.roles.length === 0) && (!group.permissions || group.permissions.length === 0) && (!group.users || group.users.length === 0)}
										<div class="text-center py-8">
											<p class="text-gray-400">This group has no roles, permissions, or users assigned yet.</p>
										</div>
									{/if}
								</div>
							</td>
						</tr>
					{/if}
				{:else}
					<TableEmpty
						columns = { columns.length }
						data    = "No groups found"
					/>
				{/each}
			</Table>
		</div>
	{/if}
</div>
