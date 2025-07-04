import { i18n } from '@/plugins/vue-i18n/vue-i18n'
import { QueryClient, type QueryClientConfig, VueQueryPlugin } from '@tanstack/vue-query'
import { type ComponentMountingOptions, mount, RouterLinkStub } from '@vue/test-utils'
import { type Component, createApp } from 'vue'

/**
 * Options to configure the mounting of a composable under test.
 */
interface MountComposableOptions {
  /**
   * Enables the use of TanStack Query.
   * @default false
   */
  useTanstack?: boolean

  /**
   * Enables the i18n plugin configuration.
   * @default false
   */
  useI18n?: boolean

  /**
   * Enables the use of Pinia for the store.
   * @default false
   */
  usePinia?: boolean

  /**
   * Custom QueryClient configuration for TanStack Query.
   */
  queryClientConfig?: QueryClientConfig
}

/**
 * Mounts a Vue composable for testing with configuration options.
 *
 * @template T
 * @param {() => T} fn - Composable function to execute and mount.
 * @param {MountComposableOptions} options - Options to configure the mount.
 * @param {boolean} [options.useTanstack] - Enables the use of TanStack Query.
 * @param {boolean} [options.useI18n] - Enables the use of the i18n plugin.
 * @param {boolean} [options.usePinia] - Enables the use of Pinia for the store.
 * @param {QueryClientConfig} [options.queryClientConfig] - Custom configuration of TanStack Query QueryClient.
 * @returns {{ result: T, unmount: () => void }} An object containing the result of the composable and a function to unmount the application.
 */
function mountComposable<T> (fn: () => T, { useTanstack = false, useI18n = false, usePinia = false, queryClientConfig = {} }: MountComposableOptions): { result: T, unmount: () => void } {
  let composableResult: T | undefined
  const app = createApp({
    setup () {
      composableResult = fn()
      return () => null
    }
  })
  if (useI18n) {
    app.use(i18n)
  }
  if (usePinia) {
    const pinia = createPinia()
    setActivePinia(pinia)
    app.use(pinia)
  }
  const queryClient = new QueryClient(queryClientConfig)
  if (useTanstack) {
    app.use(VueQueryPlugin, { queryClient })
  }
  app.mount(document.createElement('div'))

  return {
    result: composableResult as T,
    unmount: () => app.unmount()
  }
}

/**
 * Mounts a Vue composable configured to use TanStack Query in tests.
 *
 * @template T
 * @param {() => T} fn - Composable function to execute and mount.
 * @param {QueryClientConfig} [queryClientConfig] - Custom configuration of TanStack Query QueryClient.
 * @returns {T} The result returned by the mounted composable.
 */
function mountQueryComposable<T> (fn: () => T, queryClientConfig?: QueryClientConfig): T {
  const { result } = mountComposable(fn, { useTanstack: true, queryClientConfig })
  return result
}

/**
 * Mounts a Vue component with a mock router for testing.
 *
 * This function uses Vue Test Utils to mount the component by injecting
 * stubs for `RouterLink` and `RouterView` to simulate the router behavior
 * without launching a real instance.
 *
 * @template T
 * @param {Component} component - Vue component to mount.
 * @param {ComponentMountingOptions<T>} [options] - Additional options for mounting the component.
 * @returns {Promise<ReturnType<typeof mount>>} The mounted component wrapper, after the next tick.
 */
async function mountWithRouter<T> (component: Component, options?: ComponentMountingOptions<T>) {
  const wrapper = mount(component, {
    ...options,
    global: {
      ...(options?.global ?? {}),
      stubs: {
        RouterLink: RouterLinkStub,
        RouterView: {
          name: 'RouterView',
          template: '<div class="router-view-stub"><slot /></div>'
        },
        ...(options?.global?.stubs ?? {})
      },
    },
  })

  await wrapper.vm.$nextTick()
  return wrapper
}

export {
  mountComposable,
  mountQueryComposable,
  mountWithRouter,
}
