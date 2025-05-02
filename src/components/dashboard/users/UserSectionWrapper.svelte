<script lang="ts">
    import { QueryClientProvider } from '@tanstack/svelte-query';

    import UserSection      from '@/components/dashboard/users/UserSection.svelte';
    import { queryClient }  from '@/lib/graphql/query-client';
</script>

<QueryClientProvider client={queryClient}>
    <UserSection />
</QueryClientProvider>
