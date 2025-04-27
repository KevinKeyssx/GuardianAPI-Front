<script lang="ts">
    import { Label, Switch } from "bits-ui";

    export let label    = "Do not disturb";
    export let id       = "dnd";
    export let name     = "hello";
</script>

<div class="flex items-center justify-between py-2">
    <Label.Root for={id} class="text-sm font-orbitron text-white">{label}</Label.Root>

    <Switch.Root
        {id}
        {name}
        class="focus-visible:ring-neon-blue focus-visible:ring-offset-space-blue data-[state=checked]:bg-neon-blue data-[state=unchecked]:bg-space-blue data-[state=unchecked]:border-neon-blue/50 focus-visible:outline-none peer inline-flex h-[28px] min-h-[28px] w-[52px] shrink-0 cursor-pointer items-center rounded-full border border-neon-blue/50 px-[2px] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
        <Switch.Thumb
            class="bg-white data-[state=checked]:bg-dark-blue pointer-events-none block size-[22px] shrink-0 rounded-full shadow-md transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0"
        />
    </Switch.Root>
</div>