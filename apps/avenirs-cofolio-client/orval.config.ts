import type { OperationOptions } from 'orval'
import { createRequire } from 'node:module'
import { defineConfig } from 'orval'

const FORCED_MUTATION_OPERATIONS = [
  'downloadAttachment',
  'downloadFeedbackAttachment',
  'downloadActivityFile',
  'downloadDraftFile',
  'downloadMedia',
]

const FORCED_QUERY_OPERATIONS = [
  'getLockedDeclaredActivities',
  'tracesView',
]

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
        operations: {
          ...(FORCED_MUTATION_OPERATIONS.reduce<Record<string, OperationOptions>>((acc, operation) => {
            acc[operation] = {
              query: {
                useQuery: false,
                useMutation: true,
              }
            }
            return acc
          }, {})),
          ...(FORCED_QUERY_OPERATIONS.reduce<Record<string, OperationOptions>>((acc, operation) => {
            acc[operation] = {
              query: {
                useQuery: true,
                useMutation: false,
              }
            }
            return acc
          }, {})),
          searchExternalSkills: {
            query: {
              useInfinite: true,
            }
          },
        },
        fetch: {
          includeHttpResponseReturnType: false,
        },
        mutator: {
          path: './../fetch-instance/fetch-instance.ts',
          name: 'customFetch',
        },
        enumGenerationType: 'enum',
        query: {
          useInfinite: false,
          usePrefetch: false,
          useInvalidate: true,
          useSetQueryData: false,
          useGetQueryData: false,
          signal: false,
          runtimeValidation: false,
        },
      },
    },
  }
})
