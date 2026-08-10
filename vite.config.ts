import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import dts from 'unplugin-dts/vite';


// https://vite.dev/config/
export default defineConfig({
    plugins: [
        svelte(),
        dts({
            bundleTypes: true,
            tsconfigPath: './tsconfig.app.json',
        }),
    ],
    build: {
        lib: {
            entry: './src/main.ts',
            name: 'VideoPlayer',
            formats: [
                'es',
                'iife',
            ],
            fileName: 'video-player',
        },
        emptyOutDir: true,
    },
});
