import type { EndpointMap } from "@/__mocks__/msw/core/endpoint"
import type { DefaultBodyType, HttpResponse } from "msw"

/**
 * Fonction de calcul partagé, déclarée une fois sur l'endpoint.
 *
 * Reçoit le `input` déjà parsé (params/searchParams/body/...)
 * et retourne une valeur dérivée quelconque (liste filtrée,
 * total, etc.), réutilisable par le handler ET les scénarios.
 */
export type ComputeFn<Input, Context> = (input: Input) => Context | Promise<Context>

/**
 * Accesseur paresseux et mémoïsé reçu par le handler / les scénarios.
 *
 * N'exécute la `ComputeFn` que si elle est réellement appelée,
 * et jamais plus d'une fois par requête.
 */
export type Compute<Context> = () => Promise<Context>
export type Scenario<TInput, TContext = undefined> = (input: TInput, compute: Compute<TContext>) => HttpResponse<DefaultBodyType> | Promise<HttpResponse<DefaultBodyType>>
export type ScenarioNames<E> = E extends { readonly scenarios: infer S } ? keyof S & string : never

type EndpointName<E extends EndpointMap> = keyof E & string

export function createMockScenarioRegistry<const E extends EndpointMap>(endpoints: E) {
  const queues = new Map<EndpointName<E>, string[]>()

  function next<K extends EndpointName<E>>(endpoint: K, scenario: ScenarioNames<E[K]>): void {
    const definition = endpoints[endpoint]

    if (!definition) {
      throw new Error(`Unknown mock endpoint "${String(endpoint)}"`)
    }

    if (!Object.prototype.hasOwnProperty.call(definition.scenarios, scenario)) {
      const available = Object.keys(definition.scenarios)

      throw new Error(
        available.length
          ? `Unknown mock scenario "${String(scenario)} for endpoint "${String(endpoint)}". Available scenarios: ${available.join(', ')}`
          : `No scenarios are defined for endpoint "${String(endpoint)}".`
      )
    }

    const queue = queues.get(endpoint) ?? []

    queue.push(String(scenario))
    queues.set(endpoint, queue)
  }

  function consume<K extends EndpointName<E>>(endpoint: K): Scenario<any, any> | undefined {
    const queue = queues.get(endpoint)

    if (!queue || queue.length === 0) {
      return undefined
    }

    const scenarioName = queue.shift()!

    if (queue.length === 0) {
      queues.delete(endpoint)
    }

    return endpoints[endpoint].scenarios[scenarioName]
  }

  function reset<K extends EndpointName<E>>(endpoint: K): void {
    queues.delete(endpoint)
  }

  function resetAll(): void {
    queues.clear()
  }

  return {
    next,
    consume,
    reset,
    resetAll
  }
}
