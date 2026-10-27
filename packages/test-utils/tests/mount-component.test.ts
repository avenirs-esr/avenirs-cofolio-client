import type { MountComponentOptions } from '@avenirs-esr/test-utils/unit'
import type { QueryClient } from '@tanstack/vue-query'
import type { VueWrapper } from '@vue/test-utils'
import type { App, Plugin } from 'vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/test-utils/unit'
import { useQueryClient, VUE_QUERY_CLIENT } from '@tanstack/vue-query'
import { enableAutoUnmount } from '@vue/test-utils'
import { createPinia, defineStore, getActivePinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { defineComponent, getCurrentInstance, h, inject } from 'vue'

enableAutoUnmount(afterEach)

afterEach(() => {
  setActivePinia(undefined)
})

const useCounter = defineStore('mount-component-counter', {
  state: () => ({ count: 0 }),
})

BddTest().given('the shared component mounting engine', () => {
  BddTest().when('a component is mounted twice with omitted options', () => {
    const observe = vi.fn(() => ({
      pinia: getActivePinia(),
      store: useCounter(),
      queryClient: useQueryClient(),
      globals: getCurrentInstance()?.appContext.config.globalProperties,
    }))
    const Component = defineComponent({
      setup () {
        observe()
        return () => h('div', 'mounted')
      },
    })
    let first: VueWrapper
    let second: VueWrapper

    beforeEach(() => {
      observe.mockClear()
      first = mountComponent(Component)
      second = mountComponent(Component)
    })

    BddTest().then('it mounts synchronously with fresh active Pinia and QueryClient instances', () => {
      const [firstCall, secondCall] = observe.mock.results
      expect(first.text()).toBe('mounted')
      expect(second.exists()).toBe(true)
      expect(firstCall.value.pinia).toBeDefined()
      expect(secondCall.value.pinia).toBe(getActivePinia())
      expect(firstCall.value.pinia).not.toBe(secondCall.value.pinia)
      expect(firstCall.value.store).not.toBe(secondCall.value.store)
      expect(firstCall.value.queryClient).not.toBe(secondCall.value.queryClient)
      expect(firstCall.value.queryClient.getDefaultOptions()).toEqual({
        queries: { retry: false },
        mutations: { retry: false },
      })
      expect(firstCall.value.globals?.$t).toBeUndefined()
    })
  })

  for (const flags of [
    { usePinia: false, useTanstack: false },
    { usePinia: true, useTanstack: false },
    { usePinia: false, useTanstack: true },
    { usePinia: true, useTanstack: true },
  ] satisfies MountComponentOptions[]) {
    BddTest().when(`Pinia is ${flags.usePinia} and TanStack is ${flags.useTanstack}`, () => {
      const observe = vi.fn(() => ({
        pinia: getActivePinia(),
        queryClient: inject<QueryClient | null>(VUE_QUERY_CLIENT, null),
      }))
      const Component = defineComponent({
        setup () {
          observe()
          return () => h('div')
        },
      })
      const previousPinia = createPinia()

      beforeEach(() => {
        observe.mockClear()
        setActivePinia(previousPinia)
        mountComponent(Component, {}, flags)
      })

      BddTest().then('it installs only enabled plugins and leaves an existing Pinia active when disabled', () => {
        const { pinia, queryClient } = observe.mock.results[0].value
        if (flags.usePinia) {
          expect(pinia).toBeDefined()
          expect(pinia).not.toBe(previousPinia)
        }
        else {
          expect(pinia).toBe(previousPinia)
        }
        expect(queryClient !== null).toBe(flags.useTanstack)
      })
    })
  }

  BddTest().when('caller mount options and plugins are supplied', () => {
    const install = vi.fn((app: App, value: unknown) => {
      app.provide('caller', value)
      return Object.keys(app._context.provides)
    })
    const plugin: Plugin<[string]> = { install }
    const observe = vi.fn(() => ({
      caller: inject('caller'),
      provided: inject('provided'),
      store: useCounter(),
      queryClient: useQueryClient(),
    }))
    const Component = defineComponent({
      props: { label: { type: String, required: true } },
      setup () {
        observe()
      },
      template: '<section>{{ label }} {{ $custom }}<Child /><slot /></section>',
    })
    let wrapper: ReturnType<typeof mountComponent<typeof Component>>
    const mountOptions = {
      props: { label: 'label' },
      attrs: { 'data-testid': 'mounted-component' },
      slots: { default: '<span>slot</span>' },
      global: {
        plugins: [[plugin, 'caller-value'] as [typeof plugin, string]],
        provide: { provided: 'provided-value' },
        mocks: { $custom: 'mock-value' },
        stubs: { Child: { template: '<b>child</b>' } },
      },
    }

    beforeEach(() => {
      observe.mockClear()
      install.mockClear()
      wrapper = mountComponent(Component, mountOptions, {
        queryClientConfig: {
          defaultOptions: {
            queries: { retry: 4, staleTime: 1200 },
            mutations: { retry: 2 },
          },
        },
      })
    })

    BddTest().then('it preserves component and global options without changing the caller options', () => {
      expect(wrapper.props('label')).toBe('label')
      expect(wrapper.attributes('data-testid')).toBe('mounted-component')
      expect(wrapper.text()).toBe('label mock-valuechildslot')
      expect(observe.mock.results[0].value.caller).toBe('caller-value')
      expect(observe.mock.results[0].value.provided).toBe('provided-value')
      expect(mountOptions.global.plugins).toHaveLength(1)
      expect(Object.keys(mountOptions.global.stubs)).toEqual(['Child'])
    })

    BddTest().then('it installs caller plugins before generated plugins and forwards QueryClient configuration', () => {
      expect(install).toHaveBeenCalledOnce()
      expect(install.mock.results[0].value).not.toContain(VUE_QUERY_CLIENT)
      expect(observe.mock.results[0].value.store).toBeDefined()
      expect(observe.mock.results[0].value.queryClient.getDefaultOptions()).toEqual({
        queries: { retry: 4, staleTime: 1200 },
        mutations: { retry: 2 },
      })
    })
  })

  BddTest().when('an explicitly empty QueryClient configuration is supplied', () => {
    const observe = vi.fn(useQueryClient)
    const Component = defineComponent({
      setup () {
        observe()
        return () => null
      },
    })

    beforeEach(() => {
      observe.mockClear()
      mountComponent(Component, { global: {} }, { queryClientConfig: {} })
    })

    BddTest().then('it does not merge the default retry configuration into the caller configuration', () => {
      expect(observe.mock.results[0].value.getDefaultOptions()).toEqual({})
    })
  })
})
