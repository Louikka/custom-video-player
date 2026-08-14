import { defineConfig } from 'tsdown';
import Raw from 'unplugin-raw/rolldown';


export default defineConfig({
    entry: './src/main.ts',
    format: [
        'esm',
    ],
    dts: true,
    deps: {
        onlyBundle: false,
    },

    platform: 'browser',
    plugins: [
        Raw(),
    ],
});
