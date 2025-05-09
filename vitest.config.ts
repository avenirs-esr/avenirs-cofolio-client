import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      setupFiles: [
        fileURLToPath(new URL('./vitest-setup.ts', import.meta.url)),
      ],
      coverage: {
        enabled: true,
        provider: 'v8',
        reporter: ['text']
      },
    },
  }),
)
