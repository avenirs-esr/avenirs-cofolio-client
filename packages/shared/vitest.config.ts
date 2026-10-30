import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    root: fileURLToPath(new URL('./', import.meta.url)),
    projects: [
      {
        extends: true,
        test: {
          name: 'runtime',
          environment: 'node',
          include: ['src/**/*.test.ts'],
          exclude: ['src/ui/**/*.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'test-utils',
          environment: 'jsdom',
          include: ['test-utils/**/*.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'ui',
          environment: 'jsdom',
          setupFiles: [
            fileURLToPath(new URL('./vitest-setup.ts', import.meta.url)),
          ],
          include: ['src/ui/**/*.test.ts'],
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: ['src/**/*.{ts,vue}', 'test-utils/**/*.ts'],
      exclude: ['**/*.test.ts', 'src/api/generated/**', 'src/api/fetch/types.ts', 'src/exceptions/types.ts'],
      thresholds: {
        branches: 85,
        functions: 85,
        lines: 85,
        statements: 85,
      },
    },
  },
})
