import { useAmsStore } from '@/store/ams/ams'
import { PageSizes } from '@/ui/config'
import { createPinia, setActivePinia } from 'pinia'
import { BddTest } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an ams store', () => {
  let store: ReturnType<typeof useAmsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAmsStore()
  })

  BddTest().when('the store is initialized', () => {
    BddTest().then('it should have the default props', () => {
      expect(store.currentPage).toBe(0)
      expect(store.pageSizeSelected).toBe(PageSizes.FOUR)
    })
  })

  BddTest().when('the props are updated', () => {
    BddTest().then('it should have the updated props', () => {
      const newCurrentPage = 1
      store.currentPage = newCurrentPage
      const newPageSizeSelected = PageSizes.TWELVE
      store.pageSizeSelected = newPageSizeSelected
      expect(store.pageSizeSelected).toBe(newPageSizeSelected)
    })
  })
})
