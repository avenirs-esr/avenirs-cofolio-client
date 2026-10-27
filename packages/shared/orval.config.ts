import type { Options, OutputOptions } from 'orval'
import { fileURLToPath } from 'node:url'

type SchemaOnlyOptions = Omit<Options, 'output'> & {
  output: Omit<OutputOptions, 'target'>
}

const config: Record<string, SchemaOnlyOptions> = {
  errors: {
    input: {
      target: fileURLToPath(new URL('./api/specs/avenir-esr.swagger.json', import.meta.url)),
      filters: {
        schemas: ['EErrorCode'],
        mode: 'include',
      },
      override: {
        transformer: spec => ({ ...spec, paths: {} }),
      },
    },
    output: {
      schemas: fileURLToPath(new URL('./src/api/generated/errors/', import.meta.url)),
      clean: true,
      indexFiles: false,
      override: {
        enumGenerationType: 'enum',
      },
    },
  },
}

export default config
