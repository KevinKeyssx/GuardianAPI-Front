<script lang="ts">
	import toast from 'svelte-french-toast';
	import { z } from 'zod';

	import Input from '@/components/inputs/Input.svelte';
	import Textarea from '@/components/inputs/Textarea.svelte';
	
	import type { Group } from '@/lib/graphql/roles/types';
	import {
		errorToast,
		successToast
	} from '@/config/toast.config';

	interface Props {
		group       : Group;
		clicked     : number;
		onSuccess?  : () => void;
	}

	let { 
		group: incomingGroup, 
		clicked = $bindable(), 
		onSuccess 
	}: Props = $props();

	let group = $state<Group>(incomingGroup);
	let errors = $state<Record<string, string>>({});

	// Validation schema
	const groupSchema = z.object({
		name: z.string()
			.min(1, 'Group name is required')
			.max(100, 'Group name must be less than 100 characters'),
		description: z.string()
			.max(500, 'Description must be less than 500 characters')
			.optional()
	});

	// Handle form submission
	async function handleSubmit() {
		errors = {};

		try {
			// Validate form data
			const validatedData = groupSchema.parse({
				name: group.name,
				description: group.description
			});

			// TODO: Implement actual mutation when GraphQL is ready
			// For now, just simulate success
			console.log('Group data to submit:', validatedData);
			
			toast.success(
				group.id ? 'Group updated successfully' : 'Group created successfully', 
				successToast()
			);

			clicked++;
			onSuccess?.();

		} catch (error) {
			if (error instanceof z.ZodError) {
				// Handle validation errors
				error.errors.forEach((err) => {
					if (err.path[0]) {
						errors[err.path[0] as string] = err.message;
					}
				});
			} else {
				toast.error('An error occurred while saving the group', errorToast());
			}
		}
	}
</script>

<form onsubmit={handleSubmit} class="space-y-6">
	<div class="grid grid-cols-1 gap-6">
		<Input
			bind:value      = {group.name}
			label           = "Group Name"
			placeholder     = "Enter group name"
			required        = {true}
			id              = "group-name"
			name            = "name"
			error           = {errors.name}
		/>

		<Textarea
			bind:value      = {group.description}
			label           = "Description"
			placeholder     = "Enter group description"
			id              = "group-description"
			name            = "description"
			rows            = {4}
			error           = {errors.description}
		/>
	</div>

	<div class="flex justify-end space-x-4 pt-4 border-t border-neon-blue/20">
		<button
			type="button"
			onclick={() => clicked++}
			class="px-6 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
		>
			Cancel
		</button>
		<button
			type="submit"
			class="px-6 py-2 bg-neon-blue text-dark-blue font-medium rounded-md hover:bg-neon-blue/80 transition-colors"
		>
			{group?.id ? 'Update' : 'Create'} Group
		</button>
	</div>
</form>
