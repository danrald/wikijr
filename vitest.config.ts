import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import viteReact from '@vitejs/plugin-react'

// Deliberately separate from vite.config.ts: the app config loads
// @tanstack/react-start, which uses Vite's multi-environment API (separate
// client/SSR module graphs). Reusing it here makes React get loaded into two
// environments at once, which Vitest/Testing Library see as "duplicate"
// React copies ("Invalid hook call") even though only one is on disk.
export default defineConfig({
  plugins: [tsconfigPaths({ projects: ['./tsconfig.json'] }), viteReact()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
})
