import { defineConfig } from 'vite';
import minifyHTML from '@lit-labs/rollup-plugin-minify-html-literals';
import dts from 'unplugin-dts/vite';


// https://vite.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: './src/index.ts',
            fileName: 'index',
            name: 'VideoPlayer',
            formats: [
                'es',
                'iife',
            ],
        },
        emptyOutDir: true,
    },
    plugins: [
        minifyHTML(),
        dts({
            //bundleTypes: true,
        }),
    ],
});
