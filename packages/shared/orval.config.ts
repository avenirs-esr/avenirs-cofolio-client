import { fileURLToPath } from 'node:url'
import { defineConfig } from 'orval'
import { AVENIR_ESR_ORVAL_OVERRIDE } from './orval/avenir-esr'

export default defineConfig({
  'avenir-esr': {
    input: {
      target: fileURLToPath(new URL('./api/specs/avenir-esr.swagger.json', import.meta.url)),
    },
    output: {
      workspace: fileURLToPath(new URL('./src/api/avenir-esr/generated/', import.meta.url)),
      target: './',
      client: 'vue-query',
      httpClient: 'fetch',
      schemas: './types',
      mode: 'tags',
      clean: true,
      indexFiles: true,
      override: {
        ...AVENIR_ESR_ORVAL_OVERRIDE,
        mutator: {
          path: fileURLToPath(new URL('./src/api/avenir-esr/fetch-instance/fetch-instance.ts', import.meta.url)),
          name: 'sharedFetch',
        },
      },
    },
  },
})
