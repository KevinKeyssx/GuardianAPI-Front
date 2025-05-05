<script lang="ts">
    import { QueryClientProvider } from '@tanstack/svelte-query';

    import { queryClient }      from '@/lib/graphql/query-client';
    import AttributesSection    from './AttributesSection.svelte';
</script>

<QueryClientProvider client={queryClient}>
    <AttributesSection />
</QueryClientProvider>
