<script lang="ts">
    import { QueryClientProvider } from '@tanstack/svelte-query';

    import RoleSection      from './RoleSection.svelte';
    import { queryClient }  from '@/lib/graphql/query-client';
</script>

<QueryClientProvider client={queryClient}>
    <RoleSection />
</QueryClientProvider>
