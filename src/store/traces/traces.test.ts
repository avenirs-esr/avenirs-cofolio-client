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
      expect(store.unassociatedCurrentPage).toBe(0)
      expect(store.associatedCurrentPage).toBe(0)
      expect(store.unassociatedPageSizeSelected).toBe(PageSizes.EIGHT)
      expect(store.associatedPageSizeSelected).toBe(PageSizes.EIGHT)
    })
  })

  BddTest().when('receiving new props', () => {
    BddTest().then('it should update the props', () => {
      const store = useTracesStore()
      const newCurrentPage = 1
      store.unassociatedCurrentPage = newCurrentPage
      store.associatedCurrentPage = newCurrentPage
      const newPageSizeSelected = PageSizes.TWELVE
      store.unassociatedPageSizeSelected = newPageSizeSelected
      store.associatedPageSizeSelected = newPageSizeSelected
      expect(store.unassociatedPageSizeSelected).toBe(newPageSizeSelected)
      expect(store.associatedPageSizeSelected).toBe(newPageSizeSelected)
    })
  })
})
