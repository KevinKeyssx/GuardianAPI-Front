<script lang="ts">
    export let placeholder = "";
    export let id = "";
    export let name = "";
    export let value = "";
    export let label = "";
    export let type: 'text' | 'email' | 'password' | 'number' | 'search' = "text";
    export let required = false;
</script>

<div class="flex flex-col gap-1.5">
    {#if label}
        <label for={id} class="text-sm font-orbitron text-white">{label}</label>
    {/if}

    <input
        type={type}
        placeholder={placeholder}
        class="w-full px-4 py-2 bg-space-blue border border-neon-blue/30 rounded-lg focus:border-neon-blue hover:border-neon-blue/60 focus:outline-none text-white placeholder-white/50 transition-colors"
        data-section={id}
        id={id}
        name={name}
        value={value}
        required={required}
    />
</div>