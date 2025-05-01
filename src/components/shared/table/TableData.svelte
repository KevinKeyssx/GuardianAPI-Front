<script lang="ts">
    import CheckIcon  from '@/icons/CheckIcon.svelte';
    import NoCheckIcon from '@/icons/NoCheckIcon.svelte';

    type Value = string | number | boolean | undefined;

    export let value        : Value | undefined = undefined;
    export let color        : string    = 'text-white';
    export let py           : string    = 'py-4';
    export let px           : string    = 'px-6';
    export let size         : string    = 'text-sm';
    export let className    : string    = '';
    export let float        : boolean   = false;

    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
</script>

<td
    class={`whitespace-nowrap
        ${size}
        ${color}
        ${py}
        ${float ? 'px-4': px }
        ${className}
        ${float ? 'text-center w-20 sticky right-0 z-10 bg-dark-blue/90 backdrop-blur-sm shadow-[-4px_0_5px_rgba(0,0,0,0.3)]' : ''}
`}>
    {#if value === undefined}
        <slot />
    {:else if typeof value === 'boolean'}
        {#if ( value as boolean ) === false}
            <NoCheckIcon />
        {:else}
            <CheckIcon />
        {/if}
    {:else if typeof value === 'number'}
        <span class="text-neon-blue">{value}</span>
    {:else if urlPattern.test( value )}
        <img src={value} alt={value} class="w-8 h-8 rounded-full mx-auto"/>
    {:else}
        <span>{ value }</span>
    {/if}
</td>

