<script lang="ts">
	import toast from 'svelte-french-toast';
	import { z } from 'zod';

	import Input		from "@/components/inputs/Input.svelte";
	import Textarea		from "@/components/inputs/Textarea.svelte";
	import Switch		from "@/components/inputs/Switch.svelte";

	import {
		errorToast,
		successToast
	}					from '@/config/toast.config';

	// Define types for Role and Permission
	type RolePermissionData = {
		id?			: string;
		name?		: string;
		description?	: string;
		isActive?		: boolean;
	};

	interface Props {
		data		: RolePermissionData;
		isRole		: boolean;	// true for Role, false for Permission
		clicked		: number;
		onSuccess?	: () => void;
	}


	const {
		data: itemData,
		isRole,
		clicked = $bindable(),
		onSuccess
	}: Props = $props();


	let item = $state<RolePermissionData>( itemData );
	let errors = $state<Record<string, string>>( {} );

	// Schema validation with Zod
	const itemSchema = z.object({
		name			: z.string()
					.min( 1, 'Name is required' )
					.max( 100, 'Name must be less than 100 characters' ),
		description		: z.string().optional(),
	});

	// Function to create a new role
	async function onCreateRole( input: any ): Promise<void> {
		// TODO: Implement GraphQL mutation for creating role
		console.log( "Creating role:", input );
		
		// Simulate API call
		await new Promise( resolve => setTimeout( resolve, 1000 ) );
		
		toast.success( 'Role created successfully', successToast() );
		item = {} as RolePermissionData;
		( window as any )[`closeModal_add-role`]?.();
		onSuccess?.();
	}


	// Function to update an existing role
	async function onUpdateRole( input: any ): Promise<void> {
		// TODO: Implement GraphQL mutation for updating role
		console.log( "Updating role:", input );
		
		// Simulate API call
		await new Promise( resolve => setTimeout( resolve, 1000 ) );
		
		toast.success( 'Role updated successfully', successToast() );
		( window as any )[`closeModal_edit-role`]?.();
		onSuccess?.();
	}


	// Function to create a new permission
	async function onCreatePermission( input: any ): Promise<void> {
		// TODO: Implement GraphQL mutation for creating permission
		console.log( "Creating permission:", input );
		
		// Simulate API call
		await new Promise( resolve => setTimeout( resolve, 1000 ) );
		
		toast.success( 'Permission created successfully', successToast() );
		item = {} as RolePermissionData;
		( window as any )[`closeModal_add-permission`]?.();
		onSuccess?.();
	}


	// Function to update an existing permission
	async function onUpdatePermission( input: any ): Promise<void> {
		// TODO: Implement GraphQL mutation for updating permission
		console.log( "Updating permission:", input );
		
		// Simulate API call
		await new Promise( resolve => setTimeout( resolve, 1000 ) );
		
		toast.success( 'Permission updated successfully', successToast() );
		( window as any )[`closeModal_edit-permission`]?.();
		onSuccess?.();
	}


	// Clear error for specific field
	function clearError( field: string ): void {
		if ( errors[field] ) {
			errors = { ...errors };
			delete errors[field];
		}
	}

	// Validate form using Zod schema
	function validateForm(): boolean {
		errors = {};
		let isValid = true;

		const result = itemSchema.safeParse({
			name			: item.name || '',
			description		: item.description || ''
		});

		if ( !result.success ) {
			result.error.errors.forEach( ( error ) => {
				const field = error.path[0] as string;
				errors[field] = error.message;
			});
			isValid = false;
		}

		return isValid;
	}


	// Handle form submission
	async function handleFormSubmit( event: Event ): Promise<void> {
		event.preventDefault();
		console.log( "Form data:", item, "isRole:", isRole );

		if ( !validateForm() ) {
			return;
		}

		const input = {
			id				: item.id,
			name			: item.name,
			description		: item.description,
			isActive		: item.isActive
		};

		console.log( "Submitting input:", input );

		if ( isRole ) {
			// Handle Role operations
			if ( item.id ) {
				await onUpdateRole( input );
			} else {
				await onCreateRole( input );
			}
		} else {
			// Handle Permission operations
			if ( item.id ) {
				await onUpdatePermission( input );
			} else {
				await onCreatePermission( input );
			}
		}
	}

	// Initialize isActive for editing mode
	$effect(() => {
		if ( item.id && item.isActive === undefined ) {
			item.isActive = true;
		}
	});
</script>

<form
	class		= "space-y-4"
	id			= "{ isRole ? 'role' : 'permission' }-form"
	onsubmit	= { handleFormSubmit }
>
	<!-- Name Field -->
	<Input
		bind:value	= { item.name }
		label		= "Name"
		placeholder	= "Enter { isRole ? 'role' : 'permission' } name"
		id			= "name"
		name		= "name"
		type		= 'text'
		required	= { true }
		error		= { errors.name }
		onInput		= { () => clearError( 'name' ) }
	/>

	<!-- Description Field -->
	<Textarea
		bind:value	= { item.description }
		label		= "Description"
		placeholder	= "Enter { isRole ? 'role' : 'permission' } description (optional)"
		id			= "description"
		name		= "description"
		rows		= { 3 }
		error		= { errors.description }
		onInput		= { () => clearError( 'description' ) }
	/>

	<!-- Active Switch (only for editing) -->
	{#if item.id}
		<Switch
			bind:checked	= { item.isActive }
			label			= "Active"
			id				= "isActive"
			name			= "isActive"
		/>
	{/if}

	<!-- Submit Button -->
	<button 
		type	= "submit"
		class	= "w-full px-4 py-2 bg-neon-blue text-dark-blue rounded-md hover:bg-opacity-80 transition-colors duration-300 font-orbitron font-medium"
	>
		{ item.id ? 'Update' : 'Create' } { isRole ? 'Role' : 'Permission' }
	</button>
</form>