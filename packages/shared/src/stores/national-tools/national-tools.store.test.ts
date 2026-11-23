import { useNationalToolsStore } from '#shared/stores/national-tools/national-tools.store'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect } from 'vitest'

BddTest().given('a national tools store', () => {
  let store: ReturnType<typeof useNationalToolsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useNationalToolsStore()
  })

  BddTest().when('the store is initialized', () => {
    BddTest().then('it should provide national tools pagination state', () => {
      expect(store.nationalToolsCurrentPage).toBeDefined()
    })

    BddTest().then('it should have default national tools pagination values', () => {
      expect(store.nationalToolsCurrentPage).toBe(0)
    })

    BddTest().and('updating national tools pagination', () => {
      BddTest().then('it should allow updating national tools current page', () => {
        store.nationalToolsCurrentPage = 2

        expect(store.nationalToolsCurrentPage).toBe(2)
      })
    })
  })
})
