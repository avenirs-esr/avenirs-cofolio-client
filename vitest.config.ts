import { fileURLToPath, URL } from 'node:url'
import { configDefaults, coverageConfigDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default ({ mode }: { mode: string }) => {
  return mergeConfig(
    viteConfig({ mode }),
    defineConfig({
      test: {
        environment: 'jsdom',
        exclude: [...configDefaults.exclude, 'e2e/*', 'a11y/*'],
        root: fileURLToPath(new URL('./', import.meta.url)),
        setupFiles: [
          fileURLToPath(new URL('./vitest-setup.ts', import.meta.url)),
        ],
        coverage: {
          enabled: true,
          provider: 'v8',
          reporter: ['text', 'html'],
          exclude: ['**/index.ts', ...coverageConfigDefaults.exclude, 'a11y/*', 'src/App.vue'],
        },
      },
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
          'tests': fileURLToPath(new URL('./tests', import.meta.url))
        },
        dedupe: ['vue'],
      },
    }),
  )
}
