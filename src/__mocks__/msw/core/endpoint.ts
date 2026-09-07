import { parseField, parseSchema, type Field, type Schema } from "@/__mocks__/msw/core/fields"
import { createMockScenarioRegistry, type Compute, type ComputeFn, type Scenario } from "@/__mocks__/msw/core/scenario"
import { FlatSource, JsonSource } from "@/__mocks__/msw/core/source"
import { http, type DefaultBodyType, type HttpResponse } from "msw"

export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS'
  | 'HEAD'

type AnyField = Field<any>
type AnySchema = Record<string, AnyField>

/* -------------------------------------------------------------------------- */
/*                             Request definition                             */
/* -------------------------------------------------------------------------- */

type RequestDefinitionBase = {
  params?: AnySchema
  searchParams?: AnySchema
  headers?: AnySchema
  cookies?: AnySchema
}

/**
 * JSON body OU multipart/form-data.
 *
 * Les deux ne peuvent pas être déclarés simultanément.
 */
export type RequestDefinition =
  | (
      RequestDefinitionBase & {
        body?: never
        formData?: never
      }
    )
  | (
      RequestDefinitionBase & {
        body: AnyField
        formData?: never
      }
    )
  | (
      RequestDefinitionBase & {
        body?: never
        formData: AnySchema
      }
    )

/* -------------------------------------------------------------------------- */
/*                             Input inference                                */
/* -------------------------------------------------------------------------- */

type InferSchema<S> = S extends Schema<infer T> ? T : never
type InferField<F> = F extends Field<infer T> ? T : never

export type RequestInput<R extends RequestDefinition> =
  (R['params'] extends Schema<any>
    ? {
        params: InferSchema<
          R['params']
        >
      }
    : {}) &
  (
    R['searchParams'] extends Schema<any>
      ? {
          searchParams:
            InferSchema<
              R['searchParams']
            >
        }
      : {}
  ) &
  (
    R['headers'] extends Schema<any>
      ? {
          headers:
            InferSchema<
              R['headers']
            >
        }
      : {}
  ) &
  (
    R['cookies'] extends Schema<any>
      ? {
          cookies:
            InferSchema<
              R['cookies']
            >
        }
      : {}
  ) &
  (
    R['body'] extends Field<any>
      ? {
          body: InferField<
            R['body']
          >
        }
      : {}
  ) &
  (
    R['formData'] extends Schema<any>
      ? {
          formData:
            InferSchema<
              R['formData']
            >
        }
      : {}
  )

/* -------------------------------------------------------------------------- */
/*                              Endpoint definition                           */
/* -------------------------------------------------------------------------- */

export type MockEndpoint<R extends RequestDefinition, C, S extends Record<string, Scenario<RequestInput<R>, C>>> = {
  readonly method: HttpMethod
  readonly path: string
  readonly request: R
  readonly compute?: ComputeFn<RequestInput<R>, C>
  readonly scenarios?: S
  readonly handler: (input: RequestInput<R>, compute: Compute<C>) => HttpResponse<DefaultBodyType> | Promise<HttpResponse<DefaultBodyType>>
}

export function defineMockEndpoint<const R extends RequestDefinition, C = undefined, const S extends Record<string, Scenario<RequestInput<R>, C>> = Record<string, never>>(config: MockEndpoint<R, C, S>): MockEndpoint<R, C, S> {
  return {
    ...config,
    request: (config.request ?? {}) as R,
    scenarios: (config.scenarios ?? {}) as S
  }
}

export function defineMockEndpoints<const E extends Record<string, MockEndpoint<any, any, any>>>(endpoints: E): E {
  return endpoints
}

export type EndpointMap = Record<string, MockEndpoint<any, any, any>>

/* -------------------------------------------------------------------------- */
/*                              MSW extraction                                */
/* -------------------------------------------------------------------------- */

type MswContext = {
  request: Request
  params: Record<string, string | readonly string[]>
  cookies: Record<string, string>
}

async function extractRequest<R extends RequestDefinition>(definition: R, context: MswContext): Promise<RequestInput<R>> {
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
    if (context.request.body === null) {
      input.body = definition.body.missing('body')
    } else {
      let body: unknown

      try {
        body = await context.request.json()
      } catch (error) {
        const message = error instanceof Error
          ? error.message
          : String(error)
        throw new Error(`Unable to read JSON body: ${message}`)
      }

      input.body = parseField(definition.body, new JsonSource({ body }), 'body')
    }
  }

  if (definition.formData) {
    let formData: FormData

    if (context.request.body === null) {
      formData = new FormData()
    } else {
      try {
        formData = await context.request.formData()
      } catch (error) {
        const message = error instanceof Error
          ? error.message
          : String(error)
        throw new Error(`Unable to read FormData body: ${message}`)
      }
    }

    input.formData = parseSchema(definition.formData as Schema<any>, FlatSource.fromFormData(formData), '')
  }

  return input as RequestInput<R>
}

/* -------------------------------------------------------------------------- */
/*                              Handler generation                            */
/* -------------------------------------------------------------------------- */

type MockHandler = ReturnType<typeof http.get>

/**
 * Construit l'accesseur passé au handler et aux scénarios.
 *
 * - Paresseux : `compute` (la fonction déclarée sur l'endpoint)
 *   n'est appelée que si l'accesseur retourné est lui-même appelé.
 * - Mémoïsé : plusieurs appels dans la même requête ne recalculent
 *   pas la valeur (utile si le handler ET le scénario y accèdent,
 *   ou si un même scénario y accède plusieurs fois).
 */
function createComputeAccessor<Input, Context>(compute: ComputeFn<Input, Context> | undefined, input: Input): Compute<Context> {
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

export function createMockHandlers<const E extends EndpointMap>(endpoints: E, scenarios: ReturnType<typeof createMockScenarioRegistry<E>>): MockHandler[] {
  const handlers = Object.entries(endpoints) as Array<[ keyof E & string, E[keyof E & string]]>
  return handlers.map(([name, endpoint]) => {
    const resolver = async (context: MswContext) => {
      const input = await extractRequest(endpoint.request, context)
      const compute = createComputeAccessor(endpoint.compute, input)
      const scenario = scenarios.consume(name)

      return scenario
        ? scenario(input, compute)
        : endpoint.handler(input, compute)
    }

    switch (endpoint.method) {
      case 'GET':
        return http.get(endpoint.path, resolver)
      case 'POST':
        return http.post(endpoint.path, resolver)
      case 'PUT':
        return http.put(endpoint.path, resolver)
      case 'PATCH':
        return http.patch(endpoint.path, resolver)
      case 'DELETE':
        return http.delete(endpoint.path, resolver)
      case 'OPTIONS':
        return http.options(endpoint.path, resolver)
      case 'HEAD':
        return http.head(endpoint.path, resolver)
    }
  })
}

/* -------------------------------------------------------------------------- */
/*                               Environment                                  */
/* -------------------------------------------------------------------------- */

export function createMockEnvironment<const E extends EndpointMap>(endpoints: E) {
  const scenarios = createMockScenarioRegistry(endpoints)
  const handlers = createMockHandlers(endpoints, scenarios)
  return {
    endpoints,
    scenarios,
    handlers,
  }
}
