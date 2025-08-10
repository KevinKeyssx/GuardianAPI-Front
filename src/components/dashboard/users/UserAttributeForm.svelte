<script lang="ts">
    import { Accordion }    from "bits-ui";
    import CaretDown        from "phosphor-svelte/lib/CaretDown";
    import toast            from 'svelte-french-toast';

    import DatePicker           from "@/components/inputs/DatePicker.svelte";
	import Input	            from "@/components/inputs/Input.svelte";
	import Switch	            from "@/components/inputs/Switch.svelte";
	import Textarea	            from "@/components/inputs/Textarea.svelte";
	import UserAttributeAction  from "@/components/dashboard/users/UserAttributeAction.svelte";

    import {
        CREATE_USER_ATTRIBUTE_MUTATION,
        UPDATE_USER_ATTRIBUTE_MUTATION
    }                       from "@/lib/graphql/users/mutations/user-attritute-mutation";
	import {
        AttributeType,
        type User,
        type UserAttribute
    }                       from "@/lib/graphql/users/types";
    import { client }       from "@/lib/urql";

    import { errorToast, successToast } from "@/config/toast.config";


	type Props = {
		attributes	: UserAttribute[] | undefined;
        user        : User | undefined;
		clearError	: ( key: string ) => void;
	}

	const { attributes, clearError, user }: Props = $props();

	let errors = $state<Record<string, string>>( {} );


    function enableAttributeEditing( attribute: UserAttribute ) {
		attribute.isEditing = true;
	}


	function cancelAttributeEditing( attribute: UserAttribute ) {
		attribute.isEditing = false;
	}


	function saveAttributeChanges( attribute: UserAttribute ) : Promise<void> {
		attribute.isEditing = false;

        if ( !attribute.valueId ) {
            return onCreateUserAttribute( attribute );
        }

        return onUpdateUserAttribute( attribute );
	}


    async function onCreateUserAttribute(
        input: UserAttribute
    ): Promise<void> {
        if ( !user ) return;

        const { data, error } = await client.mutation(
            CREATE_USER_ATTRIBUTE_MUTATION, {
                createUserAttributeValueInput: {
                    userAttributeId : input.id,
                    userId          : user.id,
                    value           : input.value
                },
            }
        ).toPromise();

        if ( error ) {
            console.error( 'Error updating attribute:', error );
            toast.error( 'Error updating attribute', errorToast() );
            return;
        }

        if ( data ) {
            console.log( 'User updated successfully:', data.updateUser );
            toast.success( 'User updated successfully', successToast() );
        }
    }


    async function onUpdateUserAttribute(
        input: UserAttribute
    ): Promise<void> {
        const { data, error } = await client.mutation(
            UPDATE_USER_ATTRIBUTE_MUTATION, {
                updateUserAttributeValueId: input.valueId,
                value: input.value,
            }
        ).toPromise();

        if ( error ) {
            console.error( 'Error updating attribute:', error );
            toast.error( 'Error updating attribute', errorToast() );
            return;
        }

        if ( data ) {
            console.log( 'User updated successfully:', data.updateUser );
            toast.success( 'User updated successfully', successToast() );
        }
    }
</script>

{#if ( attributes?.length || 0 ) > 0}
    <Accordion.Root class="w-full" type="single">
        <Accordion.Item
            value="attributes"
            class="border-neon-blue group border-b"
        >
            <Accordion.Header>
                <Accordion.Trigger
                    class="flex w-full flex-1 select-none items-center justify-between py-5 text-[15px] font-medium transition-all [&[data-state=open]>span>svg]:rotate-180 hover:bg-neon-blue/10 rounded-lg px-3 h-12"
                >
                    <span class="text-neon-blue flex items-center">Attributes</span>

                    <span class="hover:bg-dark-10 inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent">
                        <CaretDown class="size-[18px] transition-transform duration-200" />
                    </span>
                </Accordion.Trigger>
            </Accordion.Header>

            <Accordion.Content
                class="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm tracking-[-0.01em]"
            >
                <div class="max-h-96 overflow-auto">
                    <div class="pt-5 pb-7 space-y-4">
                    {#each attributes || [] as attribute }
                        {#if attribute.type === AttributeType.String}
                            <div class="flex items-end gap-2">
                                <div class="flex-1">
                                    <Input
                                        bind:value={ attribute.value }
                                        placeholder = "Enter value"
                                        id          = { attribute.key }
                                        name        = { attribute.key }
                                        type        = "text"
                                        label       = { attribute.key }
                                        disabled    = { !attribute.isEditing }
                                        error       = { errors[`attribute_${attribute.key}` ]}
                                        onInput     = { () => clearError( `attribute_${attribute.key}` )}
                                    />
                                </div>

                                <UserAttributeAction
                                    attribute	= { attribute }
                                    onEdit		= { enableAttributeEditing }
                                    onSave		= { saveAttributeChanges }
                                    onCancel	= { cancelAttributeEditing }
                                />
                            </div>
                        {:else if attribute.type === AttributeType.Number}
                            <div class="flex items-end gap-2">
                                <div class="flex-1">
                                    <Input
                                        bind:value={ attribute.value }
                                        placeholder = "Enter value"
                                        id          = { attribute.key }
                                        name        = { attribute.key }
                                        type        = "number"
                                        label       = { attribute.key }
                                        disabled    = { !attribute.isEditing }
                                        error       = { errors[`attribute_${attribute.key}` ]}
                                        onInput     = { () => clearError( `attribute_${attribute.key}` )}
                                    />
                                </div>

                                <UserAttributeAction
                                    attribute	= { attribute }
                                    onEdit		= { enableAttributeEditing }
                                    onSave		= { saveAttributeChanges }
                                    onCancel	= { cancelAttributeEditing }
                                />
                            </div>
                        {:else if attribute.type === AttributeType.Boolean}
                            <div class="flex items-end gap-2">
                                <div class="flex-1">
                                    <Switch
                                        bind:checked={ attribute.value }
                                        id           = { attribute.key }
                                        name         = { attribute.key }
                                        label        = { attribute.key }
                                        disabled     = { !attribute.isEditing }
                                        error        = { errors[`attribute_${attribute.key}` ]}
                                        onChange     = { () => clearError( `attribute_${attribute.key}` )}
                                    />
                                </div>

                                <UserAttributeAction
                                    attribute	= { attribute }
                                    onEdit		= { enableAttributeEditing }
                                    onSave		= { saveAttributeChanges }
                                    onCancel	= { cancelAttributeEditing }
                                />
                            </div>
                        {:else if attribute.type === AttributeType.Decimal}
                            <div class="flex items-end gap-2">
                                <div class="flex-1">
                                    <Input
                                        bind:value={ attribute.value }
                                        placeholder = "Enter decimal value"
                                        id          = { attribute.key }
                                        name        = { attribute.key }
                                        type        = "number"
                                        step        = "0.01"
                                        label       = { attribute.key }
                                        disabled    = { !attribute.isEditing }
                                        error       = { errors[`attribute_${attribute.key}` ]}
                                        onInput     = { () => clearError( `attribute_${attribute.key}` )}
                                    />
                                </div>

                                <UserAttributeAction
                                    attribute	= { attribute }
                                    onEdit		= { enableAttributeEditing }
                                    onSave		= { saveAttributeChanges }
                                    onCancel	= { cancelAttributeEditing }
                                />
                            </div>
                        {:else if attribute.type === AttributeType.Datetime}
                            <div class="flex items-end gap-2">
                                <div class="flex-1">
                                    <DatePicker
                                        bind:value={ attribute.value }
                                        id         = { attribute.key }
                                        label      = { attribute.key }
                                        disabled   = { !attribute.isEditing }
                                        error      = { errors[`attribute_${attribute.key}` ]}
                                        onInput   = { () => clearError( `attribute_${attribute.key}` )}
                                    />
                                </div>

                                <UserAttributeAction
                                    attribute	= { attribute }
                                    onEdit		= { enableAttributeEditing }
                                    onSave		= { saveAttributeChanges }
                                    onCancel	= { cancelAttributeEditing }
                                />
                            </div>
                        {:else if attribute.type === AttributeType.Json}
                            <div class="flex items-end gap-2">
                                <div class="flex-1">
                                    <Textarea
                                        bind:value={ attribute.value }
                                        placeholder = "Enter JSON data"
                                        id          = { attribute.key }
                                        name        = { attribute.key }
                                        label       = { attribute.key }
                                        rows        = { 6 }
                                        disabled    = { !attribute.isEditing }
                                        error       = { errors[`attribute_${attribute.key}`] }
                                        onInput     = { () => clearError( `attribute_${attribute.key}` )}
                                    />
                                </div>

                                <UserAttributeAction
                                    attribute	= { attribute }
                                    onEdit		= { enableAttributeEditing }
                                    onSave		= { saveAttributeChanges }
                                    onCancel	= { cancelAttributeEditing }
                                />
                            </div>
                        {:else if attribute.type === AttributeType.UUID}
                            <div class="flex items-end gap-2">
                                <div class="flex-1">
                                    <Input
                                        bind:value={ attribute.value }
                                        placeholder = "Enter UUID"
                                        id          = { attribute.key }
                                        name        = { attribute.key }
                                        type        = "text"
                                        label       = { attribute.key }
                                        disabled    = { !attribute.isEditing }
                                        error       = { errors[`attribute_${attribute.key}`] }
                                        onInput     = { () => clearError( `attribute_${attribute.key}` )}
                                    />
                                </div>

                                <UserAttributeAction
                                    attribute	= { attribute }
                                    onEdit		= { enableAttributeEditing }
                                    onSave		= { saveAttributeChanges }
                                    onCancel	= { cancelAttributeEditing }
                                />
                            </div>
                        {/if}
                    {/each}
                    </div>
                </div>
            </Accordion.Content>
        </Accordion.Item>
    </Accordion.Root>
{/if}
