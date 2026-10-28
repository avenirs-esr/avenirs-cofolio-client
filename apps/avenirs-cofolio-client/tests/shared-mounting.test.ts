import type { QueryClient } from '@tanstack/vue-query'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent as sharedMountComponent, mountWithRouter as sharedMountWithRouter } from '@avenirs-esr/shared/test-utils/unit'
import { useQueryClient } from '@tanstack/vue-query'
import { defineStore } from 'pinia'
import { mountComponent, mountComposable, mountWithRouter } from 'tests/utils'
import { afterEach, beforeEach, expect } from 'vitest'
import { useI18n } from 'vue-i18n'
import { i18n } from '@/plugins/vue-i18n/vue-i18n'

const unmounts: (() => void)[] = []
const storeOptions = {
  state: () => ({ count: 0 }),
  persist: true
}
const useProbeStore = defineStore('shared-mounting-contract', storeOptions)
const readLocale = () => useI18n({ useScope: 'global' }).locale

afterEach(() => {
  unmounts.splice(0).forEach(unmount => unmount())
})

BddTest().given('the application mounting facades', () => {
  BddTest().then('mountComponent is the shared implementation', () => {
    expect(mountComponent).toBe(sharedMountComponent)
  })

  BddTest().then('mountWithRouter is the shared implementation', () => {
    expect(mountWithRouter).toBe(sharedMountWithRouter)
  })

  BddTest().when('i18n is enabled for a composable', () => {
    let locale: ReturnType<typeof readLocale>

    beforeEach(() => {
      const mounted = mountComposable(readLocale, { useI18n: true })
      locale = mounted.result
      unmounts.push(mounted.unmount)
    })

    BddTest().then('the application singleton provides the locale', () => {
      expect(locale).toBe(i18n.global.locale)
    })
  })

  BddTest().when('Pinia is enabled for a composable', () => {
    let store: ReturnType<typeof useProbeStore>

    beforeEach(() => {
      const mounted = mountComposable(useProbeStore, { usePinia: true })
      store = mounted.result
      unmounts.push(mounted.unmount)
    })

    BddTest().then('Cofolio keeps its persistence plugin', () => {
      expect(typeof Reflect.get(store, '$persist')).toBe('function')
    })
  })

  BddTest().when('two composables use Pinia', () => {
    let stores: [ReturnType<typeof useProbeStore>, ReturnType<typeof useProbeStore>]

    beforeEach(() => {
      const first = mountComposable(useProbeStore, { usePinia: true })
      const second = mountComposable(useProbeStore, { usePinia: true })
      stores = [first.result, second.result]
      unmounts.push(first.unmount, second.unmount)
    })

    BddTest().then('each mount owns a fresh store instance', () => {
      expect(stores[0]).not.toBe(stores[1])
    })
  })

  BddTest().when('two composables use TanStack Query', () => {
    let clients: [QueryClient, QueryClient]

    beforeEach(() => {
      const first = mountComposable(useQueryClient, { useTanstack: true })
      const second = mountComposable(useQueryClient, { useTanstack: true })
      clients = [first.result, second.result]
      unmounts.push(first.unmount, second.unmount)
    })

    BddTest().then('each mount owns a fresh query client', () => {
      expect(clients[0]).not.toBe(clients[1])
    })

    BddTest().then('query and mutation retries remain disabled', () => {
      expect(clients[0].getDefaultOptions()).toEqual({
        queries: { retry: false },
        mutations: { retry: false }
      })
    })
  })
})
