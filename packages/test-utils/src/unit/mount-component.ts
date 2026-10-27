import type { QueryClientConfig } from '@tanstack/vue-query'
import type { ComponentMountingOptions } from '@vue/test-utils'
import type { Component, Plugin } from 'vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

export interface MountComponentOptions {
  useTanstack?: boolean
  usePinia?: boolean
  queryClientConfig?: QueryClientConfig
}

export function mountComponent<T extends Component> (
  component: T,
  mountOptions?: ComponentMountingOptions<T>,
  {
    useTanstack = true,
    usePinia = true,
    queryClientConfig = { defaultOptions: { queries: { retry: false }, mutations: { retry: false } } },
  }: MountComponentOptions = {},
) {
  const plugins: (Plugin | [Plugin, ...unknown[]])[] = []

  if (usePinia) {
    const pinia = createPinia()
    setActivePinia(pinia)
    plugins.push(pinia)
  }

  if (useTanstack) {
    const queryClient = new QueryClient(queryClientConfig)
    plugins.push([VueQueryPlugin, { queryClient }])
  }

  return mount(component, {
    ...mountOptions,
    global: {
      ...(mountOptions?.global ?? {}),
      plugins: [
        ...(mountOptions?.global?.plugins ?? []),
        ...plugins,
      ],
    },
  })
}
