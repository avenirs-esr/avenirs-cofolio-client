import { useTracesStore } from '@/store/traces/traces'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { createPinia, setActivePinia } from 'pinia'
import { BddTest } from 'tests/utils'

BddTest().given('a useTracesStore composable', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  BddTest().when('initializing', () => {
    BddTest().then('it should initialize with default props', () => {
      const store = useTracesStore()
      expect(store.currentPage).toBe(0)
      expect(store.pageSizeSelected).toBe(PageSizes.EIGHT)
    })
  })

  BddTest().when('receiving new props', () => {
    BddTest().then('it should update the props', () => {
      const store = useTracesStore()
      const newCurrentPage = 1
      store.currentPage = newCurrentPage
      const newPageSizeSelected = PageSizes.TWELVE
      store.pageSizeSelected = newPageSizeSelected
      expect(store.pageSizeSelected).toBe(newPageSizeSelected)
    })
  })
})
