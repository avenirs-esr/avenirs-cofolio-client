import { fileURLToPath, URL } from 'node:url'
import { configDefaults, coverageConfigDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default ({ mode }: { mode: string }) => {
  const sharedExclusions = [
    'e2e/*',
    'a11y/*',
    '**/*types.ts',
    '**/*stub.ts',
    '**/*.stories.ts',
    'src/common/types/*',
    'src/api/**/generated/*',
    'orval.config.ts',
    'src/App.vue',
    'public/mockServiceWorker.js',
    'src/__mocks__/*',
    'storybook-static/*',
  ]

  // TODO: temporary exclusions due to use of @avenirs-esr/avenirs-dsav
  const tempExclusions = [
    'src/bootstrap.test.ts'
  ]

  const COVERAGE_THRESHOLD = 85
  return mergeConfig(
    viteConfig({ mode }),
    defineConfig({
      define: {
        __ENABLE_MSW__: true,
      },
      test: {
        globals: true,
        environment: 'jsdom',
        exclude: [...configDefaults.exclude, ...sharedExclusions, ...tempExclusions],
        root: fileURLToPath(new URL('./', import.meta.url)),
        setupFiles: [
          fileURLToPath(new URL('./vitest-setup.ts', import.meta.url)),
        ],
        coverage: {
          provider: 'v8',
          reporter: ['text', 'html'],
          exclude: [...coverageConfigDefaults.exclude, ...sharedExclusions, ...tempExclusions],
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
          'tests': fileURLToPath(new URL('./tests', import.meta.url)),
          '@avenirs-esr/avenirs-dsav': fileURLToPath(new URL('node_modules/@avenirs-esr/avenirs-dsav/dist/avenirs-dsav.es.js', import.meta.url)),
          'vue': fileURLToPath(new URL('./node_modules/vue', import.meta.url)),
          'vue-router': fileURLToPath(new URL('./node_modules/vue-router', import.meta.url)),
          '@vue/*': fileURLToPath(new URL('./node_modules/@vue/*', import.meta.url)),
        },
      },
    }),
  )
}
