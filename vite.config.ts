import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import netlify from '@netlify/vite-plugin-tanstack-start'

const config = defineConfig({
  plugins: [
    devtools(),
    netlify(),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart({
      router: {
        // Keep *.test.tsx out of the generated route tree — src/routes holds
        // both route files and their colocated tests.
        routeFileIgnorePattern: '\\.test\\.',
      },
    }),
    viteReact(),
  ],
})

export default config
