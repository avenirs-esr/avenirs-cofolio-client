import { useProjectActivitiesStore } from '@/features/buildProject/stores/activities.store'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activities store', () => {
  let store: ReturnType<typeof useProjectActivitiesStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useProjectActivitiesStore()
  })

  BddTest().when('the store is initialized', () => {
    BddTest().then('it should have the default props', () => {
      expect(store.currentPage).toBe(0)
      expect(store.pageSizeSelected).toBe(PageSizes.FOUR)
    })

    BddTest().then('it should have the default library props', () => {
      expect(store.libraryCurrentPage).toBe(0)
      expect(store.libraryPageSizeSelected).toBe(PageSizes.FOUR)
    })
  })

  BddTest().when('the props are updated', () => {
    BddTest().then('it should have the updated props', () => {
      store.currentPage = 1
      const newPageSizeSelected = PageSizes.TWELVE
      store.pageSizeSelected = newPageSizeSelected
      expect(store.pageSizeSelected).toBe(newPageSizeSelected)
    })
  })

  BddTest().when('the library props are updated', () => {
    BddTest().then('it should have the updated library props', () => {
      store.libraryCurrentPage = 2
      store.libraryPageSizeSelected = PageSizes.TWELVE
      expect(store.libraryCurrentPage).toBe(2)
      expect(store.libraryPageSizeSelected).toBe(PageSizes.TWELVE)
    })
  })
})
