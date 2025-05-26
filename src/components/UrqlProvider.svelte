<script lang="ts">
    import { setContext } from 'svelte';

    import { client } from '@/lib/urql';

    setContext( 'urqlClient', client );
</script>

<slot />
