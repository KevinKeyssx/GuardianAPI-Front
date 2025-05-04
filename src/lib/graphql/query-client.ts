import {
    QueryClient,
    QueryClientProvider
}                           from '@tanstack/svelte-query';
import { GraphQLClient }    from 'graphql-request';

import { CLIENT_ENV } from '@/lib/env/client';


export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry                   : 2, // Reintentar 2 veces en caso de error
            staleTime               : 1000 * 60 * 5, // 5 minutos de caché
            refetchOnWindowFocus    : false, // No recargar al enfocar la ventana
        },
    },
});

export const graphqlClient = new GraphQLClient(
    CLIENT_ENV.PUBLIC_GUARDIANAPI_GRAPHQL_URL,
    {
        credentials: 'include',

        headers: () => ({
            'X-CSRF-Token': document.cookie
                .split( '; ' )
                .find(( row ) => row.startsWith( 'csrfToken=' ))
                ?.split( '=' )[1] || '',
        }),
    }
);

export { QueryClientProvider };