import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect } from 'vitest'
import { useLocalToolsStore } from '@/features/staff/admin/stores/local-tools/local-tools.store'

BddTest().given('a local tools store', () => {
  let store: ReturnType<typeof useLocalToolsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useLocalToolsStore()
  })

  BddTest().when('the store is initialized', () => {
    BddTest().then('it should provide local and regional tools pagination state', () => {
      expect(store.localToolsCurrentPage).toBeDefined()
      expect(store.regionalToolsCurrentPage).toBeDefined()
    })

    BddTest().then('it should have default pagination values', () => {
      expect(store.localToolsCurrentPage).toBe(0)
      expect(store.regionalToolsCurrentPage).toBe(0)
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
  })
})
