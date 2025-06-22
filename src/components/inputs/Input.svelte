<script lang="ts">
    type Props = {
        placeholder?    : string;
        id?             : string;
        name?           : string;
        value?          : string | number;
        label?          : string;
        type?           : 'text' | 'email' | 'password' | 'number' | 'search';
        required?       : boolean;
        disabled?       : boolean;
        min?            : number;
        max?            : number;
    }


    let {
        placeholder = "",
        id          = "",
        name        = "",
        value       = $bindable<string | number>(),
        label       = "",
        type        = 'text',
        required    = false,
        disabled    = false,
        min         = undefined,
        max         = undefined,
    }: Props = $props();
</script>

<div class="flex flex-col gap-1.5">
    {#if label}
        <label for={id} class="text-sm font-orbitron text-white">{label}</label>
    {/if}

    <input
        bind:value={ value }
        type            = { type }
        placeholder     = { placeholder }
        class           = "w-full px-4 py-2 bg-space-blue border border-neon-blue/30 rounded-lg focus:border-neon-blue hover:border-neon-blue/60 focus:outline-none text-white placeholder-white/50 transition-colors number-input-custom"
        data-section    = { id }
        id              = { id }
        name            = { name }
        required        = { required }
        disabled        = { disabled }
        min             = { min }
        max             = { max }
    />
</div>

<style>
    /* Estilos para los controles de incremento/decremento en Chrome, Safari, Edge, Opera */
    :global(input[type=number]::-webkit-outer-spin-button),
    :global(input[type=number]::-webkit-inner-spin-button) {
        -webkit-appearance: none;
        appearance: none;
        margin: 0;
    }
    
    /* Para Firefox */
    :global(input[type=number]) {
        -moz-appearance: textfield;
        appearance: textfield;
    }
    
    /* Estilo personalizado para los controles de número */
    :global(input[type=number].number-input-custom) {
        position: relative;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='28' viewBox='0 0 16 28'%3E%3Cpath d='M8 8l4 4H4l4-4z' fill='%2364D3FF'/%3E%3Cpath d='M8 20L4 16h8l-4 4z' fill='%2364D3FF'/%3E%3C/svg%3E");
        background-position: right 8px center;
        background-repeat: no-repeat;
        background-size: 16px auto;
        padding-right: 30px;
    }
    
    /* Estilo para el estado hover */
    :global(input[type=number].number-input-custom:hover) {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='28' viewBox='0 0 16 28'%3E%3Cpath d='M8 8l4 4H4l4-4z' fill='%23A9E9FF'/%3E%3Cpath d='M8 20L4 16h8l-4 4z' fill='%23A9E9FF'/%3E%3C/svg%3E");
    }
    
    /* Estilo para el estado focus */
    :global(input[type=number].number-input-custom:focus) {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='28' viewBox='0 0 16 28'%3E%3Cpath d='M8 8l4 4H4l4-4z' fill='white'/%3E%3Cpath d='M8 20L4 16h8l-4 4z' fill='white'/%3E%3C/svg%3E");
    }
</style>