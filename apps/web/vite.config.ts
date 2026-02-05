import { defineConfig, loadEnv } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
    // Capture PORT from shell BEFORE loadEnv (which might load PORT from .env)
    const shellPort = process.env.PORT;
    // Load env from root (../../)
    const env = loadEnv(mode, path.resolve(__dirname, "../../"), "");
    // PORT from shell environment takes highest priority
    const port = shellPort || env.PORT || "3000";
    const devtoolsPort = Number.isFinite(Number(port)) ? Number(port) + 10000 : 42069;
    process.env = { ...process.env, ...env };

    return {
        // Vite equivalent of Next.js transpilePackages for monorepo workspace packages
        optimizeDeps: {
            // Exclude workspace packages so they are compiled as source
            exclude: [
                '@suite/env',
                "@suite/auth",
                "@suite/shared",
            ],
        },
        build: {
            target: "esnext",
            minify: "esbuild",
            sourcemap: false,
            chunkSizeWarningLimit: 1000,
            rollupOptions: {
                external: [
                    // Externalize Cloudflare-specific modules
                    "cloudflare:workers",
                ],
            },
        },
        ssr: {
            noExternal: ["@suite/*"],
        },
        server: {
            port: Number(port),
            host: true,
            strictPort: true,
        },
        resolve: {
            alias: {
                "@suite/auth/server": path.resolve(__dirname, "../../packages/auth/src/server.ts"),
                "@suite/auth/client": path.resolve(__dirname, "../../packages/auth/src/client.ts"),
                "@suite/auth": path.resolve(__dirname, "../../packages/auth/src/index.ts"),
                "@suite/env/server": path.resolve(__dirname, "../../packages/env/src/server.ts"),
                "@suite/env/client": path.resolve(__dirname, "../../packages/env/src/client.ts"),
                "@suite/env/cloudflare": path.resolve(__dirname, "../../packages/env/src/cloudflare.ts"),
                "@suite/env": path.resolve(__dirname, "../../packages/env/src/index.ts"),
                "@suite/storage/db": path.resolve(__dirname, "../../packages/storage/src/db/index.ts"),
                "@suite/storage": path.resolve(__dirname, "../../packages/storage/src/index.ts"),
                "@suite/shared": path.resolve(__dirname, "../../packages/shared/src/index.ts"),
            },
        },
        plugins: [
            viteTsConfigPaths({
                projects: ['./tsconfig.json'],
            }),
            ...(process.env.SKIP_CLOUDFLARE !== 'true' ? [
                cloudflare({
                    viteEnvironment: { name: 'ssr' },
                    persist: true,
                })
            ] : []),
            devtools({
                eventBusConfig: {
                    port: devtoolsPort,
                },
            }),
            tailwindcss(),
            tanstackStart({
                srcDirectory: "src",
                start: { entry: "./start.tsx" },
                server: { entry: "./server.ts" },
            }),
            viteReact(),
            // Bundle analyzer (only in production builds when ANALYZE=true)
            process.env.ANALYZE === 'true' && visualizer({
                filename: './dist/stats.html',
                open: true,
                gzipSize: true,
                brotliSize: true,
                template: 'treemap',
            }),
        ].filter(Boolean),
    };
})
