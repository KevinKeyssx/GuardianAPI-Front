<script lang="ts">
	import type { Snippet } from "svelte";

    import { Select } from "bits-ui";

    import {
        Check,
        CaretUpDown,
        CaretDoubleUp,
        CaretDoubleDown
    } from "phosphor-svelte";


    type Option = {
        label       : string;
        value       : string;
        disabled?   : boolean;
    };


    type Props = {
        options?        : Option[];
        value?          : string;
        placeholder?    : string;
        label?          : string;
        id?             : string;
        name?           : string;
        required?       : boolean;
        disabled?       : boolean;
        icon?           : Snippet;
        onChange?       : ( value: string ) => void;
    };


    let {
        options = [],
        value = $bindable<string>(),
        placeholder = "Select an option",
        label = "",
        id = "",
        name = "",
        required = false,
        disabled = false,
        icon,
        onChange: onchange,
    }: Props = $props();

    const selectedLabel = $derived(
        value
            ? options.find((option) => option.value === value)?.label
            : placeholder
    );

    function handleChange(value: string) {
        if (onchange) {
            onchange(value);
        }
    }
</script>

<div class="flex flex-col gap-1">
    {#if label}
        <label for={id} class="text-sm font-orbitron text-white mb-1">{label}</label>
    {/if}
    
    <Select.Root 
        type="single" 
        onValueChange={(v) => {
            value = v;
            handleChange(v);
        }} 
        items={options}
        {disabled}
        {required}
    >
        <Select.Trigger
            class="w-full px-4 py-2 bg-space-blue border border-neon-blue/30 rounded-lg focus:border-neon-blue hover:border-neon-blue focus:outline-none text-white flex items-center transition-colors {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
            aria-label={placeholder}
            {id}
        >
            {#if icon}
                {@render icon()}
            {/if}
            <span class="ml-2 flex-1 text-left">{selectedLabel}</span>
            <CaretUpDown class="text-neon-blue ml-auto size-5" />
        </Select.Trigger>

        <Select.Portal>
            <Select.Content
                class="bg-space-blue border border-neon-blue/30 shadow-lg overflow-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 outline-hidden z-[10000] max-h-96 w-[var(--bits-select-anchor-width)] min-w-[var(--bits-select-anchor-width)] select-none rounded-lg px-1 py-2 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
                sideOffset={2}
            >
                <Select.ScrollUpButton class="flex w-full items-center justify-center text-neon-blue py-1">
                    <CaretDoubleUp class="size-4" />
                </Select.ScrollUpButton>

                <Select.Viewport class="p-1">
                    {#each options as option, i (i + option.value)}
                        <Select.Item
                            class="rounded-md hover:bg-neon-blue/20 data-highlighted:bg-neon-blue/30 data-highlighted:text-white outline-hidden data-disabled:opacity-30 flex h-10 w-full select-none items-center py-2 px-3 text-sm text-white capitalize transition-colors duration-150"
                            value={option.value}
                            label={option.label}
                            disabled={option.disabled}
                        >
                            {#snippet children({ selected })}
                                {option.label}

                                {#if selected}
                                    <div class="ml-auto text-neon-blue">
                                        <Check class="size-5" />
                                    </div>
                                {/if}
                            {/snippet}
                        </Select.Item>
                    {/each}
                </Select.Viewport>

                <Select.ScrollDownButton class="flex w-full items-center justify-center text-neon-blue py-1">
                    <CaretDoubleDown class="size-4" />
                </Select.ScrollDownButton>
            </Select.Content>
        </Select.Portal>
    </Select.Root>
</div>