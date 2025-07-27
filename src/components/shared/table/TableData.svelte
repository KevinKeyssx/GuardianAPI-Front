<script lang="ts">
    import CheckIcon        from '@/icons/CheckIcon.svelte';
    import NoCheckIcon      from '@/icons/NoCheckIcon.svelte';
    import noneIcon         from '@/assets/icons/none.svg?raw';
    import userIcon         from '@/assets/icons/user.svg?url';
    import { CLIENT_ENV }   from '@/lib/env/client';

    type Value = string | number | boolean | null;

    export let value        : Value | undefined = undefined;
    export let color        : string    = 'text-white';
    export let py           : string    = 'py-4';
    export let px           : string    = 'px-6';
    export let size         : string    = 'text-sm';
    export let className    : string    = '';
    export let float        : boolean   = false;
    export let isImg        : boolean   = false;

    let imageError = false;

    const getImageUrl       = ( imagePath: string ): string => `${CLIENT_ENV.PUBLIC_FILE_UPLOAD_URL}${imagePath}`;
    const handleImageError  = () => imageError = true;

    $: if ( value ) {
        imageError = false;
    }
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
    {:else if value === null}
        {#if isImg}
            <img
                src   = { userIcon }
                alt   = { 'Avatar' }
                class = "w-8 h-8 rounded-full ml-5"
            />
        {:else}
            {@html noneIcon}
        {/if}
    {:else if isImg && typeof value === 'string'}
        {#if imageError}
            <img
                src   = { userIcon }
                alt   = { 'Avatar fallback' }
                class = "w-8 h-8 rounded-full mx-auto"
            />
        {:else}
            <img 
                src         = { getImageUrl( value )}
                alt         = { value }
                class       = "w-8 h-8 rounded-full mx-auto"
                on:error    = { handleImageError }
            />
        {/if}
    {:else}
        <span>{ value }</span>
    {/if}
</td>
