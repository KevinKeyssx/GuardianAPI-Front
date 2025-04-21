<script lang="ts">
    import { Select } from "bits-ui";
    import Check from "phosphor-svelte/lib/Check";
    import Palette from "phosphor-svelte/lib/Palette";
    import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
    import CaretDoubleUp from "phosphor-svelte/lib/CaretDoubleUp";
    import CaretDoubleDown from "phosphor-svelte/lib/CaretDoubleDown";

    const themes = [
        { value: "light-monochrome", label: "Light Monochrome" },
        { value: "dark-green", label: "Dark Green" },
        { value: "svelte-orange", label: "Svelte Orange" },
        { value: "punk-pink", label: "Punk Pink" },
        { value: "ocean-blue", label: "Ocean Blue", disabled: true },
        // { value: "sunset-orange", label: "Sunset Orange" },
        // { value: "sunset-red", label: "Sunset Red" },
        // { value: "forest-green", label: "Forest Green" },
        // { value: "lavender-purple", label: "Lavender Purple", disabled: true },
        // { value: "mustard-yellow", label: "Mustard Yellow" },
        // { value: "slate-gray", label: "Slate Gray" },
        // { value: "neon-green", label: "Neon Green" },
        // { value: "coral-reef", label: "Coral Reef" },
        // { value: "midnight-blue", label: "Midnight Blue" },
        // { value: "crimson-red", label: "Crimson Red" },
        // { value: "mint-green", label: "Mint Green" },
        // { value: "pastel-pink", label: "Pastel Pink" },
        // { value: "golden-yellow", label: "Golden Yellow" },
        // { value: "deep-purple", label: "Deep Purple" },
        // { value: "turquoise-blue", label: "Turquoise Blue" },
        // { value: "burnt-orange", label: "Burnt Orange" }
    ];

    let value = $state<string>("");
    const selectedLabel = $derived(
        value
            ? themes.find((theme) => theme.value === value)?.label
            : "Select a theme"
    );
</script>

<div class="flex flex-col gap-1">
    <label for="theme" class="text-sm font-orbitron text-white mb-1">Theme</label>
    <Select.Root type="single" onValueChange={(v) => (value = v)} items={themes}>
        <Select.Trigger
            class="w-full px-4 py-2 bg-space-blue border border-neon-blue/30 rounded-lg focus:border-neon-blue hover:border-neon-blue focus:outline-none text-white flex items-center transition-colors"
            aria-label="Select a theme"
        >
            <Palette class="text-neon-blue mr-3 size-5" />
            <span class="flex-1 text-left">{selectedLabel}</span>
            <CaretUpDown class="text-neon-blue ml-auto size-5" />
        </Select.Trigger>

        <Select.Portal>
            <Select.Content
                class="bg-space-blue border border-neon-blue/30 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 outline-hidden z-[10000] max-h-[var(--bits-select-content-available-height)] w-[var(--bits-select-anchor-width)] min-w-[var(--bits-select-anchor-width)] select-none rounded-lg px-1 py-2 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
                sideOffset={2}
            >
                <Select.ScrollUpButton class="flex w-full items-center justify-center text-neon-blue py-1">
                    <CaretDoubleUp class="size-4" />
                </Select.ScrollUpButton>

                <Select.Viewport class="p-1">
                    {#each themes as theme, i (i + theme.value)}
                        <Select.Item
                            class="rounded-md hover:bg-neon-blue/20 data-highlighted:bg-neon-blue/30 data-highlighted:text-white outline-hidden data-disabled:opacity-30 flex h-10 w-full select-none items-center py-2 px-3 text-sm text-white capitalize transition-colors duration-150"
                            value={theme.value}
                            label={theme.label}
                            disabled={theme.disabled}
                        >
                            {#snippet children({ selected })}
                                {theme.label}

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