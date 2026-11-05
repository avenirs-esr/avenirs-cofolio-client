import type { QueryClientConfig } from '@tanstack/vue-query'
import type { ComponentInternalInstance } from 'vue'
import type { AvRoute } from '@/common/types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createMountComposable } from '@avenirs-esr/shared/test-utils/unit'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { expect } from 'vitest'
import { i18n } from '@/plugins/vue-i18n/vue-i18n'

export function testRoute (route: AvRoute, expectedConfig: Partial<typeof route>, expectedComponent: unknown) {
  BddTest().given(`the route ${route.name}`, () => {
    BddTest().when('the route is built', () => {
      BddTest().then('it should have correct route config', () => {
        expect(route).toMatchObject({ ...expectedConfig, component: expect.any(Function) })
      })

      BddTest().then('it should dynamically import the component and match it', async () => {
        const componentLoader = route.component as () => Promise<{ default: unknown }>
        const componentModule = await componentLoader()
        expect(componentModule).toBeDefined()
        expect(componentModule.default).toBe(expectedComponent)
      })
    })
  })
}

export const mountComposable = createMountComposable({
  i18n,
  createTestPinia: () => createPinia().use(piniaPluginPersistedstate),
})

/**
 * Mounts a Vue composable configured to use TanStack Query in tests.
 *
 * @template T
 * @param {() => T} fn - Composable function to execute and mount.
 * @param {QueryClientConfig} [queryClientConfig] - Custom configuration of TanStack Query QueryClient.
 * @returns {T} The result returned by the mounted composable.
 */
export function mountQueryComposable<T> (fn: () => T, queryClientConfig?: QueryClientConfig): T {
  const { result } = mountComposable(fn, { useTanstack: true, queryClientConfig })
  return result
}

export interface ExposedComponentInstance {
  $: ComponentInternalInstance & {
    provides: Record<string | symbol, unknown>
  }
}
