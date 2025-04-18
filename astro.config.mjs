// @ts-check
import auth             from 'auth-astro';
import { defineConfig } from 'astro/config';
import tailwind         from '@astrojs/tailwind';
import react            from '@astrojs/react';
import svelte           from '@astrojs/svelte';
import node             from '@astrojs/node';
import dotenv           from 'dotenv';

dotenv.config();

export default defineConfig({
    output: 'server',
    integrations: [tailwind(), react(), svelte(), auth()],
    adapter: node({
        mode: 'standalone',
    }),
    experimental: {
        session: true
    }
});