import { ENV } from '@/lib/utils/env';
import { QueryClient } from '@tanstack/svelte-query';
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

// export const graphqlClient = new GraphQLClient('http://localhost:3000/graphql', {
//     headers: () => ({
//         Authorization: `Bearer ${localStorage.getItem('jwt') || ''}`,
//     }),
// });


// export const graphqlClient = new GraphQLClient('http://localhost:3007/graphql', {
//     credentials: 'include', // Asegura que las cookies se envíen
// });

export const graphqlClient = new GraphQLClient(
    ENV.GUARDIANAPI_GRAPHQL_URL,
    {
        credentials: 'include',
        // headers: () => ({
        //     'X-CSRF-Token': localStorage.getItem('csrfToken') || '',
        // }),

        headers: () => ({
            'X-CSRF-Token': document.cookie
                .split('; ')
                .find((row) => row.startsWith('csrfToken='))
                ?.split('=')[1] || '',
        }),
    }
);



// <script lang="ts">
//   import { createQuery } from '@tanstack/svelte-query';
//   import { graphqlClient } from '$lib/query-client';
//   import { USERS_QUERY } from '$lib/queries';
//   import { goto } from '$app/navigation';

//   let selectedKeys = ['bio', 'location']; // Estado dinámico

//   const queryParams = {
//     page: 1,
//     each: 10,
//     field: 'createdAt',
//     orderBy: 'desc',
//     attributeKeys: selectedKeys, // Llaves dinámicas
//   };

//   const usersQuery = createQuery({
//     queryKey: ['users', queryParams],
//     queryFn: async () => {
//       return await graphqlClient.request(USERS_QUERY, queryParams);
//     },
//   });

//   // Actualizar llaves dinámicamente
//   function updateKeys(newKeys: string[]) {
//     selectedKeys = newKeys;
//   }

//   $: if ($usersQuery.isError && $usersQuery.error.message.includes('401')) {
//     goto('/signin');
//   }
// </script>

// <input
//   type="text"
//   on:input={(e) => updateKeys(e.target.value.split(','))}
// />
// {#if $usersQuery.isLoading}
//   <p>Loading...</p>
// {:else if $usersQuery.isError}
//   <p>Error: {$usersQuery.error.message}</p>
// {:else}
//   <ul>
//     {#each $usersQuery.data.users as user}
//       <li>
//         {user.name} ({user.email})
//         <ul>
//           {#each user.attributes as attr}
//             <li>{attr.key}: {attr.value}</li>
//           {/each}
//         </ul>
//       </li>
//     {/each}
//   </ul>
// {/if}