// @ts-check
import auth             from 'auth-astro';
import { defineConfig } from 'astro/config';
import tailwind         from '@astrojs/tailwind';
import react            from '@astrojs/react';
import svelte           from '@astrojs/svelte';
import vercel           from '@astrojs/vercel';
import dotenv           from 'dotenv';

dotenv.config();

export default defineConfig({
    output: 'server',
    site: 'https://guardian-auth.vercel.app',
    compressHTML: true,
    prefetch: true,
    integrations: [
        tailwind(), 
        react(), 
        svelte(), 
        auth()
    ],
    adapter: vercel(),
    devToolbar: {
        enabled: false
    },
    vite: {
        ssr: {
            noExternal: ["path-to-regexp"],
        },
    },
});