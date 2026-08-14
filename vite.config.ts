import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';


// https://vite.dev/config/
export default defineConfig({
    plugins: [
        dts({
            bundleTypes: true,
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
