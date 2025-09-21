<script lang="ts">
	import toast from 'svelte-french-toast';
	import type { Group, GroupUser } from '@/lib/graphql/roles/types';
	import Modal from '@/components/shared/Modal.svelte';
	import {
		errorToast,
		successToast
	} from '@/config/toast.config';

	interface Props {
		group?          : Group;
		modalId?        : string;
		onSuccess?      : () => void;
	}

	let { group, modalId = 'assign-users', onSuccess }: Props = $props();

	// Mock users data - replace with actual user query
	const availableUsers = [
		{ id: '1', name: 'John Doe', email: 'john@example.com', avatar: null },
		{ id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: null },
		{ id: '3', name: 'Bob Johnson', email: 'bob@example.com', avatar: null },
		{ id: '4', name: 'Alice Brown', email: 'alice@example.com', avatar: null },
	];

	// Get currently assigned user IDs
	let assignedUserIds = $state<Set<string>>(
		new Set(group?.users?.map(gu => gu.userId).filter((id): id is string => Boolean(id)) || [])
	);

	// Search functionality
	let searchTerm = $state('');
	let filteredUsers = $derived(
		availableUsers.filter(user => 
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase())
		)
	);

	// Toggle user assignment
	function toggleUserAssignment(userId: string) {
		if ( assignedUserIds.has(userId) ) {
			assignedUserIds.delete(userId);
		} else {
			assignedUserIds.add(userId);
		}
		assignedUserIds = new Set(assignedUserIds);
	}

	// Handle form submission
	async function handleSubmit() {
		try {
			const assignedUsers = Array.from(assignedUserIds).map(userId => {
				const user = availableUsers.find(u => u.id === userId);
				return {
					userId,
					groupId     : group?.id,
					user
				};
			});

			// TODO: Implement actual mutation when GraphQL is ready
			// For now, just simulate success
			console.log('User assignment data to submit:', {
				groupId     : group?.id,
				users       : assignedUsers
			});

			toast.success('Users assigned to group successfully', successToast());
			onSuccess?.();

		} catch (error) {
			toast.error('An error occurred while assigning users', errorToast());
		}
	}

	// Handle form cancellation
	function handleCancel() {
		// Reset to original state
		assignedUserIds = new Set(group?.users?.map(gu => gu.userId).filter((id): id is string => Boolean(id)) || []);
		// Just close the modal by not calling onSuccess
	}

	// Check if there are changes
	let hasChanges = $derived(() => {
		const originalIds = new Set(group?.users?.map(gu => gu.userId).filter(Boolean) || []);
		return assignedUserIds.size !== originalIds.size || 
			   !Array.from(assignedUserIds).every(id => originalIds.has(id));
	});
</script>

<Modal
	id          = {modalId}
	title       = "Assign Users to Group: {group?.name || 'Unknown'}"
	buttonText  = "Assign Users"
>
	{#snippet form()}
		<div class="space-y-6">
			<!-- Search Input -->
			<div class="relative">
				<input
					bind:value={searchTerm}
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

			<!-- Assignment Summary -->
			<div class="bg-space-blue/20 border border-neon-blue/20 rounded-lg p-4">
				<h4 class="text-sm font-medium text-neon-blue mb-2">Assignment Summary</h4>
				<p class="text-sm text-gray-300">
					{assignedUserIds.size} user{assignedUserIds.size !== 1 ? 's' : ''} will be assigned to this group
				</p>
				{#if hasChanges()}
					<p class="text-xs text-yellow-400 mt-1">
						⚠️ You have unsaved changes
					</p>
				{/if}
			</div>

			<!-- Users List -->
			<div class="space-y-3 max-h-96 overflow-y-auto">
				<h4 class="text-sm font-medium text-white sticky top-0 bg-dark-blue/90 py-2">
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
										{user.name.charAt(0).toUpperCase()}
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
								checked={assignedUserIds.has(user.id)}
								onchange={() => toggleUserAssignment(user.id)}
								class="sr-only peer"
							>
							<div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neon-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-blue"></div>
						</label>
					</div>
				{:else}
					<div class="text-center py-8">
						<p class="text-gray-400">
							{searchTerm ? 'No users found matching your search' : 'No users available'}
						</p>
					</div>
				{/each}
			</div>

			<!-- Action Buttons -->
			<div class="flex justify-end space-x-4 pt-4 border-t border-neon-blue/20">
				<button
					type="button"
					onclick={handleCancel}
					class="px-6 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
				>
					Cancel
				</button>
				<button
					type="button"
					onclick={handleSubmit}
					disabled={!hasChanges()}
					class="px-6 py-2 bg-neon-blue text-dark-blue font-medium rounded-md hover:bg-neon-blue/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Save Assignment
				</button>
			</div>
		</div>
	{/snippet}
</Modal>
