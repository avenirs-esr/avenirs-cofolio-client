import { useToolsStore } from '#shared/stores/tools/tools.store'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect } from 'vitest'

BddTest().given('a tools store', () => {
  let store: ReturnType<typeof useToolsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useToolsStore()
  })

  BddTest().when('the store is initialized', () => {
    BddTest().then('it should provide local, regional and national tools pagination state', () => {
      expect(store.localToolsCurrentPage).toBeDefined()
      expect(store.regionalToolsCurrentPage).toBeDefined()
      expect(store.nationalToolsCurrentPage).toBeDefined()
    })

    BddTest().then('it should have default pagination values', () => {
      expect(store.localToolsCurrentPage).toBe(0)
      expect(store.regionalToolsCurrentPage).toBe(0)
      expect(store.nationalToolsCurrentPage).toBe(0)
    })

    BddTest().and('updating local tools pagination', () => {
      BddTest().then('it should allow updating local tools current page', () => {
        store.localToolsCurrentPage = 2

        expect(store.localToolsCurrentPage).toBe(2)
      })
    })

    BddTest().and('updating regional tools pagination', () => {
      BddTest().then('it should allow updating regional tools current page', () => {
        store.regionalToolsCurrentPage = 3

        expect(store.regionalToolsCurrentPage).toBe(3)
      })
    })

    BddTest().and('updating national tools pagination', () => {
      BddTest().then('it should allow updating national tools current page', () => {
        store.nationalToolsCurrentPage = 4

        expect(store.nationalToolsCurrentPage).toBe(4)
      })
    })
  })
})
