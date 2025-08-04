<script lang="ts">
	import CancelIcon	from "@/icons/CancelIcon.svelte";
	import CheckIcon	from "@/icons/CheckIcon.svelte";
	import EditIcon		from "@/icons/EditIcon.svelte";

	import type { UserAttribute } from "@/lib/graphql/users/types";


	type Props = {
		attribute   : UserAttribute;
		onEdit		: ( attribute: UserAttribute ) => void;
		onSave		: ( attribute: UserAttribute ) => void;
		onCancel	: ( attribute: UserAttribute ) => void;
	}


	const { attribute, onEdit, onSave, onCancel }: Props = $props();


	function enableAttributeEditing( ) {
		onEdit( attribute );
	}


	function cancelAttributeEditing( ) {
		onCancel( attribute );
	}


	function saveAttributeChanges( ) {
		onSave( attribute );
	}
</script>

{#if !attribute.isEditing}
	<button
		type	= "button"
		class	= "p-2 text-neon-blue hover:bg-neon-blue/20 rounded-md transition-colors"
		onclick	= { enableAttributeEditing }
		title	= "Edit attribute"
	>
		<EditIcon />
	</button>
{:else}
	<div class="flex gap-1">
		<button
			type	= "button"
			class	= "p-2 text-green-400 hover:bg-green-400/20 rounded-md transition-colors"
			onclick	= { saveAttributeChanges }
			title	= "Save changes"
		>
			<CheckIcon />
		</button>

        <button
			type	= "button"
			class	= "p-2 text-red-400 hover:bg-red-400/20 rounded-md transition-colors"
			onclick	= { cancelAttributeEditing }
			title	= "Cancel changes"
		>
			<CancelIcon />
		</button>
	</div>
{/if}
