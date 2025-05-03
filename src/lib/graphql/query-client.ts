import { ENV } from '@/lib/utils/env';
import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
import { GraphQLClient } from 'graphql-request';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2, // Reintentar 2 veces en caso de error
            staleTime: 1000 * 60 * 5, // 5 minutos de caché
            refetchOnWindowFocus: false, // No recargar al enfocar la ventana
        },
    },
});

export const graphqlClient = new GraphQLClient(
    // ENV.GUARDIANAPI_GRAPHQL_URL,
    'http://localhost:3007/graphql',
    {
        credentials: 'include',

        headers: () => ({
            'X-CSRF-Token': document.cookie
                .split('; ')
                .find((row) => row.startsWith('csrfToken='))
                ?.split('=')[1] || '',
        }),
    }
);

export { QueryClientProvider };