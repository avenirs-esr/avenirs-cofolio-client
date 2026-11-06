import { createRequire } from 'node:module'
import { AVENIR_ESR_ORVAL_OVERRIDE } from '@avenirs-esr/shared/orval'
import { defineConfig } from 'orval'

export default defineConfig({
  'avenir-esr': {
    input: {
      target: createRequire(import.meta.url).resolve('@avenirs-esr/shared/api/specs/avenir-esr.swagger.json'),
    },
    output: {
      workspace: './src/api/avenir-esr/generated',
      target: './',
      client: 'vue-query',
      schemas: './types',
      mode: 'tags',
      clean: true,
      override: {
        ...AVENIR_ESR_ORVAL_OVERRIDE,
        mutator: {
          path: './../fetch-instance/fetch-instance.ts',
          name: 'customFetch',
        },
      },
    },
  }
})
