import { fileURLToPath, URL } from 'node:url'
import { configDefaults, coverageConfigDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default ({ mode }: { mode: string }) => {
  const sharedExclusions = [
    'e2e/*',
    'a11y/*',
    '**/*types.ts',
    '**/*.stories.ts',
    'src/common/types/*',
    'src/api/**/generated/*',
    'orval.config.ts',
    'src/App.vue',
    'public/mockServiceWorker.js'
  ]

  const COVERAGE_THRESHOLD = 85
  return mergeConfig(
    viteConfig({ mode }),
    defineConfig({
      define: {
        __ENABLE_MSW__: true,
      },
      test: {
        environment: 'jsdom',
        exclude: [...configDefaults.exclude, ...sharedExclusions],
        root: fileURLToPath(new URL('./', import.meta.url)),
        setupFiles: [
          fileURLToPath(new URL('./vitest-setup.ts', import.meta.url)),
        ],
        coverage: {
          provider: 'v8',
          reporter: ['text', 'html'],
          exclude: [...coverageConfigDefaults.exclude, ...sharedExclusions],
          thresholds: {
            branches: COVERAGE_THRESHOLD,
            functions: COVERAGE_THRESHOLD,
            lines: COVERAGE_THRESHOLD,
            statements: COVERAGE_THRESHOLD,
          },
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
