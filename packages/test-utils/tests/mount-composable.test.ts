import type { MountComposableDependencies, MountComposableOptions } from '@avenirs-esr/test-utils/unit'
import type { QueryClientConfig } from '@tanstack/vue-query'
import type { App } from 'vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createMountComposable } from '@avenirs-esr/test-utils/unit'
import { QueryClient, useQueryClient, VUE_QUERY_CLIENT } from '@tanstack/vue-query'
import { createPinia, defineStore, getActivePinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { getCurrentInstance, inject, onMounted, onUnmounted, shallowRef } from 'vue'
import { createI18n, useI18n } from 'vue-i18n'

const unmounts: (() => void)[] = []

function track<T> (mounted: { result: T, unmount: () => void }) {
  unmounts.push(mounted.unmount)
  return mounted
}

function createTestI18n () {
  return createI18n({
    legacy: false,
    locale: 'fr',
    messages: { fr: { greeting: 'Bonjour' } },
  })
}

const useCounter = defineStore('mount-composable-counter', {
  state: () => ({ count: 0, origin: 'default' }),
})

afterEach(() => {
  unmounts.splice(0).forEach(unmount => unmount())
  setActivePinia(undefined)
  vi.restoreAllMocks()
})

BddTest().given('the shared composable mounting factory', () => {
  BddTest().when('the factory is initialized without mounting a composable', () => {
    const createTestPinia = vi.fn(createPinia)
    const i18n = createTestI18n()
    const install = vi.spyOn(i18n, 'install')
    const createElement = vi.spyOn(document, 'createElement')
    const previousPinia = createPinia()
    let mountComposable: ReturnType<typeof createMountComposable>

    beforeEach(() => {
      setActivePinia(previousPinia)
      mountComposable = createMountComposable({ i18n, createTestPinia })
    })

    BddTest().then('it does not mount an app or create Pinia or install i18n eagerly', () => {
      expect(mountComposable).toBeTypeOf('function')
      expect(createElement).not.toHaveBeenCalled()
      expect(createTestPinia).not.toHaveBeenCalled()
      expect(install).not.toHaveBeenCalled()
      expect(getActivePinia()).toBe(previousPinia)
    })
  })

  for (const options of [
    {},
    { useI18n: false, usePinia: false, useTanstack: false },
    { useI18n: true, usePinia: false, useTanstack: false },
    { useI18n: false, usePinia: true, useTanstack: false },
    { useI18n: false, usePinia: false, useTanstack: true },
    { useI18n: true, usePinia: true, useTanstack: false },
    { useI18n: true, usePinia: false, useTanstack: true },
    { useI18n: false, usePinia: true, useTanstack: true },
    { useI18n: true, usePinia: true, useTanstack: true },
  ] satisfies MountComposableOptions[]) {
    BddTest().when(`mounted with ${JSON.stringify(options)}`, () => {
      const i18n = createTestI18n()
      const createTestPinia = vi.fn(createPinia)
      const previousPinia = createPinia()
      const fn = vi.fn(() => ({
        pinia: getActivePinia(),
        queryClient: inject<QueryClient | null>(VUE_QUERY_CLIENT, null),
        translate: getCurrentInstance()?.appContext.config.globalProperties.$t,
      }))
      let mounted: { result: ReturnType<typeof fn>, unmount: () => void }

      beforeEach(() => {
        fn.mockClear()
        createTestPinia.mockClear()
        setActivePinia(previousPinia)
        mounted = track(createMountComposable({ i18n, createTestPinia })(fn, options))
      })

      BddTest().then('it runs in setup with exactly the enabled real plugins', () => {
        const flags: MountComposableOptions = options
        expect(fn).toHaveBeenCalledOnce()
        expect(mounted.result).toBe(fn.mock.results[0].value)
        expect(mounted.result.queryClient instanceof QueryClient).toBe(flags.useTanstack ?? false)
        expect(typeof mounted.result.translate === 'function').toBe(flags.useI18n ?? false)
        expect(createTestPinia).toHaveBeenCalledTimes(flags.usePinia ? 1 : 0)
        if (flags.usePinia) {
          expect(mounted.result.pinia).toBe(createTestPinia.mock.results[0].value)
        }
        else {
          expect(mounted.result.pinia).toBe(previousPinia)
        }
      })
    })
  }

  BddTest().when('a composable returns a reactive result and registers lifecycle hooks', () => {
    const mountedHook = vi.fn()
    const unmountedHook = vi.fn()
    const value = shallowRef('result')
    const fn = vi.fn(() => {
      onMounted(mountedHook)
      onUnmounted(unmountedHook)
      return value
    })
    let mounted: { result: typeof value, unmount: () => void }

    beforeEach(() => {
      fn.mockClear()
      mountedHook.mockClear()
      unmountedHook.mockClear()
      mounted = createMountComposable({ i18n: createTestI18n() })(fn, {})
    })

    afterEach(() => {
      if (unmountedHook.mock.calls.length === 0) {
        mounted.unmount()
      }
    })

    BddTest().then('it returns the original result after mounting without unmounting it', () => {
      expect(mounted.result).toBe(value)
      expect(mountedHook).toHaveBeenCalledOnce()
      expect(unmountedHook).not.toHaveBeenCalled()
    })

    BddTest().and('the caller unmounts the app explicitly', () => {
      beforeEach(() => {
        mounted.unmount()
      })

      BddTest().then('it runs the composable unmount hook', () => {
        expect(unmountedHook).toHaveBeenCalledOnce()
      })
    })
  })

  BddTest().when('a composable returns undefined', () => {
    const fn = vi.fn(() => undefined)
    let mounted: { result: undefined, unmount: () => void }

    beforeEach(() => {
      mounted = track(createMountComposable({ i18n: createTestI18n() })(fn, {}))
    })

    BddTest().then('it preserves undefined as the result', () => {
      expect(mounted.result).toBeUndefined()
    })
  })

  for (const scenario of [
    {
      label: 'omitted',
      config: undefined,
      expected: { queries: { retry: false }, mutations: { retry: false } },
    },
    {
      label: 'custom',
      config: { defaultOptions: { queries: { retry: 3, staleTime: 1000 }, mutations: { retry: 2 } } },
      expected: { queries: { retry: 3, staleTime: 1000 }, mutations: { retry: 2 } },
    },
    { label: 'explicitly empty', config: {}, expected: {} },
  ] satisfies { label: string, config: QueryClientConfig | undefined, expected: object }[]) {
    BddTest().when(`the QueryClient configuration is ${scenario.label}`, () => {
      let first: QueryClient
      let second: QueryClient

      beforeEach(() => {
        const mountComposable = createMountComposable({ i18n: createTestI18n() })
        first = track(mountComposable(useQueryClient, { useTanstack: true, queryClientConfig: scenario.config })).result
        second = track(mountComposable(useQueryClient, { useTanstack: true, queryClientConfig: scenario.config })).result
        first.setQueryData(['first-only'], 'cached')
      })

      BddTest().then('it creates isolated clients and preserves configuration without merging defaults', () => {
        expect(first).not.toBe(second)
        expect(first.getDefaultOptions()).toEqual(scenario.expected)
        expect(second.getDefaultOptions()).toEqual(scenario.expected)
        expect(second.getQueryData(['first-only'])).toBeUndefined()
      })
    })
  }

  BddTest().when('Pinia is enabled without an injected Pinia factory', () => {
    const fn = () => ({ store: useCounter(), pinia: getActivePinia(), app: getCurrentInstance()?.appContext.app })
    let first: ReturnType<typeof fn>
    let second: ReturnType<typeof fn>

    beforeEach(() => {
      const mountComposable = createMountComposable({ i18n: createTestI18n() })
      first = track(mountComposable(fn, { usePinia: true })).result
      second = track(mountComposable(fn, { usePinia: true })).result
    })

    BddTest().then('it creates a fresh active Pinia and Vue app for each mount', () => {
      expect(first.pinia).toBeDefined()
      expect(first.pinia).not.toBe(second.pinia)
      expect(first.store).not.toBe(second.store)
      expect(first.app).not.toBe(second.app)
      expect(second.pinia).toBe(getActivePinia())
      expect(second.store.origin).toBe('default')
    })
  })

  BddTest().when('all plugins use injected real i18n and a configured Pinia factory', () => {
    const i18n = createTestI18n()
    const observeInstall = vi.fn((app: App) => ({
      translate: app.config.globalProperties.$t('greeting'),
      queryClient: app._context.provides[VUE_QUERY_CLIENT],
    }))
    const createTestPinia = vi.fn(() => {
      const pinia = createPinia()
      const originalInstall = pinia.install
      pinia.install = (app: App) => {
        observeInstall(app)
        originalInstall(app)
      }
      pinia.use(({ store }) => {
        store.$state.origin = 'configured'
      })
      return pinia
    })
    const fn = () => ({
      translation: useI18n().t('greeting'),
      store: useCounter(),
      queryClient: useQueryClient(),
      app: getCurrentInstance()?.appContext.app,
    })
    let first: ReturnType<typeof fn>
    let second: ReturnType<typeof fn>

    beforeEach(() => {
      observeInstall.mockClear()
      createTestPinia.mockClear()
      const dependencies: MountComposableDependencies = { i18n, createTestPinia }
      const mountComposable = createMountComposable(dependencies)
      first = track(mountComposable(fn, { useI18n: true, usePinia: true, useTanstack: true })).result
      second = track(mountComposable(fn, { useI18n: true, usePinia: true, useTanstack: true })).result
    })

    BddTest().then('it uses the injected plugins and installs i18n before Pinia before TanStack', () => {
      expect(createTestPinia).toHaveBeenCalledTimes(2)
      expect(first.translation).toBe('Bonjour')
      expect(second.translation).toBe('Bonjour')
      expect(first.store.origin).toBe('configured')
      expect(second.store.origin).toBe('configured')
      expect(first.store).not.toBe(second.store)
      expect(first.app).not.toBe(second.app)
      expect(first.queryClient).not.toBe(second.queryClient)
      expect(observeInstall.mock.results.map(call => call.value)).toEqual([
        { translate: 'Bonjour', queryClient: undefined },
        { translate: 'Bonjour', queryClient: undefined },
      ])
    })
  })
})
