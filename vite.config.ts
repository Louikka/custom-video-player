import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';


// https://vite.dev/config/
export default defineConfig({
    plugins: [
        svelte({
            compilerOptions: {
                customElement: true,
            },
        }),
    ],
    build: {
        lib: {
            entry: './src/main.ts',
            name: 'VideoPlayer',
            formats: [ 'es', 'iife' ],
            fileName: 'video-player',
        },
        emptyOutDir: true,
    },
});
