<script lang="ts">
    type Props = {
        placeholder?    : string;
        id?             : string;
        name?           : string;
        value?          : string;
        label?          : string;
        required?       : boolean;
        disabled?       : boolean;
        readonly?       : boolean;
        rows?           : number;
        cols?           : number;
        minlength?      : number;
        maxlength?      : number;
        resize?         : 'none' | 'both' | 'horizontal' | 'vertical';
        onChange?       : (value: string) => void;
    }

    let {
        placeholder = "",
        id          = "",
        name        = "",
        value       = $bindable<string>(),
        label       = "",
        required    = false,
        disabled    = false,
        readonly    = false,
        rows        = 4,
        cols        = undefined,
        minlength   = undefined,
        maxlength   = undefined,
        resize      = 'vertical',
        onChange,
    }: Props = $props();

    function handleChange(event: Event) {
        const target = event.target as HTMLTextAreaElement;
        value = target.value;
        if (onChange) {
            onChange(target.value);
        }
    }
</script>

<div class="flex flex-col gap-1.5">
    {#if label}
        <label for={id} class="text-sm font-orbitron text-white">{label}</label>
    {/if}

    <textarea
        bind:value={value}
        oninput={handleChange}
        {placeholder}
        {id}
        {name}
        {required}
        {disabled}
        {readonly}
        {rows}
        {cols}
        {minlength}
        {maxlength}
        class="w-full px-4 py-3 bg-space-blue border border-neon-blue/30 rounded-lg focus:border-neon-blue hover:border-neon-blue/60 focus:outline-none text-white placeholder-white/50 transition-colors resize-{resize} min-h-[100px]"
        data-section={id}
    ></textarea>
</div>

<style>
    textarea {
        font-family: inherit;
        line-height: 1.5;
    }
    
    .resize-none {
        resize: none;
    }
    
    .resize-both {
        resize: both;
    }
    
    .resize-horizontal {
        resize: horizontal;
    }
    
    .resize-vertical {
        resize: vertical;
    }
    
    /* Custom scrollbar styling */
    textarea::-webkit-scrollbar {
        width: 8px;
    }
    
    textarea::-webkit-scrollbar-track {
        background: rgba(0, 255, 255, 0.1);
        border-radius: 4px;
    }
    
    textarea::-webkit-scrollbar-thumb {
        background: rgba(0, 255, 255, 0.3);
        border-radius: 4px;
    }
    
    textarea::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 255, 255, 0.5);
    }
    
    /* Disabled state */
    textarea:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: rgba(30, 58, 138, 0.3);
    }
    
    /* Readonly state */
    textarea:read-only {
        background-color: rgba(30, 58, 138, 0.5);
        cursor: default;
    }
</style>