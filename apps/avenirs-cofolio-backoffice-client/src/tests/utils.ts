import type { QueryClientConfig } from '@tanstack/vue-query'
import type { ComponentInternalInstance } from 'vue'
import { createMountComposable } from '@avenirs-esr/shared/test-utils/unit'
import { i18n } from '@/plugins/vue-i18n/vue-i18n'

export { createMountComposable, mountComponent, mountWithRouter } from '@avenirs-esr/shared/test-utils/unit'

export const mountComposable = createMountComposable({ i18n })

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
