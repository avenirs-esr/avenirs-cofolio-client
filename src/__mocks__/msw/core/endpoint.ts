import { BaseApiException } from '@/common/exceptions'
import { parseField, parseSchema, type Field, type Schema } from './fields'
import { createMockScenarioRegistry, type Compute, type ComputeFn, type Scenario } from './scenario'
import { FlatSource, JsonSource } from './source'
import { http, HttpMethods, HttpResponse, type DefaultBodyType } from 'msw'

type AnyField = Field<any>
type AnySchema = Record<string, AnyField>

type RequestDefinitionBase = {
  params?: AnySchema
  searchParams?: AnySchema
  headers?: AnySchema
  cookies?: AnySchema
}

/**
 * JSON body XOR multipart/form-data (mutually exclusive).
 * Use either `body` or `formData`, not both.
 */
export type RequestDefinition =
  | (RequestDefinitionBase & {
      body?: never
      formData?: never
    })
  | (RequestDefinitionBase & {
      body: AnyField
      formData?: never
    })
  | (RequestDefinitionBase & {
      body?: never
      formData: AnySchema
    })

/* Inference of input shape from definition */
type InferSchema<S> = S extends Schema<infer T> ? T : never
type InferField<F> = F extends Field<infer T> ? T : never

export type RequestInput<R extends RequestDefinition> =
  (R['params'] extends Schema<any>
    ? { params: InferSchema<R['params']> }
    : {}) &
  (R['searchParams'] extends Schema<any>
    ? { searchParams: InferSchema<R['searchParams']> }
    : {}) &
  (R['headers'] extends Schema<any>
    ? { headers: InferSchema<R['headers']> }
    : {}) &
  (R['cookies'] extends Schema<any>
    ? { cookies: InferSchema<R['cookies']> }
    : {}) &
  (R['body'] extends Field<any>
    ? { body: InferField<R['body']> }
    : {}) &
  (R['formData'] extends Schema<any>
    ? { formData: InferSchema<R['formData']> }
    : {})

/** Definition of a mock endpoint. */
export type MockEndpoint<
  R extends RequestDefinition,
  C,
  S extends Record<string, Scenario<RequestInput<R>, C>>
> = {
  readonly method: HttpMethods
  readonly path: string
  readonly request: R
  readonly compute?: ComputeFn<RequestInput<R>, C>
  readonly scenarios?: S
  handler: (input: RequestInput<R>, compute: Compute<C>) => HttpResponse<DefaultBodyType> | Promise<HttpResponse<DefaultBodyType>>
}

export type EndpointMap = Record<string, MockEndpoint<any, any, any>>
export type EndpointName<E extends EndpointMap> = keyof E & string

export function defineMockEndpoint<
  const R extends RequestDefinition,
  C = undefined,
  const S extends Record<string, Scenario<RequestInput<R>, C>> = Record<string, never>
>(config: MockEndpoint<R, C, S>): MockEndpoint<R, C, S> {
  return {
    ...config,
    request: (config.request ?? {}) as R,
    scenarios: (config.scenarios ?? {}) as S,
  }
}

export function defineMockEndpoints<const E extends Record<string, MockEndpoint<any, any, any>>>(
  endpoints: E
): E {
  return endpoints
}

/* MSW context for handlers */
type MswContext = {
  request: Request
  params: Record<string, string | readonly string[]>
  cookies: Record<string, string>
}

/** Extract and parse the request into a typed input object. */
async function extractRequest<R extends RequestDefinition>(
  definition: R,
  context: MswContext
): Promise<RequestInput<R>> {
  const input: Record<string, unknown> = {}

  if (definition.params) {
    input.params = parseSchema(definition.params as Schema<any>, FlatSource.fromParams(context.params), '')
  }
  if (definition.searchParams) {
    const url = new URL(context.request.url)
    input.searchParams = parseSchema(definition.searchParams as Schema<any>, FlatSource.fromSearchParams(url.searchParams), '')
  }
  if (definition.headers) {
    input.headers = parseSchema(definition.headers as Schema<any>, FlatSource.fromHeaders(context.request.headers), '')
  }
  if (definition.cookies) {
    input.cookies = parseSchema(definition.cookies as Schema<any>, FlatSource.fromCookies(context.cookies), '')
  }

  if (definition.body) {
    // JSON body expected
    let bodyData: unknown
    try {
      bodyData = context.request.body === null ? null : await context.request.json()
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      throw new Error(`Unable to read JSON body: ${msg}`)
    }
    if (bodyData === null) {
      // No body provided
      (input as any).body = (definition as any).body.missing('body')
    } else {
      // Parse body using JsonSource. We wrap in {body: ...} so that parseField can use 'body' as path
      (input as any).body = parseField(
        definition.body,
        new JsonSource({ body: bodyData }),
        'body'
      )
    }
  }

  if (definition.formData) {
    // Parse multipart/form-data
    let formData: FormData
    try {
      formData = context.request.body === null ? new FormData() : await context.request.formData()
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      throw new Error(`Unable to read FormData body: ${msg}`)
    }
    (input as any).formData = parseSchema(definition.formData as Schema<any>, FlatSource.fromFormData(formData), '')
  }

  return input as RequestInput<R>
}

/** Lazy-memoized compute accessor. */
function createComputeAccessor<Input, Context>(
  compute: ComputeFn<Input, Context> | undefined,
  input: Input
): Compute<Context> {
  let cache: Promise<Context> | undefined
  return () => {
    if (!cache) {
      cache = compute
        ? Promise.resolve(compute(input))
        : Promise.resolve(undefined as Context)
    }
    return cache
  }
}

/** Type alias for handlers returned by `http.get` etc. */
type MockHandler = ReturnType<typeof http.get>

/**
 * Create MSW handlers from defined endpoints and a scenario registry.
 */
export function createMockHandlers<const E extends EndpointMap>(
  endpoints: E,
  scenarios: ReturnType<typeof createMockScenarioRegistry<E>>
): MockHandler[] {
  return (Object.entries(endpoints) as [keyof E & string, E[keyof E & string]][])
    .map(([name, endpoint]) => {
      const resolver = async (context: MswContext) => {
        const input = await extractRequest(endpoint.request, context)
        const compute = createComputeAccessor(endpoint.compute, input)
        const scenarioFn = scenarios.consume(name)
        try {
          const response = scenarioFn
            ? await scenarioFn(input, compute)
            : await endpoint.handler(input, compute)
          return response
        } catch (error) {
          if (BaseApiException.isBaseApiError(error)) {
            // Convert to HttpResponse with JSON error body and appropriate status
            return HttpResponse.json(
              {
                message: error.message,
                code: error.code,
                details: error.details,
              },
              { status: error.status }
            )
          }
          // For other errors, rethrow so MSW can handle or log
          throw error
        }
      }

      switch (endpoint.method) {
        case 'GET':    return http.get(endpoint.path, resolver)
        case 'POST':   return http.post(endpoint.path, resolver)
        case 'PUT':    return http.put(endpoint.path, resolver)
        case 'PATCH':  return http.patch(endpoint.path, resolver)
        case 'DELETE': return http.delete(endpoint.path, resolver)
        case 'OPTIONS':return http.options(endpoint.path, resolver)
        case 'HEAD':   return http.head(endpoint.path, resolver)
        default:
          // Unreachable if HttpMethod is correct, but added for type safety
          throw new Error(`Unsupported HTTP method: ${endpoint.method}`)
      }
    })
}

/** Create environment with handlers and scenario registry. */
export function createMockEnvironment<const E extends EndpointMap>(endpoints: E) {
  const scenarios = createMockScenarioRegistry(endpoints)
  const handlers = createMockHandlers(endpoints, scenarios)
  return { endpoints, scenarios, handlers }
}
