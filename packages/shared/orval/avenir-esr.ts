import type { OperationOptions, OverrideOutput } from 'orval'

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

export const AVENIR_ESR_ORVAL_OVERRIDE: OverrideOutput = {
  operations: {
    ...(FORCED_MUTATION_OPERATIONS.reduce<Record<string, OperationOptions>>((acc, operation) => {
      acc[operation] = {
        query: {
          useQuery: false,
          useMutation: true,
        },
      }
      return acc
    }, {})),
    ...(FORCED_QUERY_OPERATIONS.reduce<Record<string, OperationOptions>>((acc, operation) => {
      acc[operation] = {
        query: {
          useQuery: true,
          useMutation: false,
        },
      }
      return acc
    }, {})),
    searchExternalSkills: {
      query: {
        useInfinite: true,
      },
    },
  },
  fetch: {
    includeHttpResponseReturnType: false,
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
}
