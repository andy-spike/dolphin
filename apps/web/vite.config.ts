import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [cloudflare({ viteEnvironment: { name: 'ssr' } }), tanstackStart(), tailwindcss(), viteReact()],
  environments: {
    ssr: {
      optimizeDeps: {
        include: ['react-dom/server'],
      },
    },
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
