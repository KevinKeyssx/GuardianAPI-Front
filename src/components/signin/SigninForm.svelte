<script lang="ts">
    import { onMount } from 'svelte';

    // import { setupAuthGithub }  from "../../lib/auth/github-auth";
    // import { setupAuthGoogle }  from "../../lib/auth/google-auth";
    import NeonButton           from "../buttons/NeonButton.svelte";


    // onMount(async () => {
    //     const { createAuthClient } = await import('better-auth/client');
    //     const authClient            = createAuthClient();
    //     const session               = await authClient.getSession();

    //     if (session?.data?.user) {
    //         console.log('User info:', session.data);
    //     } else {
    //         console.log('No active session');
    //     }
    // });
</script>

<div class="flex flex-col mb-6 items-center">
    <div class="flex items-center w-full mb-4">
        <hr class="w-full border-galaxy-blue">
        <span class="text-gray-300 mb-2 w-full flex justify-center">Sign in with</span>
        <hr class="w-full border-galaxy-blue">
    </div>

    <div class="grid grid-cols-2 xl:grid-cols-2 items-center gap-2 w-full">
        <!-- <NeonButton
            onClick={setupAuthGithub}
        >
            GitHub

            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><mask id="lineMdGithubLoop0" width="24" height="24" x="0" y="0"><g fill="#fff"><ellipse cx="9.5" cy="9" rx="1.5" ry="1"/><ellipse cx="14.5" cy="9" rx="1.5" ry="1"/></g></mask><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="32" stroke-dashoffset="32" d="M12 4c1.67 0 2.61 0.4 3 0.5c0.53 -0.43 1.94 -1.5 3.5 -1.5c0.34 1 0.29 2.22 0 3c0.75 1 1 2 1 3.5c0 2.19 -0.48 3.58 -1.5 4.5c-1.02 0.92 -2.11 1.37 -3.5 1.5c0.65 0.54 0.5 1.87 0.5 2.5c0 0.73 0 3 0 3M12 4c-1.67 0 -2.61 0.4 -3 0.5c-0.53 -0.43 -1.94 -1.5 -3.5 -1.5c-0.34 1 -0.29 2.22 0 3c-0.75 1 -1 2 -1 3.5c0 2.19 0.48 3.58 1.5 4.5c1.02 0.92 2.11 1.37 3.5 1.5c-0.65 0.54 -0.5 1.87 -0.5 2.5c0 0.73 0 3 0 3"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.7s" values="32;0"/></path><path stroke-dasharray="10" stroke-dashoffset="10" d="M9 19c-1.406 0-2.844-.563-3.688-1.188C4.47 17.188 4.22 16.157 3 15.5"><animate attributeName="d" dur="3s" repeatCount="indefinite" values="M9 19c-1.406 0-2.844-.563-3.688-1.188C4.47 17.188 4.22 16.157 3 15.5;M9 19c-1.406 0-3-.5-4-.5-.532 0-1 0-2-.5;M9 19c-1.406 0-2.844-.563-3.688-1.188C4.47 17.188 4.22 16.157 3 15.5"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="10;0"/></path></g><rect width="8" height="4" x="8" y="11" fill="currentColor" mask="url(#lineMdGithubLoop0)"><animate attributeName="y" dur="10s" keyTimes="0;0.45;0.46;0.54;0.55;1" repeatCount="indefinite" values="11;11;7;7;11;11"/></rect></svg>
        </NeonButton>

        <NeonButton
            onClick={setupAuthGoogle}
        >
            Google

            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.5265 19 18.4439 16.3923 18.9291 13H13C12.4477 13 12 12.5523 12 12C12 11.4477 12.4477 11 13 11H20C20.5523 11 21 11.4477 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.1424 3 16.1123 3.74979 17.6578 5.00041C18.0871 5.34782 18.1535 5.97749 17.8061 6.40682C17.4587 6.83615 16.829 6.90256 16.3997 6.55515C15.1972 5.58212 13.668 5 12 5Z" fill="#00e9f6" data-darkreader-inline-fill="" style="--darkreader-inline-fill: var(--darkreader-background-00e9f6, #00bac5);"></path> </g></svg>
        </NeonButton> -->
    </div>
</div>

<div class="flex items-center gap-2">
    <hr class="w-full border-galaxy-blue">
    <span class="text-gray-300 mb-2">Or</span>
    <hr class="w-full border-galaxy-blue">
</div>

<form class="space-y-6">
    <div>
        <label class="block text-gray-300 mb-2" for="email">Email</label>

        <input
            type="email"
            id="email"
            class="w-full px-4 py-2 bg-space-blue border border-neon-blue/30 rounded-lg focus:border-neon-blue focus:outline-none text-white"
            required
        />
    </div>

    <div>
        <label class="block text-gray-300 mb-2" for="password">Password</label>

        <input
            type="password"
            id="password"
            class="w-full px-4 py-2 bg-space-blue border border-neon-blue/30 rounded-lg focus:border-neon-blue focus:outline-none text-white"
            required
        />
    </div>

    <button
        type="submit"
        class="w-full bg-neon-blue text-dark-blue font-bold py-3 rounded-lg hover:bg-opacity-80 transition-all duration-300"
    >
        Sign In
    </button>

    <!-- <ShinyButton/> -->
<!-- <SpaceButton /> -->
</form>