import { defineConfig } from 'orval'

export default defineConfig({
  'avenir-esr': {
    input: {
      target: './api-specs/avenir-esr.swagger.json',
    },
    output: {
      workspace: './src/api/avenir-esr/generated',
      target: './',
      schemas: './types',
      client: 'fetch',
      mode: 'tags',
      clean: true,
      override: {
        fetch: {
          includeHttpResponseReturnType: false,
        },
        mutator: {
          path: './../fetch-instance/fetch-instance.ts',
          name: 'customFetch',
        },
        enumGenerationType: 'enum'
      },
    },
  },
})
