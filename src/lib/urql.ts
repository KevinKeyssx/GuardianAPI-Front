import { Client, cacheExchange, fetchExchange } from '@urql/svelte';
import { CLIENT_ENV } from '@/lib/env/client';


export const client = new Client({
    url             : CLIENT_ENV.PUBLIC_GUARDIANAPI_GRAPHQL_URL,
    exchanges       : [cacheExchange, fetchExchange],
    fetchOptions    : () => ({
        credentials : 'include',
        headers     : {
            'X-CSRF-Token': document.cookie
                .split( '; ' )
                .find(( row ) => row.startsWith( 'csrfToken=' ))
                ?.split( '=' )[1] || '',
        }
    })
});