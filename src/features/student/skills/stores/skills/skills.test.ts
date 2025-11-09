import { useSkillsStore } from '@/features/student/skills/stores/skills/skills'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect } from 'vitest'

BddTest().given('a skills store', () => {
  let store: ReturnType<typeof useSkillsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useSkillsStore()
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
